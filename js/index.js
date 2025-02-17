import { showToast } from './toast.js';
import { updateTheme, redColor, greenColor } from './script.js';

// ----------------------------------------------------- Timer -----------------------------------------------------
let timerDisplay = document.getElementById('timer');
let timer;
let startTime;
let running = false;
let preparing = false;
let holdTimeout;

let timerColor = 'var(--text)';

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && !preparing && !running) {
        playSound('start-sound'); // Load start audio file
        event.preventDefault();
        preparing = true;
        timerDisplay.style.color = redColor;
        timerDisplay.style.textShadow = `0px 0px 20px ${redColor}`; // Red glow
        holdTimeout = setTimeout(() => {
            timerDisplay.style.color = greenColor;
            timerDisplay.style.textShadow = `0px 0px 20px ${greenColor}`; // Green glow
        }, 1000); // 1 second
    }
});

document.addEventListener('keyup', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
        if (preparing && !running) {
            playSound('start-cube'); // Load start timer run audio file
            clearTimeout(holdTimeout);
            if (timerDisplay.style.color === greenColor) {
                startTimer();
            } else {
                console.log('Preparation interrupted');
                showToast('Preparation interrupted', 'info');
            }
            timerDisplay.style.color = timerColor;
            timerDisplay.style.textShadow = null; // Reset glow when timer is going
            preparing = false;
        } else if (running) {
            // If auto time saving in settings
            fetch('http://localhost:3000/settings')
            .then(response => response.json())
            .then(settings => {
                if (settings.saveTime === "auto") {
                    addTimeToSession();
                }
            })
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
    playSound('end-cube'); // Load stop timer run audio file
    timerDisplay.style.textShadow = `-3px 3px 10px ${timerColor}`; // Text shadow with the same color as text
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
        showToast('Time saved successfully', 'success');

        playSound('save-sound'); // Load save audio file
    }).catch(error => {
        console.error('Error saving time:', error);
        showToast('Error saving time', 'error');
    });

    findBWTimes(); // Find best/worst times and display them
    findBestN(); // Find best of n and display it
    findAverageN(); // Find average of n and display it
}

// ----------------------------------------------------- Custom Theme ----------------------------------------------------- 
const themeModal = document.getElementById("theme-modal");
const themeBtn = document.getElementById("custom-theme-btn");

// Open the theme modal
themeBtn.addEventListener("click", () => {
    themeModal.style.display = "block";
});

// Close the modal
function closeTheme() {
    themeModal.style.display = "none";
}

// Close the modal when clicking outside of the modal content
window.addEventListener("click", (event) => {
    if (event.target === themeModal) {
        closeTheme();
    }
});

// ----------------------------------------------------- Info -----------------------------------------------------
const infoModal = document.getElementById("info-modal");
const infoBtn = document.getElementById("info-btn");

// Open the info modal
infoBtn.addEventListener("click", () => {
    infoModal.style.display = "block";
});

// Close the modal
function closeInfo() {
    infoModal.style.display = "none";
}

// Close the modal when clicking outside of the modal content
window.addEventListener("click", (event) => {
    if (event.target === infoModal) {
        closeInfo();
    }
});

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
        sound: document.getElementById("sound-toggle").checked ? "on" : "off",
        theme: document.getElementById("theme").value
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
            showToast('Error fetching settings', 'error');
        });
}
// Attach change event listeners to all relevant inputs
const inputs = document.querySelectorAll(
    "#category, #save-time, #average-n, #best-n, #scrambles-toggle, #best-worst-toggle, #penalties-toggle, #sound-toggle, #theme"
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
        sound: document.getElementById("sound-toggle").checked ? "on" : "off",
        theme: document.getElementById("theme").value
    };

    fetch('http://localhost:3000/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
    }).then(() => {
        console.log('Settings saved successfully');
        showToast('Settings saved successfully', 'success');

        playSound('save-sound'); // Load save audio file
    });

    // Update what to show
    document.getElementById("category-display").innerText = settings.category;
    findBWTimes(); // Best/Worst
    findBestN(); // Best of n
    findAverageN(); // Average of N
    cubeScramble(); // Show Cube scramble visualizer
    updateTheme(); // Update theme
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
            document.getElementById("theme").value = settings.theme || "dark";

            // Update what to show
            document.getElementById("category-display").innerText = settings.category || "3x3";
            findBWTimes();
            findBestN();
            findAverageN();
            cubeScramble();
            updateTheme();
        });
}
updateSettigsDisplay();

