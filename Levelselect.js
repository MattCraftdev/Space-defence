let selectedLevel = null





// ====== Level Data ======
const levels = [
  {
    id: 1,
    name: "Colony Fire",
    unlocked: true,
    startWave: 1,
    startMoney: 100,
    map: "grass",
    path: [{x:0,y:300},{x:800,y:300}],
    spawnPattern: function(wave) {
      for (let i = 0; i < wave * 2; i++) {
        setTimeout(() => enemies.push(new Enemy()), i * 500);
      }
    }
  },
  {
    id: 2,
    name: "Desert Pass",
    unlocked: false,
    startWave: 5,
    startMoney: 150,
    map: "desert",
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
    startWave: 10,
    startMoney: 200,
    map: "snow",
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
  console.log("path drawn")
}


const pathCanvas = document.getElementById("path")
const ctx2 = pathCanvas.getContext("2d")

function loadLevel(level) {
  if (!level.unlocked) {
    alert("Level locked!")
    return;
  }
  currentLevel = level;
  wave = level.startWave;
  money = level.startMoney;
  enemies = [];
  towers = [];
  bullets = [];
  
  ctx2.clearRect(0, 0, canvas.width, canvas.height);
  drawPath();
    
  window.PATH = level.path;
    
  document.getElementById("path").style.display = "block";
  
  console.log(`Loading ${level.name} with map: ${level.map}`);
  
  if (!gameRunning) {
    gameRunning = true;

  }
  
  startWave();

}
// waves
function startWave() {
  if (currentLevel) {
    currentLevel.spawnPattern(wave);
    wave++;
  }
}

function checkWaveCleared() {
  if (enemies.length === 0) {
    setTimeout(() => {
      startWave();
    }, 3000);
  }
}



document.getElementById("level1Btn").addEventListener("click", () => {
  loadLevel(levels[0]);
  updateLevel();
});

document.getElementById("level2Btn").addEventListener("click", () => {
  loadLevel(levels[1]);
  updateLevel();
});
