const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const sourcePath = 'entry/src/main/js/MainAbility/pages/index/index.js';
const hmlPath = 'entry/src/main/js/MainAbility/pages/index/index.hml';
const cssPath = 'entry/src/main/js/MainAbility/pages/index/index.css';
const imageDirectory = 'entry/src/main/js/MainAbility/common/images';

const source = fs.readFileSync(sourcePath, 'utf8').replace('export default', 'module.exports =');
const hml = fs.readFileSync(hmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const sandbox = { module: { exports: {} }, console };
vm.runInNewContext(source, sandbox, { filename: sourcePath });

const page = sandbox.module.exports;

assert(hml.includes('<image class="progress-ring" src="{{ progressRingSrc }}"></image>'), 'The home ring should use a pre-rendered dynamic image layer on Lite Wearable.');
assert(!hml.includes('<canvas'), 'The home ring should not depend on Lite Canvas because the emulator renders arc caps as flat cuts.');
assert(css.includes('.progress-ring { width: 454px; height: 454px; margin-left: 0px; margin-top: 0px;'), 'The progress ring image should cover the full watch face without scaling gaps.');

['000', '060', '090', '100'].forEach((percent) => {
    const file = path.join(imageDirectory, 'progress_ring_' + percent + '.png');
    assert(fs.existsSync(file), 'Missing generated progress ring asset: ' + file);
});

const context = Object.assign({}, page.data, page);

context.totalMl = 1200;
context.targetMl = 2000;
page.updateProgress.call(context);
assert.strictEqual(context.progressText, '60%');
assert.strictEqual(context.progressRingSrc, '/common/images/progress_ring_060.png');

context.totalMl = 1800;
context.targetMl = 2000;
page.updateProgress.call(context);
assert.strictEqual(context.progressText, '90%');
assert.strictEqual(context.progressRingSrc, '/common/images/progress_ring_090.png');

context.totalMl = 2600;
context.targetMl = 2000;
page.updateProgress.call(context);
assert.strictEqual(context.progressText, '100%');
assert.strictEqual(context.progressRingSrc, '/common/images/progress_ring_100.png');

context.totalMl = 0;
context.targetMl = 2000;
page.updateProgress.call(context);
assert.strictEqual(context.progressText, '0%');
assert.strictEqual(context.progressRingSrc, '/common/images/progress_ring_000.png');

console.log('Home progress ring image pipeline passes.');
