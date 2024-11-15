# IoT Workshop - November 2024

## Activity 1: Visualizing Sensor Data

### What We Will Do
We will connect a sound sensor to a Raspberry Pi using GPIO, read the sensor's digital values, and send this data to a remote server hosted on AWS. The data will be visualized in a live-updating chart.

---

### Steps

#### a. Connect the Sound Sensor to the Raspberry Pi
- **Note:** The Raspberry Pi lacks a built-in ADC, so we can only read the sensor's digital output.  
  *(In a follow-up activity, we will connect an Arduino to handle analog values and send them to the Raspberry Pi via UART.)*
  
- **Connections:**
  - Sensor > Pi:
    - VCC > 5V
    - GND > GND
    - D0 > GPIO4

- **Check GPIO Values:**
  Run the script `/activity2_sound/gpio.js` on the Raspberry Pi to confirm the sensor's readings.

---

#### b. Create and Host a Web Server on AWS EC2
1. **Web Server Setup:**
   - The server will handle incoming POST requests and update the chart with sensor data.

2. **Configuring EC2 to Receive Traffic:**
   - Go to the **EC2 Dashboard** on AWS.
   - Select your instance and click on the **Security Group** under "Security".
   - Edit **Inbound Rules**:
     - **Type:** Custom TCP Rule
     - **Port Range:** 3000
     - **Source:** `0.0.0.0/0` *(allows access from anywhere; restrict IP range if needed)*.
   - Save the changes.

3. **Find the Public IPv4 Address:**
   - Example: `3.25.103.113` (accessible from **Instance Details**).

4. **Test Using Postman:**
   - Open Postman and create a new POST request:
     - **URL:** `http://3.25.103.113:3000/sensor-data`
     - **Body (JSON):**
       ```json
       {
           "value": 75.3
       }
       ```

5. **Edit the Server Script:**
   - Update `server.js` to listen on all network interfaces:
     ```javascript
     app.listen(3000, '0.0.0.0', () => {
         console.log('Server running...');
     });
     ```

6. **Run the Server:**
   - Start the server by executing `node server.js`.

7. **Access the Application:**
   - Open a browser and visit: `http://3.25.103.113:3000/`.

---

#### c. Script to Send Sensor Data to the Server
- A script to send POST requests from the Raspberry Pi is available at:  
  `/activity2_sound/server-gpio.js`.

- **Run the Script:**
  - Tap the sensor and observe the live chart updating in the browser.

---

### To-Do:
- Interface UART communication between Arduino and Raspberry Pi to handle analog values and visualize them similarly.

---

## Activity 2: MQTT Client

### What We Will Do
We will use MQTT to send and receive sensor data. The Raspberry Pi will act as an MQTT client, sending sensor data to an MQTT broker. We will subscribe to the topic from another device to view the messages.

---

### Steps

#### a. Run the MQTT Client Script
- Run the script `mqtt-gpio.js` on the Raspberry Pi.
- Tap the sensor and send messages to the MQTT broker.

#### b. Subscribe to the MQTT Topic
- Use the following example code to listen to the topic from another device:
  ```javascript
  const mqtt = require('mqtt');

  const host = 'broker.emqx.io';
  const port = '1883';
  const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

  const connectUrl = `mqtt://${host}:${port}`;

  const client = mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      username: 'emqx',
      password: 'public',
      reconnectPeriod: 1000,
  });

  const topic = '/nodejs/mqtt';

  client.on('connect', () => {
      console.log('Connected');
      client.subscribe([topic], () => {
          console.log(`Subscribed to topic '${topic}'`);
      });
  });

  client.on('message', (topic, payload) => {
      console.log('Received Message:', topic, payload.toString());
  });
