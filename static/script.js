const startBtn = document.getElementById('start-btn');
const mutateBtn = document.getElementById('mutate-btn');
const targetInput = document.getElementById('target');
const consoleOutput = document.getElementById('console-output');
const progressBar = document.getElementById('progress-bar');
const topologyGraph = document.getElementById('topology-graph');

let hackingInterval = null;
let currentProgress = 0;
let strategyMutated = false;

function printToConsole(message, status = 'success') {
    const p = document.createElement('p');
    const timestamp = new Date().toLocaleTimeString();
    p.textContent = `[${timestamp}] ${message}`;
    if (status === 'warning') {
        p.className = 'warning';
    }
    consoleOutput.appendChild(p);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

async function performHackStep() {
    try {
        const response = await fetch('/api/hack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ strategy_mutated: strategyMutated })
        });
        
        const data = await response.json();
        
        // Update Graph
        if (data.graph) {
            topologyGraph.src = `data:image/png;base64,${data.graph}`;
        }
        
        // Print message
        printToConsole(data.event, data.status);
        
        // Update progress if not a warning
        if (data.status !== 'warning') {
            currentProgress += data.progress_increase;
            if (currentProgress > 100) currentProgress = 100;
            
            progressBar.style.width = `${currentProgress}%`;
            progressBar.textContent = `${currentProgress}%`;
            
            if (currentProgress >= 100) {
                printToConsole(`TARGET [${targetInput.value}] SUCCESSFULLY BREACHED. ROOT ACCESS GRANTED.`);
                stopMission();
            }
        }
        
    } catch (error) {
        printToConsole("ERROR: Connection to proxy failed.", "warning");
    }
    
    // Reset mutated strategy after 1 step
    if (strategyMutated) {
        strategyMutated = false;
        mutateBtn.disabled = false;
    }
}

function stopMission() {
    clearInterval(hackingInterval);
    startBtn.textContent = 'START MISSION';
    startBtn.disabled = false;
    mutateBtn.disabled = true;
    targetInput.disabled = false;
}

startBtn.addEventListener('click', () => {
    if (!targetInput.value.trim()) {
        printToConsole("Please enter a valid target before starting mission.", "warning");
        return;
    }
    
    if (startBtn.textContent === 'START MISSION') {
        // Start mission
        currentProgress = 0;
        progressBar.style.width = '0%';
        progressBar.textContent = '0%';
        consoleOutput.innerHTML = '';
        
        printToConsole(`Initiating attack sequence on target: ${targetInput.value}`);
        startBtn.textContent = 'ABORT MISSION';
        mutateBtn.disabled = false;
        targetInput.disabled = true;
        
        hackingInterval = setInterval(performHackStep, 2000);
    } else {
        // Abort mission
        printToConsole("Mission aborted by user.", "warning");
        stopMission();
    }
});

mutateBtn.addEventListener('click', () => {
    strategyMutated = true;
    mutateBtn.disabled = true;
    printToConsole("Mutated hacking strategy loaded into memory. Applying to next sequence burst...");
});
