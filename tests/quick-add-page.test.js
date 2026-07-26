const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const sourcePath = 'entry/src/main/js/MainAbility/pages/index/index.js';
const hmlPath = 'entry/src/main/js/MainAbility/pages/index/index.hml';
const cssPath = 'entry/src/main/js/MainAbility/pages/index/index.css';

const source = fs.readFileSync(sourcePath, 'utf8').replace('export default', 'module.exports =');
const hml = fs.readFileSync(hmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const sandbox = { module: { exports: {} }, console };
vm.runInNewContext(source, sandbox, { filename: sourcePath });

const page = sandbox.module.exports;
const context = Object.assign({}, page.data, page, {
    drawProgressRing() {
        this.drawCount = (this.drawCount || 0) + 1;
    }
});

assert.strictEqual(context.isHomeView, true, 'The app should start on the home view.');
assert.strictEqual(context.isQuickAddView, false, 'The quick-add view should start hidden.');
assert(hml.includes('if="{{ isHomeView }}"'), 'The home surface should be conditionally shown.');
assert(hml.includes('if="{{ isQuickAddView }}"'), 'The quick-add surface should be conditionally shown.');
assert(hml.includes('onclick="onOpenQuickAdd"'), 'The home primary button should open quick add instead of recording immediately.');
assert(hml.includes('onclick="onQuickAdd100"'), 'Quick add should expose a +100 mL action.');
assert(hml.includes('onclick="onQuickAdd200"'), 'Quick add should expose a +200 mL action.');
assert(hml.includes('onclick="onQuickAdd300"'), 'Quick add should expose a +300 mL action.');
assert(hml.includes('onclick="onCancelQuickAdd"'), 'Quick add should expose cancel.');
assert(css.includes('.quick-title'), 'Quick add title styling should exist.');
assert(css.includes('.quick-option-primary'), 'Quick add selected option styling should exist.');
assert(css.includes('.quick-cancel'), 'Quick add cancel styling should exist.');

page.onOpenQuickAdd.call(context);
assert.strictEqual(context.isHomeView, false, 'Opening quick add should hide home.');
assert.strictEqual(context.isQuickAddView, true, 'Opening quick add should show the quick-add view.');
assert.strictEqual(context.totalMl, 1200, 'Opening quick add should not record water.');

page.onCancelQuickAdd.call(context);
assert.strictEqual(context.isHomeView, true, 'Cancel should return to home.');
assert.strictEqual(context.isQuickAddView, false, 'Cancel should hide quick add.');
assert.strictEqual(context.totalMl, 1200, 'Cancel should not record water.');

page.onOpenQuickAdd.call(context);
page.onQuickAdd300.call(context);
assert.strictEqual(context.isHomeView, true, 'Selecting an amount should return to home.');
assert.strictEqual(context.isQuickAddView, false, 'Selecting an amount should hide quick add.');
assert.strictEqual(context.totalMl, 1500, 'Selecting +300 mL should add exactly 300 mL.');
assert.strictEqual(context.progressText, '75%', 'Selecting +300 mL from 1200 / 2000 should update progress to 75%.');
assert.strictEqual(context.defaultAmountMl, 200, 'Quick add should not change the home default amount.');
assert.strictEqual(context.isWaterMoving, true, 'Selecting an amount should enable feedback state.');

console.log('Quick add page behavior passes.');
