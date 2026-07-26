const assert = require('assert');
const fs = require('fs');

const css = fs.readFileSync('entry/src/main/js/MainAbility/pages/index/index.css', 'utf8');
const hml = fs.readFileSync('entry/src/main/js/MainAbility/pages/index/index.hml', 'utf8');

['position:', 'overflow:', 'font-weight:', 'border-top-width:', 'border-right-width:', 'align-items: baseline', '4px 4px', '9px 9px', '50%'].forEach((unsupported) => {
    assert(!css.includes(unsupported), 'Lite Wearable CSS must not contain unsupported syntax: ' + unsupported);
});
assert(!hml.includes('<button'), 'Lite Wearable HML must use tappable div elements, not button tags.');
assert(!hml.includes("{{ isWaterMoving ?"), 'Lite Wearable class selectors must not use data binding.');
assert(hml.includes('/common/images/home_screen_default.png'), 'Lite Wearable must render the tested local 454px home visual.');
console.log('Lite Wearable markup compatibility passes.');
