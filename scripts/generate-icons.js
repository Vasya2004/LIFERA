const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const svgIcon = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#FF5A1F"/>
  <text x="256" y="340" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="320" fill="white">L</text>
</svg>`;

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const svgPath = path.join(iconsDir, 'icon.svg');
fs.writeFileSync(svgPath, svgIcon);

let sharpAvailable = false;
try {
  require.resolve('sharp');
  sharpAvailable = true;
} catch {
  sharpAvailable = false;
}

if (sharpAvailable) {
  const sharp = require('sharp');
  async function generate() {
    for (const size of sizes) {
      await sharp(Buffer.from(svgIcon))
        .resize(size, size)
        .png()
        .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
      console.log(`Generated ${size}x${size}`);
    }
  }
  generate().catch(console.error);
} else {
  console.log('sharp not available, generating placeholder PNGs via fallback...');
  for (const size of sizes) {
    const pngHeader = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    const placeholder = Buffer.alloc(size * size * 4 + 1024);
    pngHeader.copy(placeholder);
    fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), placeholder);
    console.log(`Placeholder ${size}x${size} (install sharp for real icons)`);
  }
}
