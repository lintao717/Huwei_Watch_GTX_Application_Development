const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const sourcePath = 'entry/src/main/js/MainAbility/pages/index/index.js';
const source = fs.readFileSync(sourcePath, 'utf8').replace('export default', 'module.exports =');
const sandbox = { module: { exports: {} }, console };
vm.runInNewContext(source, sandbox, { filename: sourcePath });

const page = sandbox.module.exports;
const state = Object.assign({}, page.data);
const context = Object.assign(state, page, { $t: () => '' });

page.onInit.call(context);
page.onAddWater.call(context);

assert.strictEqual(context.totalMl, 1400, 'Adding the default amount should increase today total by 200 mL.');
assert.strictEqual(context.progressText, '70%', 'Adding 200 mL to 1200 / 2000 should show 70% progress.');
assert.strictEqual(context.isWaterMoving, true, 'Adding water should enable the short water feedback state.');

console.log('Home page add-water behavior passes.');
