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
    moveTo(x, y) {
        calls.push({ method: 'moveTo', x, y });
    },
    arc(x, y, radius, startAngle, endAngle, counterclockwise) {
        calls.push({
            method: 'arc',
            x,
            y,
            radius,
            startAngle,
            endAngle,
            counterclockwise,
            lineWidth: this.lineWidth,
            strokeStyle: this.strokeStyle,
            fillStyle: this.fillStyle,
            lineCap: this.lineCap
        });
    },
    closePath() {
        calls.push({ method: 'closePath' });
    },
    fill() {
        calls.push({
            method: 'fill',
            fillStyle: this.fillStyle
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
    totalMl: 1200,
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
assert.strictEqual(arcs.length, 5, 'The progress ring should draw one background arc and a four-arc filled capsule segment.');

const trackArc = arcs[0];
const activeOuterArc = arcs[1];
const activeEndCapArc = arcs[2];
const activeInnerArc = arcs[3];
const activeStartCapArc = arcs[4];

assert(hml.includes('<canvas ref="progressCanvas" class="progress-canvas"></canvas>'), 'The progress ring should use code-driven Canvas, not image assets.');
assert(!hml.includes('progress_ring_'), 'The home screen must not use generated progress ring PNG assets.');
assert(css.includes('.progress-canvas { width: 454px; height: 454px; margin-left: 0px; margin-top: 0px; background-color: #FFFFFF; border-radius: 227px;'), 'The canvas should cover the full circular watch face.');
assert(contextOptions && contextOptions.antialias === true, 'Lite Canvas should request antialiasing to smooth the edge ring.');
assert.strictEqual(trackArc.strokeStyle, '#E8E8E8', 'The white-theme background track should use a subtle light gray.');
assert.strictEqual(activeOuterArc.fillStyle, '#0A84FF', 'The active segment should be filled with the brand blue.');
assert.strictEqual(activeOuterArc.radius, 227, 'The active segment outer edge should touch the 454px watch face edge.');
assert.strictEqual(activeInnerArc.radius, 207, 'The active segment inner edge should preserve a 20px ring width.');
assert.strictEqual(activeEndCapArc.radius, 10, 'The active segment end cap should be a real half-width circle.');
assert.strictEqual(activeStartCapArc.radius, 10, 'The active segment start cap should be a real half-width circle.');
assert.strictEqual(activeInnerArc.counterclockwise, true, 'The inner arc should reverse direction to close a filled annular segment.');
assert(Math.abs(activeOuterArc.startAngle + Math.PI / 2) < 0.01, 'The active segment should start at 12 o’clock.');
assert(Math.abs((activeOuterArc.endAngle - activeOuterArc.startAngle) - Math.PI * 2 * 0.6) < 0.01, 'At 60%, the active filled segment should cover 60% of the ring.');
assert.strictEqual(calls.filter((call) => call.method === 'fill' && call.fillStyle === '#0A84FF').length, 1, 'The active segment should be one filled capsule path, not a stroked arc.');
assert.strictEqual(calls.filter((call) => call.method === 'stroke' && call.strokeStyle === '#0A84FF').length, 0, 'The active segment must not rely on stroke lineCap for rounded ends.');

console.log('Home progress ring Canvas pipeline passes.');
