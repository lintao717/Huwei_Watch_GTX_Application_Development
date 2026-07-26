const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const sourcePath = 'entry/src/main/js/MainAbility/pages/index/index.js';
const cssPath = 'entry/src/main/js/MainAbility/pages/index/index.css';
const source = fs.readFileSync(sourcePath, 'utf8').replace('export default', 'module.exports =');
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

const context = Object.assign({}, page.data, page, {
    totalMl: 2000,
    targetMl: 2000,
    $refs: {
        progressCanvas: {
            getContext(type) {
                assert.strictEqual(type, '2d');
                return context2d;
            }
        }
    }
});

page.drawProgressRing.call(context);

const arcs = calls.filter((call) => call.method === 'arc');
assert.strictEqual(arcs.length, 4, 'The progress ring should draw a track, an active segment, and two manual round caps.');

const trackArc = arcs[0];
const activeArc = arcs[1];
const startCap = arcs[2];
const endCap = arcs[3];

assert(css.includes('.page { width: 454px; height: 454px; background-color: #FFFFFF; border-radius: 227px;'), 'The root page must be a full 454px white circular watch face.');
assert(css.includes('.progress-canvas { width: 454px; height: 454px; margin-left: 0px; margin-top: 0px; background-color: #FFFFFF; border-radius: 227px;'), 'The canvas layer must also cover the full white circular face.');
assert(css.includes('.time { width: 80px; height: 24px; margin-left: 187px; margin-top: 26px;'), 'The time label should move down enough to avoid touching the top ring.');
assert(css.includes('.drop { width: 32px; height: 32px; margin-left: 153px; margin-top: 198px;'), 'The droplet should be lowered slightly to visually align with the progress text.');
assert(trackArc.radius >= 210 && trackArc.radius <= 214, 'The background track should sit near the screen edge while leaving clipping-safe padding.');
assert(activeArc.radius >= 210 && activeArc.radius <= 214, 'The active progress segment should sit near the screen edge while leaving clipping-safe padding.');
assert(trackArc.lineWidth >= 18, 'The background track should be visually substantial.');
assert(activeArc.lineWidth >= 18, 'The active progress segment should be visually substantial.');
assert.strictEqual(trackArc.strokeStyle, '#E8E8E8', 'The white-theme background track should use a subtle light gray.');
assert.strictEqual(activeArc.strokeStyle, '#0A84FF', 'The active segment should use the brand blue.');
assert.strictEqual(activeArc.lineCap, 'round', 'The active segment should use rounded ends.');
assert(Math.abs(activeArc.startAngle + Math.PI / 2) < 0.01, 'The active segment should start at 12 o’clock.');
assert(activeArc.endAngle - activeArc.startAngle > 5.8, 'At 100%, the active progress arc should be almost a full circle.');
assert(activeArc.endAngle - activeArc.startAngle < 6.28, 'At 100%, the rounded progress arc should preserve a tiny visual gap.');
assert.strictEqual(startCap.radius, activeArc.lineWidth / 2, 'The start cap should match half the ring width.');
assert.strictEqual(endCap.radius, activeArc.lineWidth / 2, 'The end cap should match half the ring width.');
assert.strictEqual(calls.filter((call) => call.method === 'fill' && call.fillStyle === '#0A84FF').length, 2, 'The active segment should paint two blue circular cap fills as a Lite Canvas fallback.');

console.log('Home progress ring drawing passes.');
