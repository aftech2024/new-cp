import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "@/i18n/translations";

// ---------------------------------------------------------------------------
// Photo attachments — downscaled in the browser so uploads stay small and the
// API is never sent a 12-megapixel phone photo.

const MAX_EDGE = 1280;
const MAX_FILE_BYTES = 15 * 1024 * 1024;

export class ImageError extends Error {
  constructor(public code: "image_type" | "image_size") {
    super(code);
  }
}

export async function prepareImage(file: File): Promise<string> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) throw new ImageError("image_type");
  if (file.size > MAX_FILE_BYTES) throw new ImageError("image_size");

  const url = window.URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new window.Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new ImageError("image_type"));
      el.src = url;
    });
    const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new ImageError("image_type");
    ctx.fillStyle = "#ffffff"; // transparent PNGs would otherwise turn black as JPEG
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    window.URL.revokeObjectURL(url);
  }
}

// ---------------------------------------------------------------------------
// Voice input — the Web Speech API. Chrome, Edge and Safari ship it (Safari
// under the webkit prefix); elsewhere the mic button simply isn't shown.

interface RecognitionResultList {
  length: number;
  [index: number]: { 0: { transcript: string } };
}

interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: { results: RecognitionResultList }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

function recognitionCtor(): (new () => Recognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useDictation(lang: Lang, onTranscript: (text: string) => void, onDenied: () => void) {
  const Ctor = useMemo(recognitionCtor, []);
  const [listening, setListening] = useState(false);
  const recRef = useRef<Recognition | null>(null);
  const handlers = useRef({ onTranscript, onDenied });

  useEffect(() => {
    handlers.current = { onTranscript, onDenied };
  }, [onTranscript, onDenied]);

  const stop = useCallback(() => recRef.current?.stop(), []);

  const start = useCallback(() => {
    if (!Ctor || recRef.current) return;
    const rec = new Ctor();
    rec.lang = lang === "id" ? "id-ID" : "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) text += event.results[i][0].transcript;
      handlers.current.onTranscript(text.trim());
    };
    rec.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") handlers.current.onDenied();
    };
    rec.onend = () => {
      recRef.current = null;
      setListening(false);
    };
    recRef.current = rec;
    setListening(true);
    rec.start();
  }, [Ctor, lang]);

  useEffect(() => () => recRef.current?.abort(), []);

  return { supported: Ctor !== null, listening, start, stop };
}

// ---------------------------------------------------------------------------
// Read-aloud — speechSynthesis, using a voice in the site language when the
// device has one.

export function useSpeaker(lang: Lang) {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, [supported]);

  const speak = useCallback(
    (id: string, text: string) => {
      if (!supported) return;
      window.speechSynthesis.cancel();
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = lang === "id" ? "id-ID" : "en-US";
      const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith(lang));
      if (voice) utterance.voice = voice;
      const done = () => setSpeakingId((current) => (current === id ? null : current));
      utterance.onend = done;
      utterance.onerror = done;
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    },
    [lang, supported],
  );

  useEffect(
    () => () => {
      if (supported) window.speechSynthesis.cancel();
    },
    [supported],
  );

  return { supported, speakingId, speak, stop };
}
