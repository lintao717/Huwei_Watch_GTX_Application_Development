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
const calls = [];
const context2d = {
    beginPath() {
        calls.push({ method: 'beginPath' });
    },
    arc(x, y, radius, startAngle, endAngle) {
        calls.push({
            method: 'arc',
            x,
            y,
            radius,
            startAngle,
            endAngle,
            lineWidth: this.lineWidth,
            strokeStyle: this.strokeStyle,
            lineCap: this.lineCap
        });
    },
    stroke() {
        calls.push({
            method: 'stroke',
            lineWidth: this.lineWidth,
            strokeStyle: this.strokeStyle,
            lineCap: this.lineCap
        });
    }
};

let contextOptions;
const context = Object.assign({}, page.data, page, {
    totalMl: 2600,
    targetMl: 2000,
    $refs: {
        progressCanvas: {
            getContext(type, options) {
                assert.strictEqual(type, '2d');
                contextOptions = options;
                return context2d;
            }
        }
    }
});

page.drawProgressRing.call(context);

const arcs = calls.filter((call) => call.method === 'arc');
assert.strictEqual(arcs.length, 2, 'The progress ring should draw a background track and an active segment with Canvas.');

const trackArc = arcs[0];
const activeArc = arcs[1];

assert(hml.includes('<canvas ref="progressCanvas" class="progress-canvas"></canvas>'), 'The progress ring should use code-driven Canvas, not image assets.');
assert(!hml.includes('progress_ring_'), 'The home screen must not use generated progress ring PNG assets.');
assert(css.includes('.progress-canvas { width: 454px; height: 454px; margin-left: 0px; margin-top: 0px; background-color: #FFFFFF; border-radius: 227px;'), 'The canvas should cover the full circular watch face.');
assert(contextOptions && contextOptions.antialias === true, 'Lite Canvas should request antialiasing to smooth the edge ring.');
assert.strictEqual(trackArc.strokeStyle, '#E8E8E8', 'The white-theme background track should use a subtle light gray.');
assert.strictEqual(activeArc.strokeStyle, '#0A84FF', 'The active segment should use the brand blue.');
assert.strictEqual(activeArc.lineCap, 'round', 'The active segment should use rounded Canvas caps.');
assert.strictEqual(activeArc.lineWidth, 20, 'The active segment should be a thick edge ring.');
assert.strictEqual(activeArc.radius + activeArc.lineWidth / 2, 227, 'The active segment outer edge should touch the 454px watch face edge.');
assert(Math.abs(activeArc.startAngle + Math.PI / 2) < 0.01, 'The active segment should start at 12 o’clock.');
assert(Math.abs((activeArc.endAngle - activeArc.startAngle) - Math.PI * 2) < 0.01, 'At 100%, the active segment should draw a complete circle instead of a visible top gap.');

console.log('Home progress ring Canvas pipeline passes.');
