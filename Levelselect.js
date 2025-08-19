const pathCanvas = document.getElementById("path")
const ctx2 = pathCanvas.getContext("2d")

import {
    Enemy, Sheller, Speedling,
    gameState,
    levelSelectScreen,
} from './main.js';

import { updateMoney, updateStars, updateLevel, showScreen } from './main.js'
import { applySkills } from './skilltree.js'


document.getElementById("start").addEventListener("click", () => {
    showScreen(levelSelectScreen)
});

let levelNumber = 1

// Levels + data
const levels = [
    {
        id: 1,
        name: "Colony Fire",
        unlocked: true,
        hearts: 50,
        levelStars: 0,
        startMoney: 100,
        map: "grass",
        maxwaves: 5,
        path: [{x:0,y:300},{x:800,y:300}],
        waves: [
        [ { type: 'Enemy', count: 2 } ],
        
        [ { type: 'Enemy', count: 5 } ],
        
        [ { type: 'Enemy', count: 3 }, { type: 'Sheller', count: 1 } ],
        
        [ { type: 'Enemy', count: 2 }, { type: 'Sheller', count: 2 }, { type: 'Enemy', count: 2} ],
        
        [ { type: 'Enemy', count: 5 }, { type: 'Sheller', count: 2 } ],
        ], spawnPattern: function() {
           if (gameState.gameRunning === true) {
            const currentWaveData = this.waves[gameState.wave - 1];

            let delay = 0;
            currentWaveData.forEach(enemyGroup => {
            for (let i = 0; i < enemyGroup.count; i++) {
                setTimeout(() => {
                if (enemyGroup.type === 'Enemy') gameState.enemies.push(new Enemy());
                else if (enemyGroup.type === 'Sheller') gameState.enemies.push(new Sheller());
                else if (enemyGroup.type === 'Speedling') gameState.enemies.push(new Speedling());
                }, delay);
                delay += 2000; // adjust delay between spawns
                }
            });
            }
        }
    },

    {
        id: 2,
        name: "Second Contact",
        unlocked: false,
        hearts: 50,
        levelStars: 0,
        startMoney: 150,
        map: "desert",
        maxwaves: 7,
        path: [{x:0,y:200},{x:800,y:500}],
        waves: [
        [ { type: 'Enemy', count: 3 } ],
        
        [ { type: 'Enemy', count: 7 } ],
        
        [ { type: 'Enemy', count: 3 }, { type: 'Speedling', count: 2 } ],
        
        [ { type: 'Speedling', count: 6 } ],
        
        [ { type: 'Enemy', count: 5 }, { type: 'Sheller', count: 2 } ],

        [ { type: 'Sheller', count: 5 } ],

        [ { type: 'Enemy', count: 5 }, { type: 'Sheller', count: 2 } ],

        ], spawnPattern: function() {

           if (gameState.gameRunning === true) {
            const currentWaveData = this.waves[gameState.wave - 1];

            let delay = 0;
            currentWaveData.forEach(enemyGroup => {
            for (let i = 0; i < enemyGroup.count; i++) {
                setTimeout(() => {
                if (enemyGroup.type === 'Enemy') gameState.enemies.push(new Enemy());
                else if (enemyGroup.type === 'Sheller') gameState.enemies.push(new Sheller());
                else if (enemyGroup.type === 'Speedling') gameState.enemies.push(new Speedling());
                }, delay);
                delay += 2000; // adjust delay between spawns
                }
            });
            }
        }


    },
    {
        id: 3,
        name: "Broken City",
        unlocked: false,
        hearts: 50,
        levelStars: 0,
        startMoney: 200,
        map: "city",
        maxwaves: 9,
        path: [ { x: 0, y: 100 }, { x: 100, y: 100 },
            { x: 100, y: 200 },{ x: 400, y: 200 },
            { x: 400, y: 500 },{ x: 800, y: 500 } ],
        waves: [
        [ { type: 'Speedling', count: 3 } ],
        
        [ { type: 'Enemy', count: 7 } ],
        
        [ { type: 'Speedling', count: 10 } ],
        
        [ { type: 'Sheller', count: 6 } ],
        
        [ { type: 'Enemy', count: 10 }, { type: 'Sheller', count: 4 } ],

        [ { type: 'Speedling', count: 15 } ],

        [ { type: 'Enemy', count: 15 }, { type: 'Speedling', count: 10 } ],

        [ { type: 'Enemy', count: 5 }, { type: 'Sheller', count: 5 } ],

        [ { type: 'Enemy', count: 5 }, { type: 'Sheller', count: 2 }, { type: 'Speedling', count: 10 } ],

        ], spawnPattern: function() {

           if (gameState.gameRunning === true) {
            const currentWaveData = this.waves[gameState.wave - 1];

            let delay = 0;
            currentWaveData.forEach(enemyGroup => {
            for (let i = 0; i < enemyGroup.count; i++) {
                setTimeout(() => {
                if (enemyGroup.type === 'Enemy') gameState.enemies.push(new Enemy());
                else if (enemyGroup.type === 'Sheller') gameState.enemies.push(new Sheller());
                else if (enemyGroup.type === 'Speedling') gameState.enemies.push(new Speedling());
                }, delay);
                delay += 2000; // adjust delay between spawns
                }
            });
            }
        }


    }
    ];

