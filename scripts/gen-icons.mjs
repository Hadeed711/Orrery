/** One-off: rasterize the Orrery orb mark into PWA icons (run: node scripts/gen-icons.mjs). */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const svg = (pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#070a12"/>
  <g transform="translate(256 256) scale(${1 - pad})">
    <circle r="150" fill="none" stroke="#d9a854" stroke-width="14"/>
    <ellipse rx="228" ry="86" fill="none" stroke="#3d4759" stroke-width="10" transform="rotate(-18)"/>
    <circle cx="216" cy="-70" r="26" fill="#d9a854" transform="rotate(-18)"/>
    <circle r="64" fill="#d9a854"/>
  </g>
</svg>`;

const outDir = path.join("apps", "web", "public", "icons");
fs.mkdirSync(outDir, { recursive: true });

await sharp(Buffer.from(svg(0))).resize(192, 192).png().toFile(path.join(outDir, "icon-192.png"));
await sharp(Buffer.from(svg(0))).resize(512, 512).png().toFile(path.join(outDir, "icon-512.png"));
// Maskable: 20% safe-zone padding so launchers can crop to any shape.
await sharp(Buffer.from(svg(0.35))).resize(512, 512).png().toFile(path.join(outDir, "maskable-512.png"));
console.log("icons written to", outDir);
