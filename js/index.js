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
    var audio = new Audio('/src/sounds/save-sound.mp3'); // Load save audio file
    audio.volume = 0.2;
    audio.play();
    updateSettings(); // Update settings and create a new session afterwards
    // closeSettings(); // Close the modal after saving
}

// Close the modal when clicking outside of the modal content
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeSettings();
    }
});


// 1. Add an idicator on settings change (to save)

// Save time ------
// Example data to collect
let sessionData = {
    times: [], // Array to store recorded times
    settings: {
        category: "3x3", // Default category
        saveTime: "manual",
        aon: "none",
        bon: "none",
        scrambles: "off",
        bw: "on",
        penalties: "off"
    }
};

// Function to save current timer time
function addTimeToSession() {
    var audio = new Audio('/src/sounds/save-sound.mp3'); // Load save audio file
    audio.volume = 0.2;
    audio.play();
    time = document.getElementById("timer").innerHTML;
    var time_data = {
        "time": time,
        "date": new Date().toJSON() // Current date in json format
    };
    sessionData.times.push(time_data);
    console.log("Logged time to session", time);
    console.log(sessionData.times);
}

// 1. on page load gather the last session settings and update them 
// Function to update settings
function updateSettings() {
    const category = document.getElementById("category").value;
    const saveTime = document.getElementById("save-time").value;
    const aon = document.getElementById("average-n").value;
    const bon = document.getElementById("best-n").value;
    const scrambles = document.getElementById("scrambles-toggle").value;
    const bw = document.getElementById("best-worst-toggle").value;
    const penalties = document.getElementById("penalties-toggle").value;

    // Only when saving using a button:
    // (to avoid making a new session every time on page relaod)
    // 1. save current session data to a file
    // 2. clear the session data json
    // 3. create a new session data template with current settings (new session)

    sessionData.settings.category = category;
    sessionData.settings.saveTime = saveTime;
    sessionData.settings.aon = aon;
    sessionData.settings.bon = bon;
    sessionData.settings.scrambles = scrambles;
    sessionData.settings.bw = bw;
    sessionData.settings.penalties = penalties;

    // Update category display
    document.getElementById("category-display").innerHTML = `${category}`;

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

// Update settings on page load/refresh
updateSettings();