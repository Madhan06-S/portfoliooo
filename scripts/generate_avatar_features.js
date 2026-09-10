import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dest = './public/textures/entrance';

async function generate() {
  try {
    console.log('Generating avatar visual features...');

    // 1. Hover Smile SVG (a slightly curved line)
    const hoverSmileSvg = `
      <svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M 12 10 Q 32 25 52 10" fill="none" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `;
    await sharp(Buffer.from(hoverSmileSvg))
      .webp()
      .toFile(path.join(dest, 'smile_hover.webp'));
    console.log('Generated smile_hover.webp');

    // 2. Big Smile SVG (a wide open mouth with teeth/fill)
    const bigSmileSvg = `
      <svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
        <!-- Hand-drawn style open smile -->
        <path d="M 10 8 Q 32 30 54 8 Z" fill="#ffffff" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    await sharp(Buffer.from(bigSmileSvg))
      .webp()
      .toFile(path.join(dest, 'smile_big.webp'));
    console.log('Generated smile_big.webp');

    // 3. Closed Eye SVG (downward arch)
    const closedEyeSvg = `
      <svg width="64" height="32" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
        <path d="M 10 16 Q 32 6 54 16" fill="none" stroke="#1a1a1a" stroke-width="4.5" stroke-linecap="round"/>
      </svg>
    `;
    await sharp(Buffer.from(closedEyeSvg))
      .webp()
      .toFile(path.join(dest, 'eyes_closed.webp'));
    console.log('Generated eyes_closed.webp');

    console.log('Avatar features successfully generated!');
  } catch (error) {
    console.error('Error generating avatar features:', error);
  }
}

generate();
