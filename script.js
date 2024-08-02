let battleLog = document.getElementById('battle-log');

let actionQueue = [];
let isProcessingQueue = false;

function logAction(message, delay = 800) {
    actionQueue.push({ message, delay });
    processQueue();
}

function processQueue() {
    if (isProcessingQueue) return;
    if (actionQueue.length === 0) {
        isProcessingQueue = false;
        return;
    }

    isProcessingQueue = true;
    let { message, delay } = actionQueue.shift();

    setTimeout(() => {
        let entry = document.createElement('div');
        entry.textContent = message;
        battleLog.appendChild(entry);
        battleLog.scrollTop = battleLog.scrollHeight;

        isProcessingQueue = false;
        processQueue();
    }, delay);
}


let players = {
    player1: { health: 100, comboSequence: [], comboReady: false },
    player2: { health: 100, comboSequence: [], comboReady: false }
};

const comboPattern = ['attack', 'attack', 'attack']; // Define the combo pattern

function performAction(actor, action, target) {
    if (action === 'attack') {
        let damage = Math.floor(Math.random() * 20) + 1;
        players[target].health -= damage;
        logAction(`${actor} attacked ${target} for ${damage} damage. ${target} health is now ${players[target].health}.`);
    }

    if(action === 'effect') {
        let poisonDamage = Math.floor(Math.random() * 10) + 1;
        players[target].health -= poisonDamage;
        logAction(`${actor} attacked with effect (Poison) ${target} for ${poisonDamage} damage. ${target} health is now ${players[target].health}.`);
        logAction(`${target} is poisoned! --> Damage Over Time (DoT)`);
        players[target].health -= poisonDamage;
        logAction(`${target} is poisoned! got ${poisonDamage} damage. ${target} health is now ${players[target].health}.`);
        players[target].health -= poisonDamage;
        logAction(`${target} is poisoned! got ${poisonDamage} damage. ${target} health is now ${players[target].health}.`);
        
    }

    // how to implement combo attack
    if(action === 'combo') {
        // Track the combo sequence
        players[actor].comboSequence.push("attack");
        if (players[actor].comboSequence.length > comboPattern.length) {
            players[actor].comboSequence.shift(); // Keep only the latest actions within the pattern length
        }

        // Check if the combo pattern is achieved
        if (arraysEqual(players[actor].comboSequence, comboPattern)) {
            players[actor].comboReady = true;
            logAction(`${actor} combo attack ready!`);
            logAction(`${actor} doing some fancy attacks!`);
            logAction(`cling!`);
            logAction(`cling!`);
            logAction(`cling!`);
        }

        // Apply combo effect if ready
        if (players[actor].comboReady) {
            let comboDamage = 30;
            players[target].health -= comboDamage;
            logAction(`${actor} performed a combo attack on ${target} for ${comboDamage} damage. ${target} health is now ${players[target].health}.`);
            players[actor].comboReady = false; // Reset combo
            players[actor].comboSequence = []; // Reset combo sequence
        }
    }

    if (action === 'heal') {
        let healthPoint = 20;
        players[actor].health += healthPoint;
        logAction(`${actor} healed for ${healthPoint} health point. ${actor} health is now ${players[actor].health}.`);
    }

    if (players[target].health <= 0) {
        logAction(`${target} has been defeated!`);
    }
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}