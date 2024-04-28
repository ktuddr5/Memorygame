// Server-side code 
const fs = require('fs');
const PNG = require('pngjs').PNG;

function extractImageDataFromFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(new PNG())
            .on('parsed', function() {
                const image = [];
                for (let y = 0; y < this.height; y++) {
                    const row = [];
                    for (let x = 0; x < this.width; x++) {
                        const idx = (this.width * y + x) << 2;
                        const pixelValue = this.data[idx] === 0 ? 0 : 1; // assuming black or white only
                        row.push(pixelValue);
                    }
                    image.push(row);
                }
                resolve(image);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

module.exports = { extractImageDataFromFile };