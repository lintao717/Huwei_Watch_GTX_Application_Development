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
assert.strictEqual(arcs.length, 4, 'The progress ring should draw a track, active arc, and two stroked cap circles.');

const trackArc = arcs[0];
const activeArc = arcs[1];
const startCapArc = arcs[2];
const endCapArc = arcs[3];

assert(hml.includes('<canvas ref="progressCanvas" class="progress-canvas"></canvas>'), 'The progress ring should use code-driven Canvas, not image assets.');
assert(!hml.includes('progress_ring_'), 'The home screen must not use generated progress ring PNG assets.');
assert(css.includes('.progress-canvas { width: 454px; height: 454px; margin-left: 0px; margin-top: 0px; background-color: #FFFFFF; border-radius: 227px;'), 'The canvas should cover the full circular watch face.');
assert(contextOptions && contextOptions.antialias === true, 'Lite Canvas should request antialiasing to smooth the edge ring.');
assert.strictEqual(trackArc.strokeStyle, '#E8E8E8', 'The white-theme background track should use a subtle light gray.');
assert.strictEqual(activeArc.strokeStyle, '#0A84FF', 'The active segment should use a visible blue stroked arc on Lite Canvas.');
assert.strictEqual(activeArc.lineWidth, 20, 'The active segment should be a thick edge ring.');
assert.strictEqual(activeArc.radius + activeArc.lineWidth / 2, 227, 'The active segment outer edge should touch the 454px watch face edge.');
assert(Math.abs(activeArc.startAngle + Math.PI / 2) < 0.01, 'The active segment should start at 12 o’clock.');
assert(Math.abs((activeArc.endAngle - activeArc.startAngle) - Math.PI * 2 * 0.6) < 0.01, 'At 60%, the active arc should cover 60% of the ring.');
assert.strictEqual(startCapArc.strokeStyle, '#0A84FF', 'The start cap should be stroked in brand blue.');
assert.strictEqual(endCapArc.strokeStyle, '#0A84FF', 'The end cap should be stroked in brand blue.');
assert.strictEqual(startCapArc.lineWidth, 20, 'The start cap should use the ring width as stroke thickness.');
assert.strictEqual(endCapArc.lineWidth, 20, 'The end cap should use the ring width as stroke thickness.');
assert.strictEqual(startCapArc.radius, 1, 'The start cap should be a tiny stroked circle that Lite Canvas can render reliably.');
assert.strictEqual(endCapArc.radius, 1, 'The end cap should be a tiny stroked circle that Lite Canvas can render reliably.');
assert.strictEqual(calls.filter((call) => call.method === 'stroke' && call.strokeStyle === '#0A84FF').length, 3, 'The active segment should use one visible arc stroke plus two stroked cap circles.');
assert.strictEqual(calls.filter((call) => call.method === 'fill').length, 0, 'The active segment must not rely on Lite Canvas fill paths.');

console.log('Home progress ring Canvas pipeline passes.');
