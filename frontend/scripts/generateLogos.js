const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');

// Create the public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

// Function to create a logo
function createLogo(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Draw background circle
    ctx.fillStyle = '#3f51b5';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
    ctx.fill();

    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.6}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('C', size/2, size/2 + size * 0.1);

    return canvas;
}

// Generate logo192.png
const logo192 = createLogo(192);
fs.writeFileSync(path.join(publicDir, 'logo192.png'), logo192.toBuffer());

// Generate logo512.png
const logo512 = createLogo(512);
fs.writeFileSync(path.join(publicDir, 'logo512.png'), logo512.toBuffer());

// Generate favicon.ico (32x32)
const favicon = createLogo(32);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon.toBuffer()); 