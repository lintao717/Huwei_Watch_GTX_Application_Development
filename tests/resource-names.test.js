const assert = require('assert');
const fs = require('fs');
const path = require('path');

const mediaDirectory = path.join('entry', 'src', 'main', 'resources', 'base', 'media');
const invalidNames = fs.readdirSync(mediaDirectory)
    .filter((fileName) => fileName.endsWith('.png'))
    .map((fileName) => path.parse(fileName).name)
    .filter((resourceName) => !/^[a-zA-Z0-9_]+$/.test(resourceName));

assert.deepStrictEqual(invalidNames, [], 'Lite Wearable PNG resource names must only contain letters, numbers, and underscores.');
console.log('All Lite Wearable PNG resource names are valid.');
