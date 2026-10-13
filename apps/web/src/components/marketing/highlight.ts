/** Minimal server-side tokenizer: comments, strings, keywords. No client JS. */
export type Token = { t: "plain" | "comment" | "string" | "keyword" | "number"; v: string };

const KW = /^(import|from|const|let|await|async|return|export|function|new|as|def|class|if|else|true|false|type|interface)\b/;

export function tokenizeLine(line: string, lang: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  const commentStart = lang === "bash" || lang === "python" ? "#" : "//";
  while (i < line.length) {
    const rest = line.slice(i);
    if (rest.startsWith(commentStart) && (commentStart !== "#" || i === 0 || /\s/.test(line[i - 1]))) {
      out.push({ t: "comment", v: rest });
      break;
    }
    const q = rest[0];
    if (q === '"' || q === "'" || q === "`") {
      let j = 1;
      while (j < rest.length && rest[j] !== q) j += rest[j] === "\\" ? 2 : 1;
      out.push({ t: "string", v: rest.slice(0, j + 1) });
      i += j + 1;
      continue;
    }
    const kw = (i === 0 || /[^\w$]/.test(line[i - 1])) && rest.match(KW);
    if (kw) {
      out.push({ t: "keyword", v: kw[0] });
      i += kw[0].length;
      continue;
    }
    const last = out[out.length - 1];
    if (last && last.t === "plain") last.v += line[i];
    else out.push({ t: "plain", v: line[i] });
    i++;
  }
  return out;
}
