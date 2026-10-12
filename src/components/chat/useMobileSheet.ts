import { useEffect, useState } from "react";

const QUERY = "(max-width: 639px)";

export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.matchMedia(QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

/**
 * While the chat is a full-screen sheet on a phone: lock the page behind it and
 * follow the visual viewport, so the composer stays above the on-screen
 * keyboard instead of disappearing behind it (iOS does not shrink 100dvh for
 * the keyboard).
 */
export function useSheetViewport(active: boolean): { height: number; top: number } | null {
  const [box, setBox] = useState<{ height: number; top: number } | null>(null);

  useEffect(() => {
    if (!active) {
      setBox(null);
      return;
    }
    const vv = window.visualViewport;
    const update = () => setBox(vv ? { height: vv.height, top: vv.offsetTop } : null);
    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      document.body.style.overflow = overflow;
    };
  }, [active]);

  return box;
}
