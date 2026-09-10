import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const source = './src/assets/cit camp.png';
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
    console.log('Starting high-res visual extraction from PNG...');

    // 1. Crop original arch from PNG source
    // Original coordinates: left=0, top=120, width=1024, height=370 (1024x682 image)
    // Scale factors: X = 1.5, Y = 1024 / 682 = 1.501466...
    const leftArch = 0;
    const topArch = Math.round(120 * (1024 / 682)); // 180
    const widthArch = 1536;
    const heightArch = Math.round(370 * (1024 / 682)); // 556
    
    console.log(`Arch crop coordinates: left=${leftArch}, top=${topArch}, width=${widthArch}, height=${heightArch}`);

    const archOriginal = await sharp(source)
      .extract({ left: leftArch, top: topArch, width: widthArch, height: heightArch })
      .toBuffer();

    // Resize to align gate and window cutouts (keeps destination 1024x1024 coordinates)
    const targetArchWidth = 1024;
    const targetArchHeight = Math.round(370 * (331 / 120)); // 1021

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
    console.log('Saved high-res transparent gates');

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
    console.log('Saved high-res transparent facade wall_bricks_2.webp');

    // 4. Crop the avatar from the original image (x=710 to 810, y=330 to 485 in 1024x682 space)
    // Scaled: left=1065, top=495, width=150, height=233
    const leftAv = 1065;
    const topAv = Math.round(330 * (1024 / 682)); // 495
    const widthAv = 150;
    const heightAv = Math.round(155 * (1024 / 682)); // 233
    
    console.log(`Avatar crop coordinates: left=${leftAv}, top=${topAv}, width=${widthAv}, height=${heightAv}`);

    const avatarRaw = await sharp(source)
      .extract({ left: leftAv, top: topAv, width: widthAv, height: heightAv })
      .resize(256, 396, { fit: 'fill' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const transparentAvatar = makeSketchTransparent(avatarRaw.data, avatarRaw.info.width, avatarRaw.info.height);

    await sharp(transparentAvatar, { raw: { width: avatarRaw.info.width, height: avatarRaw.info.height, channels: 4 } })
      .webp({ quality: 95 })
      .toFile(path.join(destEntrance, 'avatar_window.webp'));
    console.log('Saved high-res transparent avatar_window.webp');

    // 5. Crop palm leaves from original image (left side: x=0 to 220, y=120 to 420 in 1024x682 space)
    // Scaled: left=0, top=180, width=330, height=451
    const leftPl = 0;
    const topPl = Math.round(120 * (1024 / 682)); // 180
    const widthPl = 330;
    const heightPl = Math.round(300 * (1024 / 682)); // 451

    console.log(`Palm leaves crop coordinates: left=${leftPl}, top=${topPl}, width=${widthPl}, height=${heightPl}`);

    const palmRaw = await sharp(source)
      .extract({ left: leftPl, top: topPl, width: widthPl, height: heightPl })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const transparentPalm = makeSketchTransparent(palmRaw.data, palmRaw.info.width, palmRaw.info.height);

    await sharp(transparentPalm, { raw: { width: palmRaw.info.width, height: palmRaw.info.height, channels: 4 } })
      .webp({ quality: 95 })
      .toFile(path.join(destEntrance, 'palm_leaves.webp'));
    console.log('Saved high-res transparent palm_leaves.webp');

    // 6. Generate Storyboard Panels (though removed from UI, we generate to keep files existing)
    const widthPerZone = 1536 / 5;
    const topPanel = Math.round(490 * (1024 / 682)); // 736
    const heightPanel = Math.round(115 * (1024 / 682)); // 173
    for (let i = 0; i < 5; i++) {
      const left = Math.round(i * widthPerZone);
      const width = Math.round(widthPerZone);
      await sharp(source)
        .extract({ left: left, top: topPanel, width: width, height: heightPanel })
        .webp({ quality: 95 })
        .toFile(path.join(destEntrance, `panel_${i + 1}.webp`));
      console.log(`Generated storyboard panel_${i + 1}.webp`);
    }

    console.log('Successfully completed high-res transparent visual extraction!');
  } catch (error) {
    console.error('Error in visual extraction:', error);
  }
}

generate();
