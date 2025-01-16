let chart; // Holds the Chart.js instance

// Function to fetch the data
async function fetchData() {
    const response = await fetch('data/times.json');
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

// Update the chart
async function updateChart() {
    const data = await fetchData();
    const category = document.getElementById('category').value;
    const numberOfRuns = document.getElementById('numberOfRuns').value;

    if (!data[category] || data[category].length === 0) {
        alert('No data available for this category.');
        return;
    }

    let times = data[category].map((entry) => ({
        time: parseTimeToMilliseconds(entry.time),
        date: new Date(entry.date).toLocaleString(),
    }));

    // Handle "all" case or limit runs
    if (numberOfRuns !== 'all') {
        times = times.slice(-parseInt(numberOfRuns));
    }

    const labels = times.map((_, index) => `Run ${index + 1}`);
    const chartData = times.map((entry) => entry.time);

    if (chart) {
        chart.destroy();
    }

    const ctx = document.getElementById('statsChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Times (ms)',
                    data: chartData,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1.5,
                },
            ],
        },
        options: {
            tension: 0.4,
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const time = formatMilliseconds(context.raw);
                            const date = times[context.dataIndex].date;
                            return `Time: ${time}, Date: ${date}`;
                        },
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return formatMilliseconds(value);
                        },
                    },
                },
            },
        },
    });
}

// Initialize the app
window.onload = init;
