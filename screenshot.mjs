// Full-page screenshots via the locally installed Google Chrome (headless).
// Usage: node screenshot.mjs http://localhost:3000 [label] [widths...]
//   node screenshot.mjs http://localhost:3000 round1 1440 768 390
// Saves to "temporary screenshots/<label>-<width>-<n>.png" without overwriting.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const [url = "http://localhost:3000", label = "shot", ...widthArgs] = process.argv.slice(2);
const widths = widthArgs.length ? widthArgs.map(Number) : [1440, 768, 390];
const height = Number(process.env.SHOT_HEIGHT || 9000); // tall window ≈ full page
const chrome = process.env.CHROME_BIN || "google-chrome";
const outDir = resolve(import.meta.dirname, "temporary screenshots");
mkdirSync(outDir, { recursive: true });

for (const w of widths) {
  let n = 1;
  let out;
  do { out = join(outDir, `${label}-${w}-${n++}.png`); } while (existsSync(out));
  execFileSync(chrome, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
    `--window-size=${w},${height}`, "--virtual-time-budget=6000",
    `--screenshot=${out}`, url,
  ], { stdio: "ignore" });
  console.log(out);
}
