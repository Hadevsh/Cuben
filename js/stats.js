let chart; // Holds the Chart.js instance

// Function to fetch the data
async function fetchData() {
    const response = await fetch('http://localhost:3000/times');
    return await response.json();
}

// Initialize the page
async function init() {
    const data = await fetchData();

    // Populate the category dropdown
    const categorySelect = document.getElementById('category');
    for (const category in data) {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    }

    // Add event listeners for auto-updating the chart
    document.getElementById('category').addEventListener('change', updateChart);
    document.getElementById('numberOfRuns').addEventListener('change', updateChart);
    document.getElementById('movingAverage').addEventListener('change', updateChart);

    // Initialize the chart with default values
    updateChart();
}

// Parse time in "00:00.00" format to milliseconds
function parseTimeToMilliseconds(time) {
    const [minutes, seconds] = time.split(':');
    const [sec, millis] = seconds.split('.');
    return parseInt(minutes) * 60000 + parseInt(sec) * 1000 + parseInt(millis) * 10;
}

// Format milliseconds back to "00:00.00"
function formatMilliseconds(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const millis = Math.floor((milliseconds % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
}

// Calculate moving average dynamically based on selected runs
function movingAverage(data, period) {
    return data.map((_, index, arr) => {
        if (index < period) return null;
        const subset = arr.slice(index - period + 1, index + 1);
        return subset.reduce((sum, val) => sum + val, 0) / subset.length;
    }).filter(x => x !== null);
}

// Update the chart
async function updateChart() {
    const data = await fetchData();
    const category = document.getElementById('category').value;
    const numberOfRuns = document.getElementById('numberOfRuns').value;
    const showMovingAvg = document.getElementById('movingAverage').checked;

    if (!data[category] || data[category].length === 0) {
        alert('No data available for this category.');
        return;
    }

    let times = data[category].map((entry) => ({
        time: parseTimeToMilliseconds(entry.time),
        date: new Date(entry.date).toLocaleString(),
    }));

    // Filter invalid times
    times = times.filter(entry => entry.time > 0);

    // Handle "all" case or limit runs
    if (numberOfRuns !== 'all') {
        times = times.slice(-parseInt(numberOfRuns));
    }

    const labels = times.map((_, index) => `Run ${index + 1}`);
    const chartData = times.map((entry) => entry.time);
    let movingAvgData = showMovingAvg ? movingAverage(chartData, 1) : [];

    console.log(times.length);

    if (chart) {
        chart.destroy();
    }

    var style = getComputedStyle(document.body);
    var foregroundCol = style.getPropertyValue('--foreground');
    var drkForCol = style.getPropertyValue('--darker-foreground');
    var textCol = style.getPropertyValue('--text');

    const ctx = document.getElementById('statsChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Solve Times',
                    data: chartData,
                    backgroundColor: `${foregroundCol}50`,
                    borderColor: foregroundCol,
                    borderWidth: 1.5,
                },
                ...(showMovingAvg
                    ? [{
                        label: `Moving Average`,
                        data: movingAvgData,
                        backgroundColor: `${drkForCol}50`,
                        borderColor: drkForCol,
                        borderWidth: 2,
                        borderDash: [5, 5], // Dotted line
                    }]
                    : []),
            ],
        },
        options: {
            tension: 0.4,
            responsive: true,
            color: textCol,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const time = formatMilliseconds(context.raw);
                            const date = times[context.dataIndex]?.date || "N/A";
                            return `Time: ${time}, Date: ${date}`;
                        },
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: drkForCol,
                    },
                    grid: {
                        color: `${drkForCol}30`,
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: drkForCol,
                        callback: function (value) {
                            return formatMilliseconds(value);
                        }
                    },
                    grid: {
                        color: `${drkForCol}30`,
                    },
                },
            },
        },
    });
}

// Initialize the app
window.onload = init;
