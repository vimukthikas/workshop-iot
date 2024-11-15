const axios = require('axios');
const rpio = require('rpio');

rpio.init({ mapping: 'gpio' });
rpio.open(4, rpio.INPUT, rpio.PULL_DOWN);

const apiUrl = 'http://3.25.103.113:3000/sensor-data'; 
var payload = {
    value: 100
};

var times = 0;


async function callApi(val) {
    try {
        payload = {
            value: val 
        }
        const response = await axios.post(apiUrl, payload, {
            headers: {
                'Content-Type': 'application/json', // Set appropriate headers
            },
        });

        console.log('API Response:', response.data);
    } catch (error) {
        console.error('Error calling the API:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
            console.error('Status Code:', error.response.status);
        }
    }
}

setInterval(() => {
    const value = rpio.read(4);
    //console.log(`GPIO 4 value: ${value}`);
    if(value == 1){
        callApi(times++);
    }

}, 100);
