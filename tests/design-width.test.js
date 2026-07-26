const assert = require('assert');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('entry/src/main/config.json', 'utf8'));
assert.strictEqual(config.module.js[0].window.designWidth, 454, 'The Lite Wearable design width must match the 454px watch artboard.');
assert.strictEqual(config.module.js[0].window.autoDesignWidth, false, 'The 454px artboard must not be auto-scaled.');
console.log('Watch design width configuration passes.');
