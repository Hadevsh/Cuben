// Sample data
const data = {
    "3x3": [
        { "time": "00:03.94", "date": "2025-01-03T14:36:26.381Z" },
        { "time": "00:04.64", "date": "2025-01-03T14:38:38.821Z" },
        { "time": "00:06.00", "date": "2025-01-03T14:38:41.565Z" },
        { "time": "00:02.40", "date": "2025-01-03T14:38:53.740Z" },
        { "time": "00:06.00", "date": "2025-01-03T14:38:44.759Z" },
        { "time": "00:02.40", "date": "2025-01-03T14:38:54.360Z" }
    ]
};

// Parse time strings to seconds
function timeToSeconds(time) {
    const [minutes, seconds] = time.split(":").map(Number);
    return minutes * 60 + seconds;
}

// Prepare chart data
function prepareChartData(n) {
    const times = data["3x3"].slice(-n).map(entry => timeToSeconds(entry.time));
    const labels = data["3x3"]
        .slice(-n)
        .map((_, index) => `Run ${index + 1}`);
    return { times, labels };
}

// Initialize chart
let chart;
function createChart(labels, times) {
    const ctx = document.getElementById("timesChart").getContext("2d");
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Solve Times (seconds)",
                    data: times,
                    borderColor: "#007bff",
                    backgroundColor: "rgba(0, 123, 255, 0.2)",
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Update chart on button click
document.getElementById("update-chart").addEventListener("click", () => {
    const n = parseInt(document.getElementById("n-runs").value, 10) || 10;
    const { labels, times } = prepareChartData(n);
    createChart(labels, times);
});

// Initial chart render
const { labels, times } = prepareChartData(10);
createChart(labels, times);
