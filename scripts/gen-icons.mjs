import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";

mkdirSync("public/icons", { recursive: true });

const BG = "#0a0a0b";
const K = "#a78bfa";

// Bold rounded "K" lettermark — flat violet on black, in the spirit of
// Hinge's chunky geometric wordmark: thick monoline strokes, round caps,
// no gradients or effects.
const kStrokes = (strokeWidth) => `
  <path d="M190 150 L190 362" stroke="${K}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
  <path d="M196 256 L348 150" stroke="${K}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
  <path d="M196 256 L348 362" stroke="${K}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
`;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="${BG}"/>
  ${kStrokes(56)}
</svg>`;

// Maskable: full-bleed background (the OS applies its own shape mask), so
// the K is scaled down and kept within the guaranteed-visible safe zone.
const svgMaskable = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>
  <path d="M209 180 L209 332" stroke="${K}" stroke-width="40" stroke-linecap="round"/>
  <path d="M213 256 L322 180" stroke="${K}" stroke-width="40" stroke-linecap="round"/>
  <path d="M213 256 L322 332" stroke="${K}" stroke-width="40" stroke-linecap="round"/>
</svg>`;

const jobs = [
  { svg, out: "public/icons/icon-192.png", size: 192 },
  { svg, out: "public/icons/icon-512.png", size: 512 },
  { svg, out: "public/icons/apple-touch-icon.png", size: 180 },
  { svg: svgMaskable, out: "public/icons/maskable-512.png", size: 512 },
  { svg, out: "public/favicon.png", size: 64 },
];

for (const job of jobs) {
  await sharp(Buffer.from(job.svg)).resize(job.size, job.size).png().toFile(job.out);
  console.log("wrote", job.out);
}

writeFileSync("public/icons/icon.svg", svg.trim());
console.log("done");