// Close the modal when clicking outside of the modal content
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeSettings();
    }
});

// ----------------------------------------------------- Utils -----------------------------------------------------
// Times data utils
function parseTimeToSeconds(timeStr) {
    // Convert "00:01.28" or "00:00.00" format to seconds
    const [minutes, rest] = timeStr.split(':');
    const [seconds, milliseconds] = rest.split('.');
    return parseInt(minutes, 10) * 60 + parseInt(seconds, 10) + parseInt(milliseconds, 10) / 100;
}

function secondsToTime(totalSeconds) {
    // Round the total seconds to hundredths and work with integers.
    const totalHundredths = Math.round(totalSeconds * 100);
    
    // Calculate minutes.
    const minutes = Math.floor(totalHundredths / (60 * 100));
    
    // Calculate the remaining hundredths after removing the minutes.
    const remainingHundredths = totalHundredths % (60 * 100);
    
    // Calculate whole seconds from the remainder.
    const seconds = Math.floor(remainingHundredths / 100);
    
    // The final remainder is the hundredths.
    const hundredths = remainingHundredths % 100;
    
    // Format each part to always have two digits.
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
    const hundredthsStr = hundredths.toString().padStart(2, '0');
    
    return `${minutesStr}:${secondsStr}.${hundredthsStr}`;
  }

function playSound(sound) {
    fetch('http://localhost:3000/settings')
    .then(response => response.json())
    .then(settings => {
        if (settings.sound === "on") { // Only show best/worst when in settings
            var audio = new Audio(`/src/sounds/${sound}.mp3`); // Load start audio file
            audio.volume = 0.2;
            audio.play();
        }
    }).catch(error => {
        console.error('Error playing sound:', error);
        showToast('Error playing sound.', 'error');
    });
}

document.addEventListener("DOMContentLoaded", updateTheme());

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
                    showToast('Error finding best/worst time. This could happen because of no times recorded yet.', 'error');
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

function findBestN() {
    fetch('http://localhost:3000/settings')
        .then(response => response.json())
        .then(settings => {
            if (settings.bestN !== "none") { // Only show BoN when in settings
                const category = settings.category;
                fetch('http://localhost:3000/times')
                .then(response => response.json())
                .then(times => {
                    const data = times[category];
                    const timespan = settings.bestN;

                    let bestTime = null;
                    let bestEntry = null;
                    let entry = null;
                    for (let i = 0; i < timespan; i++) {
                        entry = data[data.length - i - 1];
                        if (entry.time !== "00:00.00") { // Ignore invalid times
                            const timeInSeconds = parseTimeToSeconds(entry.time);
                            if (bestTime === null || timeInSeconds < bestTime) {
                                bestTime = timeInSeconds;
                                bestEntry = entry;
                            }
                        }
                    }
                    document.getElementById("bestN").innerText = `Bo${timespan}: ${bestEntry.time}`;
                }).catch(error => {
                    console.error('Error finding best of n:', error);
                    showToast('Error finding BoN. This could happen because of no times, or not enough times recorded yet.', 'error');
                    document.getElementById("bestN").innerText = `Bo${timespan}: N\\A`;
            });
        } if (settings.bestN === "none") { // If BoN settings is off
            // Clear the paragraphs
            document.getElementById("bestN").innerText = ``;

        }
    })
}

