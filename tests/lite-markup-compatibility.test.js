const assert = require('assert');
const fs = require('fs');

const css = fs.readFileSync('entry/src/main/js/MainAbility/pages/index/index.css', 'utf8');
const hml = fs.readFileSync('entry/src/main/js/MainAbility/pages/index/index.hml', 'utf8');

['position:', 'overflow:', 'font-weight:', 'border-top-width:', 'border-right-width:', 'align-items: baseline', '4px 4px', '9px 9px', '50%'].forEach((unsupported) => {
    assert(!css.includes(unsupported), 'Lite Wearable CSS must not contain unsupported syntax: ' + unsupported);
});
assert(!hml.includes('<button'), 'Lite Wearable HML must use tappable div elements, not button tags.');
assert(hml.includes('<stack class="page">'), 'The home screen should use one root stack so the progress ring can be a real image layer.');
assert(!hml.includes('<div class="metric">'), 'Primary metric content must stay flat because nested Lite Wearable containers can fail to render.');
assert(!hml.includes('<div class="actions">'), 'Bottom actions must stay flat because nested Lite Wearable containers can fail to render.');
assert(!hml.includes("{{ isWaterMoving ?"), 'Lite Wearable class selectors must not use data binding.');
assert(hml.includes('{{ totalMl }}'), 'The drink total must be rendered as HML page state.');
assert(hml.includes('onclick="onAddWater"'), 'The primary action must be a real HML click target.');
assert(hml.includes('class="progress-ring"'), 'The progress ring must be a real image element because Lite Wearable ignored CSS background images here.');
assert(!css.includes('background-image:'), 'The home screen must not rely on CSS background images for critical visuals.');
console.log('Lite Wearable markup compatibility passes.');
