const assert = require('assert');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function readPng(filePath) {
    const data = fs.readFileSync(filePath);
    assert(data.slice(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), filePath + ' must be a PNG.');

    let offset = 8;
    let width = 0;
    let height = 0;
    let colorType = 0;
    const idatChunks = [];

    while (offset < data.length) {
        const length = data.readUInt32BE(offset);
        const type = data.slice(offset + 4, offset + 8).toString('ascii');
        const chunk = data.slice(offset + 8, offset + 8 + length);
        offset += 12 + length;

        if (type === 'IHDR') {
            width = chunk.readUInt32BE(0);
            height = chunk.readUInt32BE(4);
            assert.strictEqual(chunk[8], 8, filePath + ' must use 8-bit channels.');
            colorType = chunk[9];
            assert([2, 6].includes(colorType), filePath + ' must be RGB or RGBA.');
        }

        if (type === 'IDAT') {
            idatChunks.push(chunk);
        }

        if (type === 'IEND') {
            break;
        }
    }

    const channels = colorType === 6 ? 4 : 3;
    const stride = width * channels;
    const inflated = zlib.inflateSync(Buffer.concat(idatChunks));
    const pixels = Buffer.alloc(width * height * 4);
    let sourceOffset = 0;
    let previous = Buffer.alloc(stride);

    for (let y = 0; y < height; y++) {
        const filter = inflated[sourceOffset++];
        const row = Buffer.from(inflated.slice(sourceOffset, sourceOffset + stride));
        sourceOffset += stride;

        for (let x = 0; x < stride; x++) {
            const left = x >= channels ? row[x - channels] : 0;
            const up = previous[x] || 0;
            const upLeft = x >= channels ? previous[x - channels] || 0 : 0;

            if (filter === 1) {
                row[x] = (row[x] + left) & 255;
            } else if (filter === 2) {
                row[x] = (row[x] + up) & 255;
            } else if (filter === 3) {
                row[x] = (row[x] + Math.floor((left + up) / 2)) & 255;
            } else if (filter === 4) {
                const p = left + up - upLeft;
                const pa = Math.abs(p - left);
                const pb = Math.abs(p - up);
                const pc = Math.abs(p - upLeft);
                row[x] = (row[x] + (pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft)) & 255;
            }
        }

        for (let x = 0; x < width; x++) {
            const from = x * channels;
            const to = (y * width + x) * 4;
            pixels[to] = row[from];
            pixels[to + 1] = row[from + 1];
            pixels[to + 2] = row[from + 2];
            pixels[to + 3] = channels === 4 ? row[from + 3] : 255;
        }

        previous = row;
    }

    return { width, height, pixels };
}

function countPixels(image, predicate) {
    let count = 0;
    for (let i = 0; i < image.pixels.length; i += 4) {
        if (predicate(image.pixels[i], image.pixels[i + 1], image.pixels[i + 2], image.pixels[i + 3])) {
            count++;
        }
    }
    return count;
}

function cssRule(selector) {
    const css = fs.readFileSync('entry/src/main/js/MainAbility/pages/index/index.css', 'utf8');
    const match = css.match(new RegExp('\\' + selector + '\\s*\\{([^}]+)\\}'));
    assert(match, selector + ' rule must exist.');
    return match[1];
}

const imageDirectory = path.join('entry', 'src', 'main', 'js', 'MainAbility', 'common', 'images');
const dropRule = cssRule('.drop');
assert(dropRule.includes('width: 24px'), 'The water drop should be large enough to pair with the progress text.');
assert(dropRule.includes('height: 24px'), 'The water drop should be large enough to pair with the progress text.');

const amountRule = cssRule('.amount');
const amountFontSize = Number(amountRule.match(/font-size:\s*(\d+)px/)[1]);
assert(amountFontSize >= 48, 'The main drink number should have stronger visual weight.');

const waterDrop = readPng(path.join(imageDirectory, 'water_drop.png'));
assert.strictEqual(waterDrop.width, 48, 'water_drop.png should keep a 48px source size for clean downscaling.');
assert.strictEqual(waterDrop.height, 48, 'water_drop.png should keep a 48px source size for clean downscaling.');
const bluePixels = countPixels(waterDrop, (r, g, b, a) => a > 80 && b > 180 && g > 100 && r < 80);
assert(bluePixels > 250, 'water_drop.png should render as the blue brand droplet, not a gray mark.');

const progressRing = readPng(path.join(imageDirectory, 'home_progress_ring.png'));
assert.strictEqual(progressRing.width, 454, 'home_progress_ring.png should match the 454px artboard.');
assert.strictEqual(progressRing.height, 454, 'home_progress_ring.png should match the 454px artboard.');
const ringBluePixels = countPixels(progressRing, (r, g, b, a) => a > 80 && b > 180 && g > 90 && r < 80);
assert(ringBluePixels > 3800, 'The progress ring should contain a clear blue rounded arc.');

console.log('Home visual asset checks pass.');
