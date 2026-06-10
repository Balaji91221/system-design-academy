// ============================================================================
//  TINY PYTHON HIGHLIGHTER — dependency-free tokenizer.
//  Returns an array of { t: text, k: kind } so the CodeBlock can color each
//  token. Good enough for short, illustrative snippets (not a full parser).
// ============================================================================

const KEYWORDS = new Set([
  "def", "class", "return", "if", "elif", "else", "for", "while", "in", "not",
  "and", "or", "import", "from", "as", "with", "try", "except", "finally",
  "raise", "yield", "lambda", "pass", "break", "continue", "global", "nonlocal",
  "assert", "del", "is", "async", "await", "match", "case",
]);

const CONSTS = new Set(["None", "True", "False"]);

const BUILTINS = new Set([
  "print", "len", "range", "dict", "list", "set", "tuple", "int", "str", "float",
  "bool", "bytes", "open", "enumerate", "zip", "map", "filter", "sum", "min",
  "max", "sorted", "hash", "super", "self", "cls", "type", "isinstance", "abs",
  "round", "any", "all", "next", "iter", "format", "Exception", "property",
  "staticmethod", "classmethod", "dataclass",
]);

function classifyWord(w) {
  if (KEYWORDS.has(w)) return "keyword";
  if (CONSTS.has(w)) return "const";
  if (BUILTINS.has(w)) return "builtin";
  return "plain";
}

export function tokenizePython(src) {
  const tokens = [];
  // Order matters: comments, triple strings, strings, decorators, numbers,
  // identifiers, whitespace, then any single other char.
  const re = /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?''')|(f?"(?:\\.|[^"\\])*"|f?'(?:\\.|[^'\\])*')|(@[A-Za-z_]\w*)|(\b\d[\d_]*\.?\d*(?:[eE][+-]?\d+)?\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z0-9_])/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (m[1]) tokens.push({ t: m[0], k: "comment" });
    else if (m[2] || m[3]) tokens.push({ t: m[0], k: "string" });
    else if (m[4]) tokens.push({ t: m[0], k: "decorator" });
    else if (m[5]) tokens.push({ t: m[0], k: "number" });
    else if (m[6]) tokens.push({ t: m[0], k: classifyWord(m[0]) });
    else if (m[7]) tokens.push({ t: m[0], k: "ws" });
    else tokens.push({ t: m[0], k: "punct" });
  }
  return tokens;
}
