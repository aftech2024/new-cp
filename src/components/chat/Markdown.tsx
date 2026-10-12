import type { ReactNode } from "react";

/**
 * The small slice of Markdown the assistant is allowed to use: paragraphs,
 * "- " / "1. " lists, **bold** and `code`. Rendered as React nodes — never as
 * HTML — so a reply cannot inject markup.
 */

const BULLET_RE = /^\s*(?:[-•*]|\d+[.)])\s+/;

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={i} className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12.5px] text-white">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function Markdown({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const lines = paragraph;
    nodes.push(
      <p key={nodes.length}>
        {lines.map((line, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {inline(line)}
          </span>
        ))}
      </p>,
    );
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    const { ordered, items } = list;
    const className = `flex flex-col gap-1.5 pl-5 marker:text-white/35 ${ordered ? "list-decimal" : "list-disc"}`;
    const children = items.map((item, i) => <li key={i}>{inline(item)}</li>);
    nodes.push(
      ordered ? (
        <ol key={nodes.length} className={className}>
          {children}
        </ol>
      ) : (
        <ul key={nodes.length} className={className}>
          {children}
        </ul>
      ),
    );
    list = null;
  };

  for (const line of text.split("\n")) {
    if (line.trim() === "") {
      flushParagraph();
      flushList();
    } else if (BULLET_RE.test(line)) {
      flushParagraph();
      const ordered = /^\s*\d/.test(line);
      if (list && list.ordered !== ordered) flushList();
      if (!list) list = { ordered, items: [] };
      list.items.push(line.replace(BULLET_RE, ""));
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  flushList();

  return <div className="flex flex-col gap-3">{nodes}</div>;
}
