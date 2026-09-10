import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const source = '/Users/madhan/.gemini/antigravity-ide/brain/5a54f596-8446-4cbd-a2d7-100ecd06aaa1/media__1784044102631.jpg';
const destEntrance = './public/textures/entrance';
const destDoors = './public/textures/doors';

async function generate() {
  try {
    console.log('Starting aligned texture generation...');

    // 1. Crop the original arch region from the source image:
    // y = 120 to y = 460 (height = 340), width = 1024.
    const archOriginal = await sharp(source)
      .extract({ left: 0, top: 120, width: 1024, height: 340 })
      .toBuffer();

    // 2. Resize the arch to align the gate.
    // The gate in the original crop:
    // x = 330 to 550 (width = 220)
    // y = 210 to 320 (height = 110)
    // Target gate size in 1024x1024:
    // width = 250
    // height = 331
    // Scale factor: width scale = 250 / 220 = 1.13636, height scale = 331 / 110 = 3.00909
    const targetArchWidth = Math.round(1024 * (250 / 220)); // 1164
    const targetArchHeight = Math.round(340 * (331 / 110)); // 1023

    const leftOffset = 12;
    const topOffset = 61;

    // Crop the resized arch so that it fits within the 1024x1024 canvas
    // Width to crop: 1024 - 12 = 1012
    // Height to crop: 1024 - 61 = 963
    const archResizedClipped = await sharp(archOriginal)
      .resize(targetArchWidth, targetArchHeight, { fit: 'fill' })
      .extract({ left: 0, top: 0, width: 1012, height: 963 })
      .png()
      .toBuffer();

    // 3. Compose the 1024x1024 canvas
    // We create a transparent 1024x1024 background and composite the clipped resized arch onto it.
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

    // 4. Extract left and right gates from the canvas before making it transparent
    // The gate region on the canvas is:
    // x: 387 to 637 (left = 387, width = 250)
    // y: 693 to 1024 (top = 693, height = 331)
    // So left gate is x: 387 to 512, right gate is x: 512 to 637.
    const leftGateData = await sharp(data, { raw: { width: 1024, height: 1024, channels: 4 } })
      .extract({ left: 387, top: 693, width: 125, height: 331 })
      .webp({ quality: 95 })
      .toBuffer();

    const rightGateData = await sharp(data, { raw: { width: 1024, height: 1024, channels: 4 } })
      .extract({ left: 512, top: 693, width: 125, height: 331 })
      .webp({ quality: 95 })
      .toBuffer();

    // Save gate textures (both sketch and painted)
    fs.writeFileSync(path.join(destDoors, 'door_left_sketch.webp'), leftGateData);
    fs.writeFileSync(path.join(destDoors, 'door_left_painted.webp'), leftGateData);
    fs.writeFileSync(path.join(destDoors, 'door_right_sketch.webp'), rightGateData);
    fs.writeFileSync(path.join(destDoors, 'door_right_painted.webp'), rightGateData);
    console.log('Saved gate textures to public/textures/doors/');

    // 5. Make the gate cutout region on the canvas fully transparent
    const cutoutStartX = 387;
    const cutoutEndX = 637;
    const cutoutStartY = 693;
    const cutoutEndY = 1024;

    for (let y = cutoutStartY; y < cutoutEndY; y++) {
      for (let x = cutoutStartX; x < cutoutEndX; x++) {
        const idx = (y * info.width + x) * 4;
        data[idx + 3] = 0; // Transparent alpha
      }
    }

    // Save the facade texture (overwrite wall_bricks_2.webp)
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .webp({ quality: 90 })
      .toFile(path.join(destEntrance, 'wall_bricks_2.webp'));
    console.log('Saved aligned transparent facade wall_bricks_2.webp');

    // 6. Generate Storyboard Panels
    const widthPerZone = 1024 / 5; // 204.8
    for (let i = 0; i < 5; i++) {
      const left = Math.round(i * widthPerZone);
      const width = Math.round(widthPerZone);
      // Crop each thumbnail: y=490 to 605 (height=115)
      await sharp(source)
        .extract({ left: left, top: 490, width: width, height: 115 })
        .webp({ quality: 95 })
        .toFile(path.join(destEntrance, `panel_${i + 1}.webp`));
      console.log(`Generated storyboard panel_${i + 1}.webp`);
    }

    console.log('Successfully completed aligned texture generation!');
  } catch (error) {
    console.error('Error generating aligned textures:', error);
  }
}

generate();
