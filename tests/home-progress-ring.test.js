const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const sourcePath = 'entry/src/main/js/MainAbility/pages/index/index.js';
const source = fs.readFileSync(sourcePath, 'utf8').replace('export default', 'module.exports =');
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
assert.strictEqual(arcs.length, 2, 'The progress ring should draw a background track and an active segment.');

const trackArc = arcs[0];
const activeArc = arcs[1];

assert(trackArc.radius >= 218, 'The background track should sit near the screen edge.');
assert(activeArc.radius >= 218, 'The active progress segment should sit near the screen edge.');
assert(trackArc.lineWidth >= 18, 'The background track should be visually substantial.');
assert(activeArc.lineWidth >= 18, 'The active progress segment should be visually substantial.');
assert.strictEqual(trackArc.strokeStyle, '#2E2748', 'The background track should use the darker Huawei-like purple track color.');
assert.strictEqual(activeArc.strokeStyle, '#0A84FF', 'The active segment should use the brand blue.');
assert.strictEqual(activeArc.lineCap, 'round', 'The active segment should use rounded ends.');
assert(activeArc.endAngle - activeArc.startAngle > 5.8, 'At 100%, the active progress arc should be almost a full circle.');
assert(activeArc.endAngle - activeArc.startAngle < 6.28, 'At 100%, the rounded progress arc should preserve a tiny visual gap.');

console.log('Home progress ring drawing passes.');
