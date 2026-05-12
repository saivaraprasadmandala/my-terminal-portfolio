const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'profile.jpeg');
const outputPath = path.join(__dirname, 'app', 'icon.png');

async function createFavicon() {
  const size = 512;
  const rect = Buffer.from(
    `<svg><circle cx="${size/2}" cy="${size/2}" r="${size/2}" /></svg>`
  );

  try {
    await sharp(inputPath)
      .extract({ left: 350, top: 300, width: 1300, height: 1300 })
      .resize({
        width: size,
        height: size,
        fit: sharp.fit.cover,
        position: sharp.strategy.attention
      })
      .composite([{
        input: rect,
        blend: 'dest-in'
      }])
      .png()
      .toFile(outputPath);
    console.log('Successfully created circular app/icon.png');
  } catch (err) {
    console.error('Error creating favicon:', err);
  }
}

createFavicon();
