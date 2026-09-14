import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";

mkdirSync("public/icons", { recursive: true });

const svgFull = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#0b1220"/>
  <rect width="512" height="512" rx="112" fill="url(#g)"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0f2a43"/>
      <stop offset="1" stop-color="#0b1220"/>
    </linearGradient>
  </defs>
  <path d="M256 118 L286 118 L286 226 L394 226 L394 256 L286 256 L286 364 L226 364 L226 256 L118 256 L118 226 L226 226 Z" fill="#e11d2f"/>
  <path d="M96 300 L168 300 L188 260 L212 340 L236 240 L258 300 L416 300" stroke="#f8fafc" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>
</svg>`;

// Simpler mark used at small sizes: plus sign only, no pulse line (keeps legibility)
const svgSimple = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#0b1220"/>
  <rect width="512" height="512" rx="112" fill="url(#g)"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0f2a43"/>
      <stop offset="1" stop-color="#0b1220"/>
    </linearGradient>
  </defs>
  <path d="M256 108 L296 108 L296 216 L404 216 L404 256 L296 256 L296 364 L216 364 L216 256 L108 256 L108 216 L216 216 Z" fill="#e11d2f"/>
</svg>`;

const svgMaskable = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0b1220"/>
  <rect width="512" height="512" fill="url(#g)"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0f2a43"/>
      <stop offset="1" stop-color="#0b1220"/>
    </linearGradient>
  </defs>
  <path d="M256 156 L286 156 L286 226 L356 226 L356 256 L286 256 L286 326 L256 326 L256 256 L186 256 L186 226 L256 226 Z" fill="#e11d2f"/>
</svg>`;

const jobs = [
  { svg: svgSimple, out: "public/icons/icon-192.png", size: 192 },
  { svg: svgFull, out: "public/icons/icon-512.png", size: 512 },
  { svg: svgSimple, out: "public/icons/apple-touch-icon.png", size: 180 },
  { svg: svgMaskable, out: "public/icons/maskable-512.png", size: 512 },
  { svg: svgSimple, out: "public/favicon.png", size: 64 },
];

for (const job of jobs) {
  await sharp(Buffer.from(job.svg)).resize(job.size, job.size).png().toFile(job.out);
  console.log("wrote", job.out);
}

writeFileSync("public/icons/icon.svg", svgSimple.trim());
console.log("done");
