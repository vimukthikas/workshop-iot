const { SerialPort, ReadlineParser } = require('serialport');

// Create a new serial port instance
const port = new SerialPort({ path: '/dev/ttyS0', baudRate: 9600 });

// Create a parser instance
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

// Listen for data
parser.on('data', (data) => {
  console.log(`Received: ${data}`);
});