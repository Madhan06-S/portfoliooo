import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const source = '/Users/madhan/.gemini/antigravity-ide/brain/5a54f596-8446-4cbd-a2d7-100ecd06aaa1/media__1784044102631.jpg';
const destEntrance = './public/textures/entrance';
const destDoors = './public/textures/doors';

async function generate() {
  try {
    console.log('Starting image extraction...');

    // 1. Generate CIT Entrance Arch Facade with transparent gate area
    // Crop: y=120 to y=460 (height=340), width=1024
    const facadeRaw = await sharp(source)
      .extract({ left: 0, top: 120, width: 1024, height: 340 })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { data, info } = facadeRaw;
    
    // Gate cutout region in facade coordinates:
    // x: 315 to 565
    // y: 330 to 440 of original -> y-120 = 210 to 320 of facade
    const startX = 315;
    const endX = 565;
    const startY = 210;
    const endY = 320;

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const idx = (y * info.width + x) * 4;
        data[idx + 3] = 0; // Set alpha channel to 0 (fully transparent)
      }
    }

    // Save transparency-modified facade buffer to public/textures/entrance/wall_bricks_2.webp
    // Overwriting the old facade texture
    await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
      .webp({ quality: 90 })
      .toFile(path.join(destEntrance, 'wall_bricks_2.webp'));
    console.log('Generated transparent CIT facade: wall_bricks_2.webp');

    // 2. Generate Left Gate
    // Crop: x=315 to x=440 (width=125), y=330 to y=440 (height=110)
    const leftGate = sharp(source)
      .extract({ left: 315, top: 330, width: 125, height: 110 });
    
    await leftGate.webp({ quality: 95 }).toFile(path.join(destDoors, 'door_left_sketch.webp'));
    await leftGate.webp({ quality: 95 }).toFile(path.join(destDoors, 'door_left_painted.webp'));
    console.log('Generated left gate textures');

    // 3. Generate Right Gate
    // Crop: x=440 to x=565 (width=125), y=330 to y=440 (height=110)
    const rightGate = sharp(source)
      .extract({ left: 440, top: 330, width: 125, height: 110 });

    await rightGate.webp({ quality: 95 }).toFile(path.join(destDoors, 'door_right_sketch.webp'));
    await rightGate.webp({ quality: 95 }).toFile(path.join(destDoors, 'door_right_painted.webp'));
    console.log('Generated right gate textures');

    // 4. Generate Storyboard Panels
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

    console.log('All textures successfully generated!');
  } catch (error) {
    console.error('Error generating textures:', error);
  }
}

generate();
