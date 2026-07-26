const assert = require('assert');
const fs = require('fs');

const css = fs.readFileSync('entry/src/main/js/MainAbility/pages/index/index.css', 'utf8');
const hml = fs.readFileSync('entry/src/main/js/MainAbility/pages/index/index.hml', 'utf8');

['position:', 'overflow:', 'font-weight:', 'border-top-width:', 'border-right-width:', 'align-items: baseline', '4px 4px', '9px 9px', '50%'].forEach((unsupported) => {
    assert(!css.includes(unsupported), 'Lite Wearable CSS must not contain unsupported syntax: ' + unsupported);
});
assert(!hml.includes('<button'), 'Lite Wearable HML must use tappable div elements, not button tags.');
assert(hml.includes('<stack class="page">'), 'The home screen should use one root stack so the progress ring can be a real drawing layer.');
assert(!hml.includes('<div class="metric">'), 'Primary metric content must stay flat because nested Lite Wearable containers can fail to render.');
assert(!hml.includes('<div class="actions">'), 'Bottom actions must stay flat because nested Lite Wearable containers can fail to render.');
assert(!hml.includes("{{ isWaterMoving ?"), 'Lite Wearable class selectors must not use data binding.');
assert(hml.includes('{{ totalMl }}'), 'The drink total must be rendered as HML page state.');
assert(hml.includes('onclick="onAddWater"'), 'The primary action must be a real HML click target.');
assert(hml.includes('<canvas ref="progressCanvas"'), 'The home screen should use Lite Canvas for the edge progress ring.');
assert(!hml.includes('progress_ring_'), 'The home progress ring must not use generated PNG sequence assets.');
assert(!hml.includes('home_progress_ring.png'), 'The home progress ring must not use the old single static PNG texture.');
assert(hml.includes('/common/images/water_drop.png'), 'The inline progress droplet must use a Lite Wearable visible PNG generated from the design SVG.');
assert(hml.includes('/common/images/history.png'), 'The record action must use a Lite Wearable visible PNG generated from the design SVG.');
assert(hml.includes('/common/images/settings.png'), 'The settings action must use a Lite Wearable visible PNG generated from the design SVG.');
assert(!hml.includes('.svg'), 'Lite Wearable image elements must not reference SVG directly because the emulator does not render them.');
assert(!css.includes('background-image:'), 'The home screen must not rely on CSS background images for critical visuals.');
console.log('Lite Wearable markup compatibility passes.');
