const rpio = require('rpio');

rpio.init({ mapping: 'gpio' });
// Configure GPIO 4 as input with a pull-down resistor
rpio.open(4, rpio.INPUT, rpio.PULL_DOWN);

// Poll the pin for changes
setInterval(() => {
    const value = rpio.read(4);
    console.log(`GPIO 4 value: ${value}`);
}, 100);