// ====== Game Variables ======
let currentLevel = null;

 
function drawPath() {
    ctx2.clearRect(0, 0, 800, 600);

    ctx2.fillStyle = "lightgreen";
    console.log(currentLevel)
    if (currentLevel.map === "desert") {ctx2.fillStyle = "sandybrown"}
    else if (currentLevel.map === "snow") {ctx2.fillStyle = "lightblue" }
    else if (currentLevel.map === "city") {ctx2.fillStyle = "lightgray"}

    ctx2.fillRect(0, 0, 800, 600);
    ctx2.strokeStyle = "gray";
    ctx2.lineWidth = 40;
    ctx2.beginPath();
    ctx2.moveTo(currentLevel.path[0].x, currentLevel.path[0].y);
    for (let i = 1; i < currentLevel.path.length; i++) {
    const p = currentLevel.path[i];
    ctx2.lineTo(p.x, p.y);
        
    }
    ctx2.stroke();
    console.log("Path has been drawn")
}



function loadLevel(selectedLevel) {
    currentLevel = selectedLevel;
    console.log(currentLevel)
    getCurrentPath();

    gameState.maxwaves = currentLevel.maxwaves
    gameState.wave = 1;
    gameState.money = selectedLevel.startMoney;
    gameState.enemies = [];
    gameState.towers = [];
    gameState.bullets = [];
    gameState.gameRunning = true;
    
    applySkills();

    ctx2.clearRect(0, 0, pathCanvas.width, pathCanvas.height);
            
    document.getElementById("path").style.display = "block";
        
    console.log(`Loading ${selectedLevel.name} with map: ${selectedLevel.map}`);
    updateMoney();
    drawPath();
    startWave();
}


// waves
function startWave() {
    if (gameState.wave > currentLevel.maxwaves && gameState.enemies.length === 0) {
        levelCompleted();
        }

        if (gameState.enemies.length === 0) { // If no enemies, do spawning basically
            // console.log(currentLevel)
            currentLevel.spawnPattern();
            gameState.wave++;
            console.log("Wave passing!")
        }

}




// Functions
function checkWaveCleared() { // Delay between waves
    if (gameState.enemies.length === 0) {
        setTimeout(() => {
        startWave();
        }, 1000);
    }
};

function getCurrentPath() {
    console.log("Getting path")
    gameState.path = currentLevel ? currentLevel.path : [];
}

function levelCompleted() {

    // Varible resetting 
    gameState.wave = 1;
    gameState.money = 100;
    gameState.enemies = [];
    gameState.towers = [];
    gameState.bullets = [];
    gameState.path = [];
    gameState.gameRunning = false;

    ctx2.clearRect(0, 0, pathCanvas.width, pathCanvas.height);

    showScreen(levelSelectScreen)

    console.log(`Level ${levelNumber} has been done`)
    // Unlocking system
    const currentIndex = levels.findIndex(l => l.id === currentLevel.id);
    if (currentIndex !== -1 && currentIndex + 1 < levels.length) {
        levels[currentIndex + 1].unlocked = true;
        document.getElementById("level" + levels[currentIndex + 1].id + "Btn").style.display = "inline-block"
    }
    calculateStars();
}

// calculate stars
function calculateStars() {

    const heartsLeft = currentLevel.hearts
    let starsEarned = currentLevel.levelStars

    if (heartsLeft > 48) { starsEarned = 3; }
    else if (heartsLeft > 30) { starsEarned = 2; }
    else {starsEarned = 1;}

    if (starsEarned > currentLevel.levelStars) {
        gameState.starcount = starsEarned - currentLevel.levelStars
        currentLevel.levelStars = starsEarned;
        updateStars();
    }
    console.log(currentLevel.levelStars)
}




// Exporting and level buttons
export { levelNumber }
export { checkWaveCleared }

// Hiding buttons
document.getElementById("level2Btn").style.display = "none";
document.getElementById("level3Btn").style.display = "none";



// Loading levels per button
document.getElementById("level1Btn").addEventListener("click", () => {
    loadLevel(levels[0]);
    updateLevel();
});

document.getElementById("level2Btn").addEventListener("click", () => {
    loadLevel(levels[1]);
    updateLevel();
});

document.getElementById("level3Btn").addEventListener("click", () => {
    loadLevel(levels[2]);
    updateLevel();
});
