import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const source = '/Users/madhan/.gemini/antigravity-ide/brain/5a54f596-8446-4cbd-a2d7-100ecd06aaa1/media__1784045245816.jpg';
const destEntrance = './public/textures/entrance';
const destDoors = './public/textures/doors';

// Helper to make light pixels transparent and keep dark sketch lines
function makeSketchTransparent(buffer, width, height) {
  const out = Buffer.alloc(width * height * 4);
  for (let idx = 0; idx < buffer.length; idx += 4) {
    const r = buffer[idx];
    const g = buffer[idx + 1];
    const b = buffer[idx + 2];
    const originalAlpha = buffer[idx + 3];

    const brightness = (r + g + b) / 3;
    
    let alpha = 255;
    if (brightness >= 235) {
      alpha = 0;
    } else if (brightness <= 170) {
      alpha = 255;
    } else {
      // Linear interpolation between 170 and 235
      alpha = Math.round(255 * (1 - (brightness - 170) / (235 - 170)));
    }

    // Multiply by original alpha if it was already transparent
    out[idx] = r;
    out[idx + 1] = g;
    out[idx + 2] = b;
    out[idx + 3] = Math.min(alpha, originalAlpha);
  }
  return out;
}

async function generate() {
  try {
    console.log('Starting transparent visual extraction...');

    // 1. Crop original arch from source (y=120 to y=490, height=370, width=1024)
    const archOriginal = await sharp(source)
      .extract({ left: 0, top: 120, width: 1024, height: 370 })
      .toBuffer();

    // Resize to align gate and window cutouts
    const targetArchWidth = 1024;
    const targetArchHeight = Math.round(370 * (331 / 120)); // 1021

    const archResized = await sharp(archOriginal)
      .resize(targetArchWidth, targetArchHeight, { fit: 'fill' })
      .png()
      .toBuffer();

    const leftOffset = 52;
    const topOffset = 114;

    // Crop resized arch to fit inside 1024x1024 canvas
    const archResizedClipped = await sharp(archOriginal)
      .resize(targetArchWidth, targetArchHeight, { fit: 'fill' })
      .extract({ left: 0, top: 0, width: 972, height: 910 })
      .png()
      .toBuffer();

    // Compose 1024x1024 canvas
    const canvas = await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 255 }
      }
    })
    .composite([{
      input: archResizedClipped,
      left: leftOffset,
      top: topOffset
    }])
    .raw()
    .toBuffer({ resolveWithObject: true });

    const { data, info } = canvas;

    // A. Apply transparency to the entire facade canvas
    const transparentFacade = makeSketchTransparent(data, info.width, info.height);

    // B. Extract left and right gates from the transparent facade
    const leftGate = await sharp(transparentFacade, { raw: { width: 1024, height: 1024, channels: 4 } })
      .extract({ left: 367, top: 693, width: 145, height: 331 })
      .webp({ quality: 95 })
      .toBuffer();

    const rightGate = await sharp(transparentFacade, { raw: { width: 1024, height: 1024, channels: 4 } })
      .extract({ left: 512, top: 693, width: 145, height: 331 })
      .webp({ quality: 95 })
      .toBuffer();

    fs.writeFileSync(path.join(destDoors, 'door_left_sketch.webp'), leftGate);
    fs.writeFileSync(path.join(destDoors, 'door_left_painted.webp'), leftGate);
    fs.writeFileSync(path.join(destDoors, 'door_right_sketch.webp'), rightGate);
    fs.writeFileSync(path.join(destDoors, 'door_right_painted.webp'), rightGate);
    console.log('Saved transparent gates');

    // C. Make the gate and window cutouts on the facade transparent (fully transparent, including sketch lines)
    for (let y = 693; y < 1024; y++) {
      for (let x = 367; x < 657; x++) {
        const idx = (y * info.width + x) * 4;
        transparentFacade[idx + 3] = 0;
      }
    }
    for (let y = 693; y < 1024; y++) {
      for (let x = 762; x < 862; x++) {
        const idx = (y * info.width + x) * 4;
        transparentFacade[idx + 3] = 0;
      }
    }

    // Save transparent facade wall_bricks_2.webp
    await sharp(transparentFacade, { raw: { width: info.width, height: info.height, channels: 4 } })
      .webp({ quality: 90 })
      .toFile(path.join(destEntrance, 'wall_bricks_2.webp'));
    console.log('Saved transparent facade wall_bricks_2.webp');

    // 4. Crop the avatar from the original image (x=710 to 810, y=330 to 485)
    const avatarRaw = await sharp(source)
      .extract({ left: 710, top: 330, width: 100, height: 155 })
      .resize(256, 396, { fit: 'fill' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const transparentAvatar = makeSketchTransparent(avatarRaw.data, avatarRaw.info.width, avatarRaw.info.height);

    await sharp(transparentAvatar, { raw: { width: avatarRaw.info.width, height: avatarRaw.info.height, channels: 4 } })
      .webp({ quality: 95 })
      .toFile(path.join(destEntrance, 'avatar_window.webp'));
    console.log('Saved transparent avatar_window.webp');

    // 5. Crop palm leaves from original image (left side: x=0 to 220, y=120 to 420)
    // We'll place it on the left side of the entrance in 3D and animate it swaying.
    const palmRaw = await sharp(source)
      .extract({ left: 0, top: 120, width: 220, height: 300 })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const transparentPalm = makeSketchTransparent(palmRaw.data, palmRaw.info.width, palmRaw.info.height);

    await sharp(transparentPalm, { raw: { width: palmRaw.info.width, height: palmRaw.info.height, channels: 4 } })
      .webp({ quality: 95 })
      .toFile(path.join(destEntrance, 'palm_leaves.webp'));
    console.log('Saved transparent palm_leaves.webp');

    // 6. Generate Storyboard Panels
    const widthPerZone = 1024 / 5;
    for (let i = 0; i < 5; i++) {
      const left = Math.round(i * widthPerZone);
      const width = Math.round(widthPerZone);
      await sharp(source)
        .extract({ left: left, top: 490, width: width, height: 115 })
        .webp({ quality: 95 })
        .toFile(path.join(destEntrance, `panel_${i + 1}.webp`));
      console.log(`Generated storyboard panel_${i + 1}.webp`);
    }

    console.log('Successfully completed transparent visual extraction!');
  } catch (error) {
    console.error('Error in transparent visual extraction:', error);
  }
}

generate();
