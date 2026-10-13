import { CopyButton } from "./CopyButton";
import { tokenizeLine } from "./highlight";

type Props = {
  code: string;
  lang: "ts" | "bash" | "python";
  title?: string;
  snippet: string; // analytics id
  lineNumbers?: boolean;
};

const COLOR = {
  plain: "text-slate-200",
  comment: "text-slate-400",
  string: "text-emerald-300",
  keyword: "text-arc-300",
  number: "text-amber-300",
} as const;

export function CodeBlock({ code, lang, title, snippet, lineNumbers = false }: Props) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
      <figcaption className="flex items-center justify-between gap-2 border-b border-white/5 px-4 py-2 text-xs text-slate-400">
        <span className="font-mono">{title ?? lang}</span>
        <CopyButton value={code} label={`Copy ${title ?? lang} snippet`} event={{ name: "snippet_copy", props: { snippet } }} />
      </figcaption>
      <pre tabIndex={0} aria-label={`${title ?? lang} code`} className="overflow-x-auto p-4 font-mono text-[13px] leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-arc-400">
        <code>
          {lines.map((line, n) => (
            <span key={n} className="block whitespace-pre">
              {lineNumbers && <span aria-hidden="true" className="mr-4 inline-block w-5 select-none text-right text-slate-500">{n + 1}</span>}
              {tokenizeLine(line, lang).map((tok, k) => (
                <span key={k} className={COLOR[tok.t]}>{tok.v}</span>
              ))}
              {line === "" && "\u200b"}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
