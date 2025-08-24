// Declaring context
const pathCanvas = document.getElementById("path")
const ctx2 = pathCanvas.getContext("2d")

// Imports
import {
    Enemy, Sheller, Speedling,
    gameState,
    levelSelectScreen,
} from './main.js';

import { updateMoney, updateStars, updateLevel, updateHearts, showScreen } from './main.js'
import { applySkills } from './skilltree.js'

// Showing levelselectscreen
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
        maxwaves: 4,
        path: [ { id: "main", points: [ {x:0,y:300}, {x:800,y:300} ] }],
        waves: [
        [ { type: 'Enemy', count: 2, place: 'main' } ],
        
        [ { type: 'Enemy', count: 4, place: 'main' } ],
        
        [ { type: 'Enemy', count: 10, place: 'main' } ],
        
        [ { type: 'Enemy', count: 1, place: 'main' } ],
        

        ], spawnPattern: function() {
           if (gameState.gameRunning === true) {
            const currentWaveData = this.waves[gameState.wave - 1];
            let delay = 0;

            currentWaveData.forEach(enemyGroup => {
            for (let i = 0; i < enemyGroup.count; i++) {
                setTimeout(() => {
                    let enemy;
                    if (enemyGroup.type === 'Enemy') { enemy = new Enemy(); }
                    else if (enemyGroup.type === 'Sheller') { enemy = new Sheller(); }
                    else if (enemyGroup.type === 'Speedling') { enemy = new Speedling(); }

                    const targetPath = currentLevel.path.find(p => p.id === enemyGroup.place) || currentLevel.path[0];
                    enemy.path = targetPath.points;
                    enemy.pathIndex = 0;
                    if (enemy.path.length > 0) {
                    enemy.x = enemy.path[0].x;
                    enemy.y = enemy.path[0].y;
                    }

                    console.log(`Spawning ${enemyGroup.type} on path ${enemyGroup.place}`);

                    gameState.enemies.push(enemy);
                    
                    if (isNaN(enemy.x) || isNaN(enemy.y)) {
                        console.warn("Enemy has invalid position:", this);
                        return;
                    }
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
        path: [ { id: "main", points: [ {x:0,y:200},{x:800,y:500} ] } ],
        waves: [
        [ { type: 'Enemy', count: 3, place: 'main' } ],
        
        [ { type: 'Enemy', count: 7, place: 'main' } ],
        
        [ { type: 'Enemy', count: 3, place: 'main' }, { type: 'Speedling', count: 2, place: 'main' } ],
        
        [ { type: 'Speedling', count: 6, place: 'main' } ],
        
        [ { type: 'Enemy', count: 5, place: 'main' }, { type: 'Sheller', count: 2, place: 'main' } ],

        [ { type: 'Sheller', count: 5, place: 'main' } ],

        [ { type: 'Enemy', count: 5, place: 'main' }, { type: 'Sheller', count: 2, place: 'main' } ],

        ], spawnPattern: function() {
           if (gameState.gameRunning === true) {
            const currentWaveData = this.waves[gameState.wave - 1];
            let delay = 0;

            currentWaveData.forEach(enemyGroup => {
            for (let i = 0; i < enemyGroup.count; i++) {
                setTimeout(() => {
                    let enemy;
                    if (enemyGroup.type === 'Enemy') { enemy = new Enemy(); }
                    else if (enemyGroup.type === 'Sheller') { enemy = new Sheller(); }
                    else if (enemyGroup.type === 'Speedling') { enemy = new Speedling(); }

                    const targetPath = currentLevel.path.find(p => p.id === enemyGroup.place) || currentLevel.path[0];
                    enemy.path = targetPath.points;
                    enemy.pathIndex = 0;
                    if (enemy.path.length > 0) {
                    enemy.x = enemy.path[0].x;
                    enemy.y = enemy.path[0].y;
                    }

                    console.log(`Spawning ${enemyGroup.type} on path ${enemyGroup.place}`);

                    gameState.enemies.push(enemy);
                    
                    if (isNaN(enemy.x) || isNaN(enemy.y)) {
                        console.warn("Enemy has invalid position:", this);
                        return;
                    }
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
        path: [ { id: "main", points: [ { x: 0, y: 100 }, { x: 100, y: 100 },
            { x: 100, y: 200 },{ x: 400, y: 200 },
            { x: 400, y: 500 },{ x: 800, y: 500 } ] },
            { id: "secondary", points: [ { x: 0, y: 400 }, { x: 800, y: 400 } ] } ],
            
        waves: [
        [ { type: 'Speedling', count: 3, place: 'main' } ],
        
        [ { type: 'Enemy', count: 7, place: 'main' } ],
        
        [ { type: 'Speedling', count: 10, place: 'main' } ],
        
        [ { type: 'Sheller', count: 6, place: 'main' } ],
        
        [ { type: 'Enemy', count: 10, place: 'main' }, { type: 'Sheller', count: 4, place: 'secondary' } ],

        [ { type: 'Speedling', count: 15, place: 'main' }, { type: 'Enemy', count: 5, place: 'secondary'} ],

        [ { type: 'Enemy', count: 15, place: 'main' }, { type: 'Speedling', count: 10, place: 'main' } ],

        [ { type: 'Enemy', count: 5, place: 'main' }, { type: 'Speedling', count: 6, place: 'secondary'} ],

        [ { type: 'Enemy', count: 5, place: 'main' }, { type: 'Sheller', count: 3, place: 'secondary' }, { type: 'Speedling', count: 10, place: 'main' } ],

        ], spawnPattern: function() {
           if (gameState.gameRunning === true) {
            const currentWaveData = this.waves[gameState.wave - 1];
            let delay = 0;

            currentWaveData.forEach(enemyGroup => {
            for (let i = 0; i < enemyGroup.count; i++) {
                setTimeout(() => {
                    let enemy;
                    if (enemyGroup.type === 'Enemy') { enemy = new Enemy(); }
                    else if (enemyGroup.type === 'Sheller') { enemy = new Sheller(); }
                    else if (enemyGroup.type === 'Speedling') { enemy = new Speedling(); }

                    const targetPath = currentLevel.path.find(p => p.id === enemyGroup.place) || currentLevel.path[0];
                    enemy.path = targetPath.points;
                    enemy.pathIndex = 0;
                    if (enemy.path.length > 0) {
                    enemy.x = enemy.path[0].x;
                    enemy.y = enemy.path[0].y;
                    }

                    console.log(`Spawning ${enemyGroup.type} on path ${enemyGroup.place}`);

                    gameState.enemies.push(enemy);
                    
                    if (isNaN(enemy.x) || isNaN(enemy.y)) {
                        console.warn("Enemy has invalid position:", this);
                        return;
                    }
                }, delay);
                delay += 2000; // adjust delay between spawns
                }
            });
            }
        }


    },
    {
        id: 4,
        name: "The lonely forest",
        unlocked: true, //
        hearts: 50,
        levelStars: 0,
        startMoney: 250,
        map: "grass",
        maxwaves: 10,
        path: [ { id: "main", points: [ { x: 100, y: 0 }, { x: 100, y: 300 }, { x: 600, y: 300 },
             { x: 600, y: 100 }, { x: 800, y: 100 } ] },
            { id: "secondary", points: [ { x: 0, y: 500 }, { x: 800, y: 500 } ] } ],
        
        waves: [ // Add another enemy for disversity 
        [ { type: 'Speedling', count: 5, place: 'main' } ],
        
        [ { type: 'Enemy', count: 8, place: 'secondary' } ],
        
        [ { type: 'Speedling', count: 10, place: 'main' }, { type: 'Sheller', count: 3, place: 'secondary'} ],
        
        [ { type: 'Sheller', count: 6, place: 'main' }, { type: 'Speedling', count: 5, place: 'secondary'} ],
        
        [ { type: 'Enemy', count: 10, place: 'main' }, { type: 'Sheller', count: 4, place: 'secondary' } ],

        [ { type: 'Speedling', count: 15, place: 'main' }, { type: 'Enemy', count: 5, place: 'secondary'} ],

        [ { type: 'Enemy', count: 15, place: 'main' }, { type: 'Speedling', count: 10, place: 'main' } ],

        [ { type: 'Enemy', count: 5, place: 'main' }, { type: 'Sheller', count: 5, place: 'main' }, { type: 'Speedling', count: 6, place: 'secondary'} ],

        [ { type: 'Enemy', count: 5, place: 'main' }, { type: 'Sheller', count: 2, place: 'main' }, { type: 'Speedling', count: 10, place: 'main' } ],

        [ { type: 'Enemy', count: 5, place: 'main' }, { type: 'Sheller', count: 2, place: 'main' }, { type: 'Speedling', count: 10, place: 'main' } ],

        ], spawnPattern: function() {
           if (gameState.gameRunning === true) {
            const currentWaveData = this.waves[gameState.wave - 1];
            let delay = 0;

            currentWaveData.forEach(enemyGroup => {
            for (let i = 0; i < enemyGroup.count; i++) {
                setTimeout(() => {
                    let enemy;
                    if (enemyGroup.type === 'Enemy') { enemy = new Enemy(); }
                    else if (enemyGroup.type === 'Sheller') { enemy = new Sheller(); }
                    else if (enemyGroup.type === 'Speedling') { enemy = new Speedling(); }

                    const targetPath = currentLevel.path.find(p => p.id === enemyGroup.place) || currentLevel.path[0];
                    enemy.path = targetPath.points;
                    enemy.pathIndex = 0;
                    if (enemy.path.length > 0) {
                    enemy.x = enemy.path[0].x;
                    enemy.y = enemy.path[0].y;
                    }

                    console.log(`Spawning ${enemyGroup.type} on path ${enemyGroup.place}`);

                    gameState.enemies.push(enemy);
                    
                    if (isNaN(enemy.x) || isNaN(enemy.y)) {
                        console.warn("Enemy has invalid position:", this);
                        return;
                    }
                }, delay);
                delay += 2000; // adjust delay between spawns
                }
            });
            }
        }


    }
    ];

// Game functions
let currentLevel = null;

function drawPath() {
    ctx2.clearRect(0, 0, 800, 600);

    // Draws maps
    ctx2.fillStyle = "lightgreen";
    if (currentLevel.map === "desert") {ctx2.fillStyle = "sandybrown"}
    else if (currentLevel.map === "snow") {ctx2.fillStyle = "lightblue" }
    else if (currentLevel.map === "city") {ctx2.fillStyle = "lightgray"}

    ctx2.lineWidth = 40;
    ctx2.fillRect(0, 0, 800, 600);

    currentLevel.path.forEach(pathObj => {
        ctx2.strokeStyle = pathObj.id === "main" ? "gray" : "darkred"; // color by tag
        ctx2.beginPath();
        ctx2.moveTo(pathObj.points[0].x, pathObj.points[0].y);
        for (let i = 1; i < pathObj.points.length; i++) {
        ctx2.lineTo(pathObj.points[i].x, pathObj.points[i].y);
        }
        
        ctx2.stroke();
        console.log("Path has been drawn")
    });
}

function loadLevel(selectedLevel) {
    currentLevel = selectedLevel;
    console.log(currentLevel)

    levelNumber = currentLevel.id;
    gameState.maxwaves = currentLevel.maxwaves;
    gameState.wave = 1;
    gameState.money = currentLevel.startMoney;
    gameState.enemies = [];
    gameState.towers = [];
    gameState.bullets = [];
    gameState.currenthearts = currentLevel.hearts;
    gameState.gameRunning = true;
    
    applySkills();
    ctx2.clearRect(0, 0, pathCanvas.width, pathCanvas.height);
            
    document.getElementById("path").style.display = "block";
    console.log(`Loading ${selectedLevel.name} with map: ${selectedLevel.map}`);
    updateMoney();
    updateHearts();
    drawPath();
    startWave();
}

function startWave() {
    if (gameState.gameRunning === true) {
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

}


// More Functions
function checkWaveCleared() { // Delay between waves
    if (gameState.enemies.length === 0) {
        setTimeout(() => {
        startWave();
        }, 1000);
    }
};

function levelCompleted() {
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
    const heartsLeft = gameState.currenthearts
    let starsEarned = currentLevel.levelStars

    if (heartsLeft > 48) { starsEarned = 3; }
    else if (heartsLeft > 30) { starsEarned = 2; }
    else {starsEarned = 1;}

    if (starsEarned > currentLevel.levelStars) {
        gameState.starcount += starsEarned - currentLevel.levelStars
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
document.getElementById("level4Btn").style.display = "none";

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

document.getElementById("level4Btn").addEventListener("click", () => {
    loadLevel(levels[3]);
    updateLevel();
});