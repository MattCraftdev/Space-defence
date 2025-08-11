let selectedLevel = null

const pathCanvas = document.getElementById("path")
const ctx2 = pathCanvas.getContext("2d")


// Levels + data
const levels = [
    {
        id: 1,
        name: "Colony Fire",
        unlocked: true,
        startMoney: 150,
        map: "grass",
        maxwaves: 5,
        path: [{x:0,y:300},{x:800,y:300}],
        waves: [
        [ {type: 'Enemy', count: 2} ],
        
        [ { type: 'Enemy', count: 5 } ],
        
        [ { type: 'Enemy', count: 3 }, { type: 'Sheller', count: 1 } ],
        
        [ { type: 'Enemy', count: 2 }, { type: 'Sheller', count: 2 }, { type: 'Enemy', count: 2} ],
        
        [ { type: 'Enemy', count: 5 }, { type: 'Sheller', count: 2 } ],
        ], spawnPattern: function(wave) {
        
        const currentWaveData = this.waves[wave - 1];

        if (!currentWaveData) {
        console.error(`No wave data found for wave ${wave}`);
            return;
        }
        let delay = 0;
        currentWaveData.forEach(enemyGroup => {
        for (let i = 0; i < enemyGroup.count; i++) {
            setTimeout(() => {
            if (enemyGroup.type === 'Enemy') enemies.push(new Enemy());
            else if (enemyGroup.type === 'Sheller') enemies.push(new Sheller());
            else if (enemyGroup.type === 'Speedling') enemies.push(new Speedling());
            }, delay);
            delay += 1500; // adjust delay between spawns
            }
        });
        }
    
    
    },
    {
        id: 2,
        name: "Sand",
        unlocked: false,
        startMoney: 150,
        map: "grass",
        maxwaves: 10,
        path: [{x:0,y:200},{x:800,y:500}],
        spawnPattern: function(wave) {
        for (let i = 0; i < wave; i++) {
            setTimeout(() => enemies.push(new Enemy()), i * 600);
        }
        if (wave >= 5) {
            setTimeout(() => enemies.push(new Sheller()), 2000);
        }
        }
    },
    {
        id: 3,
        name: "Frozen Trail",
        unlocked: false,
        startMoney: 200,
        map: "snow",
        maxwaves: 12,
        path: [{x:0,y:100},{x:800,y:400}],
        spawnPattern: function(wave) {
        for (let i = 0; i < wave; i++) {
            setTimeout(() => enemies.push(new Speedling()), i * 400);
        }
        }
    }
    ];

// ====== Game Variables ======
let currentLevel = null;
wave = 1;
money = 0;
enemies = [];
towers = [];
bullets = [];
let gameRunning = false;

 
function drawPath() {
    ctx2.clearRect(0, 0, 800, 600);

    ctx2.fillStyle = "lightgreen";
    if (currentLevel.map === "desert") ctx2.fillStyle = "sandybrown";
    if (currentLevel.map === "snow") ctx2.fillStyle = "lightblue";
    if (currentLevel.map === "city")
        ctx.fillStyle = "lightgray"
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



function loadLevel(level) {
    if (!level.unlocked) {
        alert("Level locked!")
        return;
    } else {
    currentLevel = level;
    wave = 1;
    money = level.startMoney;
    enemies = [];
    towers = [];
    bullets = [];
    
    ctx2.clearRect(0, 0, pathCanvas.width, pathCanvas.height);
    drawPath();
        
    window.PATH = level.path;
        
    document.getElementById("path").style.display = "block";
    
    console.log(`Loading ${level.name} with map: ${level.map}`);
    
    if (!gameRunning) {
        gameRunning = true;

    }
    updateMoney();
    startWave();
    }
}
// waves
function startWave() {
    if (currentLevel) {
        if (wave > currentLevel.maxwaves) {
            currentLevel
            const currentIndex = levels.findIndex(l => l.id === currentLevel.id);
            if (currentIndex !== -1 && currentIndex + 1 < levels.length) {
                levels[currentIndex + 1].unlocked = true;
                console.log(`Unlocked ${levels[currentIndex + 1].name}!`);
            }
            gameRunning = false;
            console.log(`Level ${level} has been done`)
            titleScreen.style.display = "none";
            gameScreen.style.display = "none"
            levelSelectScreen.style.display = "block";
            }
            if (enemies.length === 0) {
                currentLevel.spawnPattern(wave);
                wave++;
                console.log("Wave passing")
            }
    }
}

function checkWaveCleared() {
    if (enemies.length === 0) {
        setTimeout(() => {
        startWave();
        }, 3000);
    }
};

setInterval (() => {
    window.checkWaveCleared();
}, 1000);

document.getElementById("level1Btn").addEventListener("click", () => {
    loadLevel(levels[0]);
    updateLevel();
});

document.getElementById("level2Btn").addEventListener("click", () => {
    loadLevel(levels[1]);
    updateLevel();
});
