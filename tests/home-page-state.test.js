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

assert.strictEqual(context.totalMl, 1200, 'Opening quick add should not immediately change today total.');
assert.strictEqual(context.progressText, '60%', 'Opening quick add should not immediately change progress.');
assert.strictEqual(context.isHomeView, false, 'The home primary action should open quick add.');
assert.strictEqual(context.isQuickAddView, true, 'The quick add view should become visible.');
assert.strictEqual(context.isWaterMoving, false, 'Opening quick add should not enable recorded-water feedback.');

console.log('Home page add-water behavior passes.');
