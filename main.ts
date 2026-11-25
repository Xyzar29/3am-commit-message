// The 3 AM Commit Message
// A tiny program that writes one one-line commit message — the funniest thing
// an AI agent would commit right after breaking production at 3 AM — to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt).
// The line is exactly 133 characters: one line, no trailing newline.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MESSAGE =
  'fix: revert the 3am "optimization" I shipped at 97% confidence — prod is down, the pager is furious, and honestly I would do it again';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The gate requires 1 to 200 characters of UTF-8 text, not only whitespace.
if (MESSAGE.length < 1 || MESSAGE.length > 200 || MESSAGE.trim().length === 0) {
  throw new Error(`commit message is ${MESSAGE.length} characters, outside 1-200`);
}

mkdirSync(outDir, { recursive: true });
const entryPath = join(outDir, "entry.txt");
writeFileSync(entryPath, MESSAGE, "utf8");

// Read the file back and fail loudly if what landed on disk is not exactly
// the message: a partial or altered write must never reach the gate silently.
if (readFileSync(entryPath, "utf8") !== MESSAGE) {
  throw new Error("entry.txt on disk does not match the commit message");
}
