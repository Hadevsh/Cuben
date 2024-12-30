// Timer functionality
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
        event.preventDefault();
        preparing = true;
        timerDisplay.style.color = redColor;
        holdTimeout = setTimeout(() => {
            timerDisplay.style.color = greenColor;
        }, 1000);
    }
});

document.addEventListener('keyup', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        if (preparing && !running) {
            clearTimeout(holdTimeout);
            if (timerDisplay.style.color === greenColor) {
                startTimer();
            } else {
                console.log('Preparation interrupted');
            }
            timerDisplay.style.color = whiteColor;
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

// Settings menu
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

// Save settings (example functionality)
function saveSettings() {
    const inspectionTime = document.getElementById("inspection-time").value;
    const soundEnabled = document.getElementById("sound-toggle").checked;

    console.log("Settings Saved:");
    console.log("Inspection Time:", inspectionTime);
    console.log("Sound Enabled:", soundEnabled);

    closeSettings(); // Close the modal after saving
}

// Close the modal when clicking outside of the modal content
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeSettings();
    }
});

// Save time
// Example data to collect
let sessionData = {
    times: [{
        time: "00:00.00",
        date: new Date().toJSON(), // Current date
    }], // Array to store recorded times
    settings: {
        category: "3x3", // Default category
        saveTime: "manual",
        aon: null,
        bon: null,
        scrambles: false,
        bw: true,
        penalties: false
    }
};

// Function to save current timer time
function addTimeToSession() {
    time = document.getElementById("timer").innerHTML;
    var time_data = {
        "time": time,
        "date": new Date().toJSON()
    };
    sessionData.times.push(time_data);
    console.log("Logged time to session", time);
    console.log(sessionData.times);
}

// Function to update settings
function updateSettings() {
    const category = document.getElementById("category").value;
    const saveTime = document.getElementById("save-time").value;
    const aon = document.getElementById("average-n").value;
    const bon = document.getElementById("best-n").value;
    const scramble = document.getElementById("scrambles-toggle").value;
    const bw = document.getElementById("best-worst-toggle").value;
    const penalties = document.getElementById("penalties-toggle").value;

    // 1. save current session data to a file
    // 2. clear the session data json
    // 3. create a new session data template with current settings (new sesion)

    sessionData.settings.category = category;
    sessionData.settings.saveTime = saveTime;
    sessionData.settings.aon = aon;
    sessionData.settings.bon = bon;
    sessionData.settings.scramble = scramble;
    sessionData.settings.bw = bw;
    sessionData.settings.penalties = penalties;

    console.log("Settings Updated:", sessionData.settings);
}

// Function to save session data as JSON
function saveAsJSON() {
    const dataStr = JSON.stringify(sessionData, null, 4); // Convert object to JSON string
    const blob = new Blob([dataStr], { type: "application/json" }); // Create a JSON file
    const url = URL.createObjectURL(blob); // Generate download link

    const a = document.createElement("a"); // Create an anchor element
    a.href = url;
    a.download = "sessionData.json"; // Set the file name
    document.body.appendChild(a);
    a.click(); // Trigger download
    document.body.removeChild(a); // Clean up
}

// Example usage: Record a time
// addTimeToSession("00:12.34"); // Add a recorded time