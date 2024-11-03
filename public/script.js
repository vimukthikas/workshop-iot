const ctx = document.getElementById('lineChart').getContext('2d');
const dataPoints = [];
const labels = [];

const lineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Sensor Value',
            data: dataPoints,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Sensor Value'
                }
            }
        }
    }
});

// Establish a WebSocket connection to receive real-time sensor data
const socket = new WebSocket(`ws://${window.location.host}`);

// Handle incoming WebSocket messages
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const sensorValue = data.value;
    const currentTime = new Date().toLocaleTimeString();

    // Update the chart with the new sensor value
    if (labels.length > 20) {
        labels.shift();
        dataPoints.shift();
    }
    labels.push(currentTime);
    dataPoints.push(sensorValue);
    lineChart.update();
};
