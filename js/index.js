// ----------------------------------------------------- Timer -----------------------------------------------------
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

    findBWTimes(); // Find best/worst times and display them
}

// ----------------------------------------------------- Settings -----------------------------------------------------
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

// Show unsaved setting indicator on change
function showUnsaved() {
    const settings = {
        category: document.getElementById("category").value,
        saveTime: document.getElementById("save-time").value,
        averageN: document.getElementById("average-n").value,
        bestN: document.getElementById("best-n").value,
        scrambles: document.getElementById("scrambles-toggle").checked ? "on" : "off",
        bestWorst: document.getElementById("best-worst-toggle").checked ? "on" : "off",
        penalties: document.getElementById("penalties-toggle").checked ? "on" : "off",
        sound: document.getElementById("sound-toggle").checked ? "on" : "off"
    };

    fetch('http://localhost:3000/settings')
        .then(response => response.json())
        .then(savedSettings => {
            for (const key in settings) {
                const unsavedIndicator = document.getElementById(`unsaved-${key}`);
                if (settings[key] !== savedSettings[key]) {
                    unsavedIndicator.style.display = "inline";
                } else {
                    unsavedIndicator.style.display = "none";
                }
            }
        })
        .catch(error => {
            console.error("Error fetching settings:", error);
        });
}
// Attach change event listeners to all relevant inputs
const inputs = document.querySelectorAll(
    "#category, #save-time, #average-n, #best-n, #scrambles-toggle, #best-worst-toggle, #penalties-toggle, #sound-toggle"
);

inputs.forEach(input => {
    input.addEventListener("change", showUnsaved);
});


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
        sound: document.getElementById("sound-toggle").checked ? "on" : "off"
    };

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

    // Update what to show
    document.getElementById("category-display").innerText = settings.category;
    findBWTimes(); // Best/Worst
    updateSettigsDisplay();

    showUnsaved();
}

function updateSettigsDisplay() {
    fetch('http://localhost:3000/settings')
        .then(response => response.json())
        .then(settings => {
            document.getElementById("category").value = settings.category || "3x3";
            document.getElementById("save-time").value = settings.saveTime || "manual";
            document.getElementById("average-n").value = settings.averageN || "none";
            document.getElementById("best-n").value = settings.bestN || "none";
            document.getElementById("scrambles-toggle").checked = settings.scrambles === "on";
            document.getElementById("best-worst-toggle").checked = settings.bestWorst === "on";
            document.getElementById("penalties-toggle").checked = settings.penalties === "on";
            document.getElementById("sound-toggle").checked = settings.sound === "on";

            // Update what to show
            document.getElementById("category-display").innerText = settings.category || "3x3";
            findBWTimes();
        });
}
updateSettigsDisplay();

// Close the modal when clicking outside of the modal content
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeSettings();
    }
});

// 1. Add an indicator on settings change (to save)

// ----------------------------------------------------- Utils -----------------------------------------------------
// Times data utils
function parseTimeToSeconds(timeStr) {
    // Convert "00:01.28" or "00:00.00" format to seconds
    const [minutes, rest] = timeStr.split(':');
    const [seconds, milliseconds] = rest.split('.');
    return parseInt(minutes, 10) * 60 + parseInt(seconds, 10) + parseInt(milliseconds, 10) / 100;
}

// ----------------------------------------------------- To Show -----------------------------------------------------
function findBWTimes(timespan=null) {
    fetch('http://localhost:3000/settings')
        .then(response => response.json())
        .then(settings => {
            if (settings.bestWorst === "on") { // Only show best/worst when in settings
                const category = settings.category;
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
                        // return bestEntry
                    } else {}

                    let worstTime = null;
                    bestEntry = null;
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
                        // return bestEntry
                    } else {}
                }).catch(error => {
                    console.error('Error finding best/worst time:', error);
                    document.getElementById("best-time").innerText = `Best: N\\A`;
                    document.getElementById("worst-time").innerText = `Worst: N\\A`;
            });
        } if (settings.bestWorst === "off") { // If best/worst settings is off
            // Clear the paragraphs
            document.getElementById("best-time").innerText = ``;
            document.getElementById("worst-time").innerText = ``;
        }
    })
}