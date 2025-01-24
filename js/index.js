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
                unsavedIndicator.style.marginLeft = `10px`;
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

// ----------------------------------------------------- Rubik's Cube Visualizer -----------------------------------------------------
const cube = {
    U: Array(9).fill('white'),
    D: Array(9).fill('yellow'),
    F: Array(9).fill('green'),
    B: Array(9).fill('blue'),
    L: Array(9).fill('orange'),
    R: Array(9).fill('red')
};

function renderCube() {
    const cubeContainer = document.getElementById('rubiks-cube');
    cubeContainer.innerHTML = '';
    const faces = { U: [1, 4], L: [4, 1], F: [4, 4], R: [4, 7], B: [4, 10], D: [7, 4] };
    for (const face in faces) {
        const [startRow, startCol] = faces[face];
        for (let i = 0; i < 9; i++) {
            const square = document.createElement('div');
            square.className = `square ${cube[face][i]}`;
            square.style.gridRowStart = Math.floor(i / 3) + startRow;
            square.style.gridColumnStart = (i % 3) + startCol;
            cubeContainer.appendChild(square);
        }
    }
}

// Helper function to rotate a face clockwise
function rotateFaceClockwise(face) {
    const temp = [...cube[face]];
    cube[face][0] = temp[6];
    cube[face][1] = temp[3];
    cube[face][2] = temp[0];
    cube[face][3] = temp[7];
    cube[face][5] = temp[1];
    cube[face][6] = temp[8];
    cube[face][7] = temp[5];
    cube[face][8] = temp[2];
}

// Helper function to rotate a face counterclockwise
function rotateFaceCounterClockwise(face) {
    const temp = [...cube[face]];
    cube[face][0] = temp[2];
    cube[face][1] = temp[5];
    cube[face][2] = temp[8];
    cube[face][3] = temp[1];
    cube[face][5] = temp[7];
    cube[face][6] = temp[0];
    cube[face][7] = temp[3];
    cube[face][8] = temp[6];
}

// Move functions
function moveU(clockwise = true) {
    const temp = [...cube.F.slice(0, 3)];
    if (clockwise) {
        cube.F.splice(0, 3, ...cube.R.slice(0, 3));
        cube.R.splice(0, 3, ...cube.B.slice(0, 3));
        cube.B.splice(0, 3, ...cube.L.slice(0, 3));
        cube.L.splice(0, 3, ...temp);
        rotateFaceClockwise('U');
    } else {
        cube.F.splice(0, 3, ...cube.L.slice(0, 3));
        cube.L.splice(0, 3, ...cube.B.slice(0, 3));
        cube.B.splice(0, 3, ...cube.R.slice(0, 3));
        cube.R.splice(0, 3, ...temp);
        rotateFaceCounterClockwise('U');
    }
}

function moveD(clockwise = true) {
    const temp = [...cube.F.slice(6)];
    if (clockwise) {
        cube.F.splice(6, 3, ...cube.L.slice(6));
        cube.L.splice(6, 3, ...cube.B.slice(6));
        cube.B.splice(6, 3, ...cube.R.slice(6));
        cube.R.splice(6, 3, ...temp);
        rotateFaceClockwise('D');
    } else {
        cube.F.splice(6, 3, ...cube.R.slice(6));
        cube.R.splice(6, 3, ...cube.B.slice(6));
        cube.B.splice(6, 3, ...cube.L.slice(6));
        cube.L.splice(6, 3, ...temp);
        rotateFaceCounterClockwise('D');
    }
}

function moveF(clockwise = true) {
    const temp = [cube.U[6], cube.U[7], cube.U[8]];
    if (clockwise) {
        [cube.U[6], cube.U[7], cube.U[8]] = [cube.L[8], cube.L[5], cube.L[2]];
        [cube.L[2], cube.L[5], cube.L[8]] = [cube.D[2], cube.D[1], cube.D[0]];
        [cube.D[0], cube.D[1], cube.D[2]] = [cube.R[6], cube.R[3], cube.R[0]];
        [cube.R[0], cube.R[3], cube.R[6]] = temp;
        rotateFaceClockwise('F');
    } else {
        [cube.U[6], cube.U[7], cube.U[8]] = [cube.R[0], cube.R[3], cube.R[6]];
        [cube.R[0], cube.R[3], cube.R[6]] = [cube.D[0], cube.D[1], cube.D[2]];
        [cube.D[0], cube.D[1], cube.D[2]] = [cube.L[8], cube.L[5], cube.L[2]];
        [cube.L[2], cube.L[5], cube.L[8]] = temp;
        rotateFaceCounterClockwise('F');
    }
}

