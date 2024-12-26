// Timer functionality
let timerDisplay = document.getElementById('timer');
let timer;
let startTime;
let running = false;
let preparing = false;
let holdTimeout;

let greenColor = '#72e82e';
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
