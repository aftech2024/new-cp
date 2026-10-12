import agentIcon from "@/assets/images/chat/cs-agent.png";

/**
 * The customer-service headset glyph, drawn as a CSS mask so it takes the
 * current text colour — set it with a text-* class like any icon.
 */
export default function AgentIcon({ className = "h-5 w-5" }: { className?: string }) {
  const mask = `url(${agentIcon})`;
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
