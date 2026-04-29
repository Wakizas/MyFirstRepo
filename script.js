// Pomodoro Timer JavaScript

// Variables globales
let timerInterval = null;
let timeLeft = 25 * 60; // 25 minutes en secondes
let isRunning = false;
let currentMode = 'pomodoro';
let completedPomodoros = 0;

// Durées en secondes
const MODES = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
};

// Éléments du DOM
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const pomodoroBtn = document.getElementById('pomodoro-btn');
const shortBreakBtn = document.getElementById('short-break-btn');
const longBreakBtn = document.getElementById('long-break-btn');
const completedCount = document.getElementById('completed-count');

// Fonction pour formater le temps (MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Fonction pour mettre à jour l'affichage
function updateDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
    document.title = `${formatTime(timeLeft)} - Pomodoro Timer`;
}

// Fonction pour démarrer le timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerFinished();
            }
        }, 1000);
    }
}

// Fonction pour mettre en pause le timer
function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
}

// Fonction pour réinitialiser le timer
function resetTimer() {
    pauseTimer();
    timeLeft = MODES[currentMode];
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

// Fonction appelée quand le timer est terminé
function timerFinished() {
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    
    // Jouer un son d'alerte
    playAlarm();
    
    // Incrémenter le compteur si c'est un pomodoro
    if (currentMode === 'pomodoro') {
        completedPomodoros++;
        completedCount.textContent = completedPomodoros;
        
        // Afficher une notification
        showNotification('Pomodoro terminé ! Prenez une pause.');
    } else {
        showNotification('Pause terminée ! Au travail !');
    }
}

// Fonction pour jouer un son d'alarme
function playAlarm() {
    // Créer un contexte audio simple
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Répéter 3 fois
    setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 800;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.5, audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.5);
    }, 600);
    
    setTimeout(() => {
        const osc3 = audioContext.createOscillator();
        const gain3 = audioContext.createGain();
        osc3.connect(gain3);
        gain3.connect(audioContext.destination);
        osc3.frequency.value = 800;
        osc3.type = 'sine';
        gain3.gain.setValueAtTime(0.5, audioContext.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        osc3.start(audioContext.currentTime);
        osc3.stop(audioContext.currentTime + 0.5);
    }, 1200);
}

// Fonction pour afficher une notification
function showNotification(message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
            body: message,
            icon: '🍅'
        });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Pomodoro Timer', {
                    body: message,
                    icon: '🍅'
                });
            }
        });
    }
    
    // Alerte visuelle dans tous les cas
    alert(message);
}

// Fonction pour changer de mode
function changeMode(mode) {
    pauseTimer();
    currentMode = mode;
    timeLeft = MODES[mode];
    updateDisplay();
    
    // Mettre à jour les boutons de mode
    pomodoroBtn.classList.remove('active');
    shortBreakBtn.classList.remove('active');
    longBreakBtn.classList.remove('active');
    
    if (mode === 'pomodoro') {
        pomodoroBtn.classList.add('active');
    } else if (mode === 'shortBreak') {
        shortBreakBtn.classList.add('active');
    } else if (mode === 'longBreak') {
        longBreakBtn.classList.add('active');
    }
}

// Écouteurs d'événements
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

pomodoroBtn.addEventListener('click', () => changeMode('pomodoro'));
shortBreakBtn.addEventListener('click', () => changeMode('shortBreak'));
longBreakBtn.addEventListener('click', () => changeMode('longBreak'));

// Demander la permission pour les notifications au chargement
if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission();
}

// Initialisation
updateDisplay();
