// The Meeting That Should Have Been an Email — make.fun entry
// One line, at most 200 characters: a joke about a meeting that
// should have been an email. The laugh lands in the last words:
// the narrator joined the meeting FROM the inbox, and the meeting
// itself is just the email being read out loud to everyone.
// The line is assembled from its two beats so each part stays
// readable: the setup (where I joined from) and the turn (what
// the meeting actually was).
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The setup: I never left the inbox — I attended from inside it.
const SETUP = "I joined the meeting from my inbox,";
// The turn: the meeting's whole agenda was the email itself.
const TURN = " so I could read the email while we discussed the email.";

function buildEntry(): string {
  return SETUP + TURN;
}

interface GateReport {
  ok: boolean;
  chars: number;
  lines: number;
}

function validateEntry(text: string): GateReport {
  const chars = [...text].length;
  const lines = text.split("\n").length;
  const ok =
    chars >= 1 && chars <= 200 && text.trim().length > 0 && lines === 1;
  return { ok, chars, lines };
}

function verifyWritten(outPath: string, expected: string): string {
  const written = readFileSync(outPath, "utf8");
  if (written !== expected) {
    throw new Error("read-back mismatch");
  }
  return createHash("sha256").update(written, "utf8").digest("hex");
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const entry = buildEntry();
  const gate = validateEntry(entry);
  if (!gate.ok) {
    throw new Error(
      `gate failed: ${gate.chars} characters, ${gate.lines} lines`,
    );
  }
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, entry, "utf8");
  const sha = verifyWritten(outPath, entry);
  console.log(
    `gate passes: ${gate.chars} code points, ${gate.lines} line, sha256 ${sha}`,
  );
  console.log(`wrote ${outPath}`);
  console.log(`verified: ${JSON.stringify(entry)}`);
}

main();
