const express = require('express');
const bodyParser = require('body-parser');
const { WebSocketServer } = require('ws'); // Import WebSocketServer
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json()); // Parse JSON data in requests

// WebSocket server setup
const wss = new WebSocketServer({ noServer: true });

// Function to broadcast data to all connected WebSocket clients
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Handle sensor data received from a POST request
app.post('/sensor-data', (req, res) => {
    const { value } = req.body;
    if (value !== undefined) {
        console.log('Received sensor value:', value);
        broadcast({ value }); // Broadcast the new value to WebSocket clients
        res.json({ message: 'Sensor data received', value });
    } else {
        res.status(400).json({ error: 'Invalid sensor data' });
    }
});

// Handle WebSocket connections
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
