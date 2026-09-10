import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const source = '/Users/madhan/.gemini/antigravity-ide/brain/5a54f596-8446-4cbd-a2d7-100ecd06aaa1/media__1784045245816.jpg';
const destEntrance = './public/textures/entrance';
const destDoors = './public/textures/doors';

async function generate() {
  try {
    console.log('Starting new visual extraction...');

    // 1. Crop original arch from source (y=120 to y=490, height=370, width=1024)
    const archOriginal = await sharp(source)
      .extract({ left: 0, top: 120, width: 1024, height: 370 })
      .toBuffer();

    // 2. Resize the arch to align the gate and window cutouts.
    // The gate in original crop:
    // x = 315 to 605 (width = 290)
    // y = 330 to 450 (height = 120) -> relative to crop (y - 120): y = 210 to 330
    // Target gate size in 1024x1024:
    // width = 290 (same)
    // height = 331
    // Scale factor: width scale = 1.0, height scale = 331 / 120 = 2.7583
    const targetArchWidth = 1024;
    const targetArchHeight = Math.round(370 * (331 / 120)); // 1021

    const archResized = await sharp(archOriginal)
      .resize(targetArchWidth, targetArchHeight, { fit: 'fill' })
      .png()
      .toBuffer();

    // Gate center in original is x = 460.
    // We want the gate center to be x = 512.
    // So horizontal offset = 512 - 460 = 52.
    // Gate bottom in resized arch is at:
    // y = 330 * 2.7583 = 910.
    // We want gate bottom at y = 1024.
    // So vertical offset = 1024 - 910 = 114.
    const leftOffset = 52;
    const topOffset = 114;

    // Crop the resized arch to fit inside 1024x1024 canvas
    // Width to crop: 1024 - 52 = 972
    // Height to crop: 1024 - 114 = 910
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
        background: { r: 255, g: 255, b: 255, alpha: 0 }
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

    // 3. Extract left and right gates from the canvas before making it transparent
    // Gate is at x: 367 to 657 (left=367, width=290), y: 693 to 1024 (top=693, height=331)
    // Left gate: x: 367 to 512 (width=145)
    // Right gate: x: 512 to 657 (width=145)
    // In EntranceDoors.jsx, doorWidth is 0.94, so the door meshes are 0.94 x 2.4.
    // Width of both doors together is 1.88.
    // Let's crop the doors!
    const leftGateData = await sharp(data, { raw: { width: 1024, height: 1024, channels: 4 } })
      .extract({ left: 367, top: 693, width: 145, height: 331 })
      .webp({ quality: 95 })
      .toBuffer();

    const rightGateData = await sharp(data, { raw: { width: 1024, height: 1024, channels: 4 } })
      .extract({ left: 512, top: 693, width: 145, height: 331 })
      .webp({ quality: 95 })
      .toBuffer();

    fs.writeFileSync(path.join(destDoors, 'door_left_sketch.webp'), leftGateData);
    fs.writeFileSync(path.join(destDoors, 'door_left_painted.webp'), leftGateData);
    fs.writeFileSync(path.join(destDoors, 'door_right_sketch.webp'), rightGateData);
    fs.writeFileSync(path.join(destDoors, 'door_right_painted.webp'), rightGateData);
    console.log('Saved gates textures');

    // 4. Crop the avatar from the original image (x=710 to 810, y=330 to 485)
    // We will resize it to 256x384 so it is high quality and sharp.
    await sharp(source)
      .extract({ left: 710, top: 330, width: 100, height: 155 })
      .resize(256, 396, { fit: 'fill' })
      .webp({ quality: 95 })
      .toFile(path.join(destEntrance, 'avatar_window.webp'));
    console.log('Saved avatar_window.webp');

    // 5. Make the gate and window cutouts on the canvas transparent
    // Cutout 1: Gate (x: 367 to 657, y: 693 to 1024)
    for (let y = 693; y < 1024; y++) {
      for (let x = 367; x < 657; x++) {
        const idx = (y * info.width + x) * 4;
        data[idx + 3] = 0;
      }
    }

    // Cutout 2: Security Cabin Window (x: 762 to 862, y: 693 to 1024)
    for (let y = 693; y < 1024; y++) {
      for (let x = 762; x < 862; x++) {
        const idx = (y * info.width + x) * 4;
        data[idx + 3] = 0;
      }
    }

    // Save the facade texture (overwrite wall_bricks_2.webp)
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .webp({ quality: 90 })
      .toFile(path.join(destEntrance, 'wall_bricks_2.webp'));
    console.log('Saved wall_bricks_2.webp');

    // 6. Generate Storyboard Panels from the new source image
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

    console.log('Successfully completed new visual extraction!');
  } catch (error) {
    console.error('Error in new visual extraction:', error);
  }
}

generate();
