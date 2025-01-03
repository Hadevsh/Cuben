// Timer functionality ------
let timerDisplay = document.getElementById('timer');
let timer;
let startTime;
let running = false;
let preparing = false;
let holdTimeout;

let greenColor = 'rgb(114, 232, 46)'; // Must be rgb for styling comparing
let whiteColor = '#fff';
let redColor = '#e82e2e';

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !preparing && !running) {
        var audio = new Audio('/src/sounds/start-sound.mp3'); // Load start audio file
        audio.volume = 0.2;
        audio.play();
        event.preventDefault();
        preparing = true;
        timerDisplay.style.color = redColor;
        timerDisplay.style.textShadow = `0px 0px 10px ${redColor}`; // Red glow
        holdTimeout = setTimeout(() => {
            timerDisplay.style.color = greenColor;
            timerDisplay.style.textShadow = `0px 0px 10px ${greenColor}`; // Green glow
        }, 1000); // 1 second
    }
});

document.addEventListener('keyup', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        if (preparing && !running) {
            var audio = new Audio('/src/sounds/start-cube.mp3'); // Load start timer run audio file
            audio.volume = 0.2;
            audio.play();
            clearTimeout(holdTimeout);
            if (timerDisplay.style.color === greenColor) {
                startTimer();
            } else {
                console.log('Preparation interrupted');
            }
            timerDisplay.style.color = whiteColor;
            timerDisplay.style.textShadow = null; // Reset glow when timer is going
            preparing = false;
        } else if (running) {
            stopTimer();
        }
    }
});

function startTimer() {
    startTime = Date.now();
    running = true;
    timer = setInterval(updateTimer, 10);
}

function stopTimer() {
    var audio = new Audio('/src/sounds/end-cube.mp3'); // Load stop timer run audio file
    audio.volume = 0.2;
    audio.play();
    timerDisplay.style.textShadow = `0px 0px 10px ${whiteColor}`; // White glow
    clearInterval(timer);
    running = false;
}

function updateTimer() {
    let elapsedTime = Date.now() - startTime;
    let minutes = Math.floor(elapsedTime / 60000);
    let seconds = Math.floor((elapsedTime % 60000) / 1000);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);
    timerDisplay.textContent = `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds)}`;
}

function pad(number) {
    return number.toString().padStart(2, '0');
}

// Settings menu ------
// Get the modal element and settings button
const modal = document.getElementById("settings-modal");
const settingsBtn = document.getElementById("settings-btn");

// Open the settings modal
settingsBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

// Close the modal
function closeSettings() {
    modal.style.display = "none";
}

// Save settings
function saveSettings() {
    const settings = {
        category: document.getElementById("category").value,
        saveTime: document.getElementById("save-time").value,
        averageN: document.getElementById("average-n").value,
        bestN: document.getElementById("best-n").value,
        scrambles: document.getElementById("scrambles-toggle").checked ? "on" : "off",
        bestWorst: document.getElementById("best-worst-toggle").checked ? "on" : "off",
        penalties: document.getElementById("penalties-toggle").checked ? "on" : "off",
    };

    // Update what to show
    document.getElementById("category-display").innerText = settings.category;
    findBestTime(settings.category);
    findWorstTime(settings.category);

    fetch('http://localhost:3000/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
    }).then(() => {
        console.log('Settings saved successfully');

        var audio = new Audio('/src/sounds/save-sound.mp3'); // Load save audio file
        audio.volume = 0.2;
        audio.play();
    });
}

// Load settings on page load
window.onload = function () {
    fetch('http://localhost:3000/settings')
        .then(response => response.json())
        .then(settings => {
            document.getElementById("category").value = settings.category || "3x3";
            document.getElementById("save-time").value = settings.saveTime || "manual";
            document.getElementById("average-n").value = settings.aon || "none";
            document.getElementById("best-n").value = settings.bon || "none";
            document.getElementById("scrambles-toggle").checked = settings.scrambles === "on";
            document.getElementById("best-worst-toggle").checked = settings.bw === "on";
            document.getElementById("penalties-toggle").checked = settings.penalties === "on";

            // Update what to show
            document.getElementById("category-display").innerText = settings.category || "3x3";
            findBestTime(settings.category || "3x3");
            findWorstTime(settings.category || "3x3");
        });
};

// Close the modal when clicking outside of the modal content
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeSettings();
    }
});

// 1. Add an indicator on settings change (to save)

// Function to save current timer time
function addTimeToSession() {
    const time = document.getElementById("timer").innerHTML;
    const date = new Date().toJSON();
    const category = document.getElementById("category").value;

    fetch('http://localhost:3000/times', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, time, date }),
    }).then(() => {
        console.log('Time saved successfully');

        var audio = new Audio('/src/sounds/save-sound.mp3'); // Load save audio file
        audio.volume = 0.2;
        audio.play();
    }).catch(error => {
        console.error('Error saving time:', error);
    });

    fetch('http://localhost:3000/settings')
    .then(response => response.json())
    .then(settings => {
        // Update what to show
        findBestTime(settings.category);
        findWorstTime(settings.category);
    });
}

// Times data utils
function parseTimeToSeconds(timeStr) {
    // Convert "00:01.28" or "00:00.00" format to seconds
    const [minutes, rest] = timeStr.split(':');
    const [seconds, milliseconds] = rest.split('.');
    return parseInt(minutes, 10) * 60 + parseInt(seconds, 10) + parseInt(milliseconds, 10) / 100;
}

function findBestTime(category, timespan=null) {
    fetch('http://localhost:3000/times')
        .then(response => response.json())
        .then(times => {
            const data = times[category];

            let bestTime = null;
            let bestEntry = null;
            if (timespan === null) { // Get best time from whole data
                data.forEach(entry => {
                    if (entry.time !== "00:00.00") { // Ignore invalid times
                        const timeInSeconds = parseTimeToSeconds(entry.time);
                        if (bestTime === null || timeInSeconds < bestTime) {
                            bestTime = timeInSeconds;
                            bestEntry = entry;
                        }
                    }
                });
                document.getElementById("best-time").innerText = `Best: ${bestEntry["time"]}`;
                return bestEntry
            } else {
                
            }
    }).catch(error => {
        console.error('Error finding best time:', error);
    });
}

function findWorstTime(category, timespan=null) {
    fetch('http://localhost:3000/times')
        .then(response => response.json())
        .then(times => {
            const data = times[category];

            let worstTime = null;
            let bestEntry = null;
            if (timespan === null) { // Get best time from whole data
                data.forEach(entry => {
                    if (entry.time !== "00:00.00") { // Ignore invalid times
                        const timeInSeconds = parseTimeToSeconds(entry.time);
                        if (worstTime === null || timeInSeconds > worstTime) {
                            worstTime = timeInSeconds;
                            bestEntry = entry;
                        }
                    }
                });
                document.getElementById("worst-time").innerText = `Worst: ${bestEntry["time"]}`;
                return bestEntry
            } else {
                
            }
    }).catch(error => {
        console.error('Error finding worst time:', error);
    });
}