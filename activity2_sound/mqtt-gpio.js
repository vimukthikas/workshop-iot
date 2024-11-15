const mqtt = require('mqtt')
const rpio = require('rpio');

const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
})

const topic = '/nodejs/mqtt'

rpio.init({ mapping: 'gpio' });
rpio.open(4, rpio.INPUT, rpio.PULL_DOWN);

client.on('connect', () => {
  console.log(`Connected $clientId`)

  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
})

client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
})

setInterval(() => {
  const value = rpio.read(4);
  //console.log(`${value}`);
  if (value == 1){
    client.publish(topic, 'Sound detected', { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
  }
}, 100);

process.on('SIGINT', () => {
    console.log('\nCleaning up GPIO...');
    button.unexport(); // Release the GPIO resources
    process.exit();
});