function findAverageN() {
    fetch('http://localhost:3000/settings')
        .then(response => response.json())
        .then(settings => {
            if (settings.averageN !== "none") { // Only show AoN when in settings
                const category = settings.category;
                fetch('http://localhost:3000/times')
                .then(response => response.json())
                .then(times => {
                    const data = times[category];
                    const timespan = settings.averageN;

                    let allTimes = null;
                    let entry = null;
                    for (let i = 0; i < timespan; i++) {
                        entry = data[data.length - i - 1];
                        if (entry.time !== "00:00.00") { // Ignore invalid times
                            const timeInSeconds = parseTimeToSeconds(entry.time);
                            allTimes += timeInSeconds;
                        }
                    }
                    document.getElementById("averageN").innerText = `Ao${timespan}: ${secondsToTime(allTimes / timespan)}`;
                }).catch(error => {
                    console.error('Error finding AoN:', error);
                    showToast('Error finding AoN. This could happen because of no times, or not enough times recorded yet.', 'error');
                    document.getElementById("averageN").innerText = `Ao${timespan}: N\\A`;
            });
        } if (settings.averageN === "none") { // If AoN settings is off
            // Clear the paragraphs
            document.getElementById("averageN").innerText = ``;
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

// Random scramble generator
function generateScramble(length) {
    const moves = ['U', 'D', 'F', 'B', 'L', 'R'];
    const modifiers = ['', "'", '2'];
    let scramble = [];
    let lastMove = '';

    for (let i = 0; i < length; i++) {
        let move;
        do {
            move = moves[Math.floor(Math.random() * moves.length)];
        } while (move === lastMove); // Avoid repeating the same face

        lastMove = move;

        const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
        scramble.push(move + modifier);
    }

    return scramble.join(' ');
}

// Scramble function to display scramble and apply it
function applyScramble() {
    const lengthInput = document.getElementById('scrambleLength').value;
    const scrambleLength = parseInt(lengthInput, 10) || 20; // Default to 20 moves if input is invalid
    const scramble = generateScramble(scrambleLength);

    // Reset cube state (optional)
    resetCube();

    document.getElementById('scrambleOutput').innerText = scramble;

    // Apply scramble moves to the cube
    const moves = scramble.split(' ');
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

// Reset cube to the solved state
function resetCube() {
    cube.U = Array(9).fill('white');
    cube.D = Array(9).fill('yellow');
    cube.F = Array(9).fill('green');
    cube.B = Array(9).fill('blue');
    cube.L = Array(9).fill('orange');
    cube.R = Array(9).fill('red');
    renderCube();
    document.getElementById("scrambleOutput").innerHTML = ``;
}

// Initial rendering and button logic
function cubeScramble() {
    fetch('http://localhost:3000/settings')
    .then(response => response.json())
    .then(settings => {
        if (settings.scrambles === "on") { // Only show scrambles when "on" in settings
            const container = document.getElementById('visualizer-controls');
            container.innerHTML = `
                <label for="scrambleLength">Scramble Length:</label>
                <input type="number" id="scrambleLength" value="20" min="1" max="40">
                <button onclick="applyScramble()">Scramble</button>
                <button onclick="resetCube()">Reset</button>
                <p><span id="scrambleOutput" class="selectable"></span></p>
            `;
            renderCube();
        } if (settings.scrambles === "off") { // If scrambles setting is off
            // Clear the container
            document.getElementById('visualizer-controls').innerHTML = ``;
            document.getElementById('rubiks-cube').innerHTML = ``;
        }
    }).catch(error => {
        console.error('Error showing the scramble visualizer:', error);
        showToast('Error showing the scramble visualizer', 'error');
    });
}

cubeScramble();

// Explicitly Attach Functions to window.
// - To make addTimeToSession (or any other function) accessible from index.html, 
//   we need to attach it to the window object
window.addTimeToSession = addTimeToSession;
window.saveSettings = saveSettings;
window.closeSettings = closeSettings;
window.closeInfo = closeInfo;
window.closeTheme = closeTheme;
window.openNav = openNav;
window.closeNav = closeNav;
window.applyScramble = applyScramble;
window.resetCube = resetCube;