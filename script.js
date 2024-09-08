const breakDecrementBtn = document.getElementById("break-decrement");
const breakIncrementBtn = document.getElementById("break-increment");
const sessionDecrementBtn = document.getElementById("session-decrement");
const sessionIncrementBtn = document.getElementById("session-increment");
const breakLength = document.getElementById("break-length");
const sessionLength = document.getElementById("session-length");
const timeLeft = document.getElementById("time-left");
const startStopBtn = document.getElementById("start_stop");
const resetBtn = document.getElementById("reset");
const beep = document.getElementById("beep");

const DEFAULT_BREAK_LENGTH = 17;
const DEFAULT_SESSION_LENGTH = 52;

let timer;
let isRunning = false;
let isSession = true;
let sessionTime = DEFAULT_SESSION_LENGTH * 60;
let breakTime = DEFAULT_BREAK_LENGTH * 60;

const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const updateDisplay = () => {
    if (timeLeft) {
        timeLeft.innerText = formatTime(isSession ? sessionTime : breakTime);
    }
};

const updateTheme = () => {
    if (isSession) {
        document.body.classList.remove('break-theme');
        document.body.classList.add('session-theme');
    } else {
        document.body.classList.remove('session-theme');
        document.body.classList.add('break-theme');
    }
};

const startTimer = () => {
    timer = setInterval(() => {
        if (isSession) {
            sessionTime--;
            if (sessionTime < 0) {
                beep.play();
                clearInterval(timer);
                isSession = false;
                sessionTime = parseInt(sessionLength.innerText) * 60;
                breakTime = parseInt(breakLength.innerText) * 60;
                document.getElementById("timer-label").innerText = "Break";
                updateTheme();
                updateDisplay();
                startTimer();
            } else {
                updateDisplay();
            }
        } else {
            breakTime--;
            if (breakTime < 0) {
                beep.play();
                clearInterval(timer);
                isSession = true;
                sessionTime = parseInt(sessionLength.innerText) * 60;
                breakTime = parseInt(breakLength.innerText) * 60;
                document.getElementById("timer-label").innerText = "Session";
                updateTheme();
                updateDisplay();
                startTimer();
            } else {
                updateDisplay();
            }
        }
    }, 1000);
};

const resetTimer = () => {
    clearInterval(timer);
    if (beep) {
        beep.pause();
        beep.currentTime = 0;
    }
    breakLength.innerText = DEFAULT_BREAK_LENGTH;
    sessionLength.innerText = DEFAULT_SESSION_LENGTH;
    sessionTime = DEFAULT_SESSION_LENGTH * 60;
    breakTime = DEFAULT_BREAK_LENGTH * 60;
    isSession = true;
    updateTheme();
    updateDisplay();
    document.getElementById("timer-label").innerText = "Session";
    startStopBtn.innerText = "Start";
    isRunning = false;
};

breakIncrementBtn.addEventListener("click", () => {
    let breakLengthValue = parseInt(breakLength.innerText);
    if (breakLengthValue < 60) {
        breakLength.innerText = ++breakLengthValue;
        if (!isSession) {
            breakTime = breakLengthValue * 60;
            updateDisplay();
        }
    }
});

breakDecrementBtn.addEventListener("click", () => {
    let breakLengthValue = parseInt(breakLength.innerText);
    if (breakLengthValue > 1) {
        breakLength.innerText = --breakLengthValue;
        if (!isSession) {
            breakTime = breakLengthValue * 60;
            updateDisplay();
        }
    }
});

sessionIncrementBtn.addEventListener("click", () => {
    let sessionLengthValue = parseInt(sessionLength.innerText);
    if (sessionLengthValue < 60) {
        sessionLength.innerText = ++sessionLengthValue;
        if (isSession) {
            sessionTime = sessionLengthValue * 60;
            updateDisplay();
        }
    }
});

sessionDecrementBtn.addEventListener("click", () => {
    let sessionLengthValue = parseInt(sessionLength.innerText);
    if (sessionLengthValue > 1) {
        sessionLength.innerText = --sessionLengthValue;
        if (isSession) {
            sessionTime = sessionLengthValue * 60;
            updateDisplay();
        }
    }
});

startStopBtn.addEventListener("click", () => {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startStopBtn.innerText = "Start";
    } else {
        startTimer();
        isRunning = true;
        startStopBtn.innerText = "Pause";
    }
});

resetBtn.addEventListener("click", () => {
    resetTimer();
});

window.onload = () => {
    updateTheme();
    updateDisplay();
    document.getElementById("timer-label").innerText = "Session";
};