function moveB(clockwise = true) {
    const temp = [cube.U[0], cube.U[1], cube.U[2]];
    if (clockwise) {
        [cube.U[0], cube.U[1], cube.U[2]] = [cube.R[2], cube.R[5], cube.R[8]];
        [cube.R[2], cube.R[5], cube.R[8]] = [cube.D[8], cube.D[7], cube.D[6]];
        [cube.D[6], cube.D[7], cube.D[8]] = [cube.L[6], cube.L[3], cube.L[0]];
        [cube.L[0], cube.L[3], cube.L[6]] = temp;
        rotateFaceClockwise('B');
    } else {
        [cube.U[0], cube.U[1], cube.U[2]] = [cube.L[0], cube.L[3], cube.L[6]];
        [cube.L[0], cube.L[3], cube.L[6]] = [cube.D[6], cube.D[7], cube.D[8]];
        [cube.D[6], cube.D[7], cube.D[8]] = [cube.R[2], cube.R[5], cube.R[8]];
        [cube.R[2], cube.R[5], cube.R[8]] = temp;
        rotateFaceCounterClockwise('B');
    }
}

function moveL(clockwise = true) {
    const temp = [cube.U[0], cube.U[3], cube.U[6]];
    if (clockwise) {
        [cube.U[0], cube.U[3], cube.U[6]] = [cube.B[8], cube.B[5], cube.B[2]];
        [cube.B[2], cube.B[5], cube.B[8]] = [cube.D[0], cube.D[3], cube.D[6]];
        [cube.D[0], cube.D[3], cube.D[6]] = [cube.F[0], cube.F[3], cube.F[6]];
        [cube.F[0], cube.F[3], cube.F[6]] = temp;
        rotateFaceClockwise('L');
    } else {
        [cube.U[0], cube.U[3], cube.U[6]] = [cube.F[0], cube.F[3], cube.F[6]];
        [cube.F[0], cube.F[3], cube.F[6]] = [cube.D[0], cube.D[3], cube.D[6]];
        [cube.D[0], cube.D[3], cube.D[6]] = [cube.B[8], cube.B[5], cube.B[2]];
        [cube.B[2], cube.B[5], cube.B[8]] = temp;
        rotateFaceCounterClockwise('L');
    }
}

function moveR(clockwise = true) {
    const temp = [cube.U[2], cube.U[5], cube.U[8]];
    if (clockwise) {
        [cube.U[2], cube.U[5], cube.U[8]] = [cube.F[2], cube.F[5], cube.F[8]];
        [cube.F[2], cube.F[5], cube.F[8]] = [cube.D[2], cube.D[5], cube.D[8]];
        [cube.D[2], cube.D[5], cube.D[8]] = [cube.B[6], cube.B[3], cube.B[0]];
        [cube.B[0], cube.B[3], cube.B[6]] = temp;
        rotateFaceClockwise('R');
    } else {
        [cube.U[2], cube.U[5], cube.U[8]] = [cube.B[6], cube.B[3], cube.B[0]];
        [cube.B[0], cube.B[3], cube.B[6]] = [cube.D[2], cube.D[5], cube.D[8]];
        [cube.D[2], cube.D[5], cube.D[8]] = [cube.F[2], cube.F[5], cube.F[8]];
        [cube.F[2], cube.F[5], cube.F[8]] = temp;
        rotateFaceCounterClockwise('R');
    }
}

function applyMoves() {
    const movesInput = document.getElementById('moves').value.trim();
    const moves = movesInput.split(' ');

    for (const move of moves) {
        const baseMove = move[0];
        const isCounterClockwise = move.includes("'");
        const isDouble = move.includes('2');

        switch (baseMove) {
            case 'U': moveU(!isCounterClockwise); if (isDouble) moveU(!isCounterClockwise); break;
            case 'D': moveD(!isCounterClockwise); if (isDouble) moveD(!isCounterClockwise); break;
            case 'F': moveF(!isCounterClockwise); if (isDouble) moveF(!isCounterClockwise); break;
            case 'B': moveB(!isCounterClockwise); if (isDouble) moveB(!isCounterClockwise); break;
            case 'L': moveL(!isCounterClockwise); if (isDouble) moveL(!isCounterClockwise); break;
            case 'R': moveR(!isCounterClockwise); if (isDouble) moveR(!isCounterClockwise); break;
        }
    }

    renderCube();
}

renderCube();
