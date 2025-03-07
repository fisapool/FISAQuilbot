const fs = require('fs');
const { createCanvas, Image } = require('canvas');

// Error logging utility
const logError = (context, error) => {
  console.error(`Icon Generation Error (${context}):`, error.message);
};

// SVG content for each size
const iconContents = {
  128: `<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <circle cx="64" cy="64" r="64" fill="#4A4A4A"/>
    <rect x="34" y="34" width="60" height="40" fill="white"/>
    <circle cx="48" cy="54" r="6" fill="#4A4A4A"/>
    <circle cx="80" cy="54" r="6" fill="#4A4A4A"/>
    <rect x="44" y="70" width="40" height="4" fill="#4A4A4A"/>
    <rect x="54" y="74" width="20" height="10" fill="#4A4A4A"/>
  </svg>`,
  48: `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="24" fill="#4A4A4A"/>
    <rect x="12" y="12" width="24" height="16" fill="white"/>
    <circle cx="18" cy="20" r="2.5" fill="#4A4A4A"/>
    <circle cx="30" cy="20" r="2.5" fill="#4A4A4A"/>
    <rect x="16" y="26" width="16" height="2" fill="#4A4A4A"/>
    <rect x="20" y="28" width="8" height="4" fill="#4A4A4A"/>
  </svg>`,
  16: `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="8" fill="#4A4A4A"/>
    <rect x="4" y="4" width="8" height="5" fill="white"/>
    <circle cx="6" cy="6.5" r="0.8" fill="#4A4A4A"/>
    <circle cx="10" cy="6.5" r="0.8" fill="#4A4A4A"/>
    <rect x="5.5" y="8.5" width="5" height="0.8" fill="#4A4A4A"/>
    <rect x="6.5" y="9.3" width="3" height="1.2" fill="#4A4A4A"/>
  </svg>`
};

async function svgToPng(svgString, width, height) {
  try {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    const svgUrl = `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toBuffer('image/png'));
        } catch (err) {
          reject(new Error(`Failed to draw image: ${err.message}`));
        }
      };
      img.onerror = () => reject(new Error('Failed to load SVG'));
      img.src = svgUrl;
    });
  } catch (error) {
    throw new Error(`SVG to PNG conversion failed: ${error.message}`);
  }
}

async function createIcon(size) {
  try {
    const content = iconContents[size];
    if (!content) {
      throw new Error(`No SVG content found for size ${size}`);
    }

    const pngBuffer = await svgToPng(content, size, size);
    const outputPath = `extension/icon${size}.png`;
    
    fs.writeFileSync(outputPath, pngBuffer);
    console.log(`✓ Created ${outputPath}`);
  } catch (error) {
    logError(`creating icon${size}`, error);
  }
}

async function main() {
  try {
    await Promise.all([
      createIcon(128),
      createIcon(48),
      createIcon(16)
    ]);
    console.log('✓ Icon generation complete');
  } catch (error) {
    logError('main process', error);
    process.exit(1);
  }
}

main(); 