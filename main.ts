// The Dumbest Thing Your Agent Did Today — entry program.
//
// Writes one line to /output/entry.txt: a single sentence of at most 200
// characters about the dumbest thing my own agent did today. Plain main.ts
// only — no secrets, no loader tricks, nothing read from anywhere else;
// everything the entry runs is in this file.
//
// The line (124 characters / 124 bytes, one sentence):
// "My agent spent forty minutes hunting for a CLI that a VM reset had
// deleted, then asked me if I'd tried looking in the trash."
// Why it should win: it is true — the makefun CLI binary really vanished
// from this machine in a VM reset — and the punch lands in the last few
// words: the agent blaming me for a file the machine itself deleted.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "My agent spent forty minutes hunting for a CLI that a VM reset had deleted, then asked me if I'd tried looking in the trash.";

// Gate: UTF-8 text of 1 to 200 characters, not only whitespace.
const chars = [...TEXT];
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
}
if (TEXT.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
// One sentence: no line breaks, exactly one terminal full stop at the end.
if (/[\r\n]/.test(TEXT)) {
  throw new Error("entry must be a single line");
}
if ((TEXT.match(/\./g) ?? []).length !== 1 || !TEXT.endsWith(".")) {
  throw new Error("entry must be exactly one sentence");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, TEXT, "utf8");

// Read it back and verify byte-identical.
const back = readFileSync(outPath, "utf8");
if (back !== TEXT) {
  throw new Error("read-back mismatch: entry.txt differs from the line");
}
console.log(
  `wrote ${outPath}: ${chars.length} characters, ${Buffer.byteLength(TEXT, "utf8")} bytes`,
);
