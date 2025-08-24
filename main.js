// Imports
import { levelNumber } from "./Levelselect.js"
import { checkWaveCleared } from "./Levelselect.js"
import { createSkillTree } from "./skilltree.js"

// Screens
function showScreen(screenToShow) {
    const screens = [levelSelectScreen, gameScreen, titleScreen, upgradeScreen];
    screens.forEach(screen => {
        screen.style.display = (screen === screenToShow) ? "block" : "none";
    });
}

const buttons = document.getElementsByClassName("levelBtn");
for (let button of buttons) {
    button.addEventListener("click", () => {
        showScreen(gameScreen);
    });
}

document.getElementById("start").addEventListener("click", () => {
    showScreen(levelSelectScreen);
});


document.getElementById("goupgrade").addEventListener("click", () => {
    showScreen(upgradeScreen);
    createSkillTree();
});

const backButtons = document.querySelectorAll(".back");

backButtons.forEach(button => {
    button.addEventListener("click", () => {
        showScreen(titleScreen);
    });
});

// Exports
export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");

export const titleScreen = document.getElementById("titlepage");
export const levelSelectScreen = document.getElementById("levelSelect");
export const gameScreen = document.getElementById("playing");
export const upgradeScreen = document.getElementById("upgrades");

export const moneyDisplay = document.getElementById("money");
export const waveDisplay = document.getElementById("wave");
export const levelDisplay = document.getElementById("level");
export const starDisplay = document.getElementById("stars");
export const heartDisplay = document.getElementById("hearts");


export let frameCount = 0;

export const gameState = {
    wave: 1,
    maxwaves: 1,
    money: 100,
    enemies: [],
    towers: [],
    bullets: [],
    gameRunning: false,
    currenthearts: 50,
}

// Tower costs
const towerCosts = {
    gunner: 50,
    tank: 150
}

// IMAGES
// Campaign Images
const campaignmapimg = document.getElementById("campaignmapimg");
campaignmapimg.src = "images/campaignmap.png";

// Tower images
const gunnerimg = document.getElementById("gunnerimg");
gunnerimg.src = "images/gunner.png";

const tankimg = document.getElementById("tankimg");
tankimg.src = "images/tank.png";

// Enemy Images
const swarmerimg = document.getElementById("swarmerimg");
swarmerimg.src = "images/swarmer.png";

const shelldrakimg = document.getElementById("shelldrakimg");
shelldrakimg.src = "images/shelldrak.png";

const speedlingimg = document.getElementById("speedlingimg");
speedlingimg.src = "images/speedling.png";

// Hiding images after load
gunnerimg.style.display = "none";
tankimg.style.display = "none";
swarmerimg.style.display = "none";
shelldrakimg.style.display = "none";
speedlingimg.style.display = "none";

// Enemies
class Enemy {
    constructor() {
        this.speed = 1.25;
        this.hp = 10;
        this.maxHp = 10;
        this.def = 0;
        this.heartscost = 2;
        this.pathIndex = 0;
        this.isDead = false;
        this.reward = 10;
    }

    move() {
        if (this.pathIndex >= this.path.length - 1) { return; }

        const target = this.path[this.pathIndex + 1];
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.speed) {
            this.x = target.x;
            this.y = target.y;
            this.pathIndex++;
        
        if (this.pathIndex >= this.path.length - 1) {
            gameState.currenthearts -= this.heartscost;
            this.isDead = true;
            updateHearts()
        }
        
        } else {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
    }

    draw() {
        ctx.drawImage(swarmerimg, this.x - 25, this.y - 25)
        this.drawHealthBar()
    }
    
    drawHealthBar() {
        ctx.fillStyle = "black";
        ctx.fillRect(this.x - 15, this.y - 20, 30, 5);
        ctx.fillStyle = "lime";
        ctx.fillRect(this.x - 15, this.y - 20, (this.hp / this.maxHp) * 30, 5);
    }
}

class Sheller extends Enemy {
    constructor() {
        super();
        this.speed = 0.5;
        this.hp = 20;
        this.maxHp = 20;
        this.def = 1;
        this.heartscost = 5;
        this.pathIndex = 0;
        this.isDead = false;
        this.reward = 20;
    }
    
    draw() {
        ctx.drawImage(shelldrakimg, this.x - 50, this.y - 50);
        this.drawHealthBar();
    }
}

class Speedling extends Enemy {
    constructor() {
        super();
        this.speed = 3;
        this.hp = 8;
        this.maxHp = 8;
        this.def = 0;
        this.heartscost = 3;
        this.pathIndex = 0;
        this.isDead = false;
        this.reward = 15;
    }

    draw() {
        ctx.drawImage(speedlingimg, this.x - 25, this.y - 25);
        this.drawHealthBar();
    }
}

// Towers
class Gunner {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 100;
        this.fireRate = 40; // frames between shots
        this.level = 1;
        this.maxlevel = 1;
        this.counter = 0;
        this.type = "gunner"
    }

    draw(selected = false) {
        ctx.drawImage(gunnerimg, this.x - 25, this.y - 25);

        if (selected) {
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x - 18, this.y - 18, 36, 36);
            
            // range circle
            ctx.strokeStyle = "rgba(0,0,255,0.3)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    canShoot() {
        return this.counter === 0;
    }

    shoot(enemy) {
        gameState.bullets.push(new Bullet(this.x, this.y, enemy));
        this.counter = this.fireRate;
    }

    update() {
        if (this.counter > 0) this.counter--;
    }
}

class Tank extends Gunner {
    constructor (x, y) {
        super(x, y);
        this.level = 1;
        this.maxlevel = 1;
        this.range = 150;
        this.fireRate = 75;
        this.type = "tank";
    }
    
    draw(selected = false) {
        ctx.drawImage(tankimg, this.x - 50, this.y - 50);

    if (selected) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x - 18, this.y - 18, 36, 36);

        // range cir
        ctx.strokeStyle = "rgba(0,0,255,0.3)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.stroke();
    }
    }
    
    shoot(enemy) {
        gameState.bullets.push(new TankBullet(this.x, this.y , enemy));
        this.counter = this.fireRate;
    }
}

// Selecting a tower
const gunnerbtn = document.getElementById("gunner");
const tankbtn = document.getElementById("tank");

let sameTowerSelected = false;
let selectedTowerType = null;

function selectTowerBtn(selectedTowerBtn) {
    const selectedTowerBtns = [gunnerbtn, tankbtn];

    if (selectedTowerBtn.id === selectedTowerType && sameTowerSelected === true) { // If the tower selected is the same
        selectedTowerBtns.forEach(stBtn => {
            stBtn.style.border = "2px solid gray";
        });

        sameTowerSelected = false; 
    } else {
        selectedTowerBtns.forEach(stBtn => {
            stBtn.style.border = (stBtn === selectedTowerBtn) ? "2px solid yellow" : "2px solid gray";
            selectedTowerType = selectedTowerBtn.id;
        });

        sameTowerSelected = true;
    }
}

gunnerbtn.addEventListener("click", () => {
    selectTowerBtn(gunnerbtn);
});

tankbtn.addEventListener("click", () => {
    selectTowerBtn(tankbtn);
});

selectTowerBtn(gunnerbtn);

// Bullets
class Bullet {
    constructor(x, y, target) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.speed = 6;
        this.radius = 5;
        this.isHit = false;
    }

    move() {
        if (!this.target || this.target.isDead) {
            this.isHit = true;
            return;
        }

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.speed) {
            this.hitTarget();
        } else {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
    }

    hitTarget() {
        const damage = 2;
        const truedamage = Math.max(0, damage - this.target.def);
        this.target.hp -= truedamage;
        if (this.target.hp <= 0) {
            this.target.isDead = true;
            gameState.money += this.target.reward;
            updateMoney();
        }
        this.isHit = true;
    }

    draw() {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class TankBullet extends Bullet {
    constructor(x, y, target) {
        super(x, y, target);
        this.speed = 2;
        this.radius = 7;
        this.splashRadius = 50; // splash damage radius in pixels
    }

    hitTarget() {
        this.target.hp -= 6 - this.target.def;  
        if (this.target.hp <= 0) { this.target.isDead = true;}
        
        gameState.enemies.forEach(enemy => {
        if (enemy !== this.target) {
            const dx = enemy.x - this.target.x;
            const dy = enemy.y - this.target.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= this.splashRadius) {
                enemy.hp -= 2 - enemy.def; // splash damage = 5

            if (enemy.hp <= 0) {enemy.isDead = true;}
            }
        }
        });
    
        // Reward 
        gameState.enemies.forEach(enemy => {
        if (enemy.isDead) {
            gameState.money += enemy.reward;
        }
        });
        updateMoney();
        this.isHit = true;
    }
    
    draw() {
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Update Functions
function updateWaves() {
    waveDisplay.textContent = gameState.wave - 1 + " / " + gameState.maxwaves
}
  
function updateMoney() {
    moneyDisplay.textContent = gameState.money; 
}

function updateLevel() {
    levelDisplay.textContent = levelNumber;
}

function updateStars() {
    starDisplay.textContent = gameState.starcount
}

function updateHearts() {
    heartDisplay.textContent = gameState.currenthearts
}

// Place towers by tapping/clicking
const sellButton = document.getElementById("selltower");
let selectedTower = null;

function isPointInTower(x, y, tower) {
    return (
        x >= tower.x - 30 &&
        x <= tower.x + 30 &&
        y >= tower.y - 30 &&
        y <= tower.y + 30
    )
}

function isPointInEnemy(x, y, enemy) {
    return (
        x >= enemy.x - 30 &&
        x <= enemy.x + 30 &&
        y >= enemy.y - 30 &&
        y <= enemy.y + 30
    )
}

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    let clickedOnTower = false;
    // Check if clicked on a tower to select/sell
    for (let i = 0; i < gameState.towers.length; i++) {
        if (isPointInTower(x, y, gameState.towers[i])) {
        selectedTower = gameState.towers[i];
        clickedOnTower = true;
        
        sellButton.style.position ="absolute";
        sellButton.style.display ="block";
        sellButton.style.left = (rect.left + selectedTower.x + 20 ) + "px";
        sellButton.style.top = (rect.top + selectedTower.y + 20 ) + "px";
        
        break;
        }
    }

    for (let i = 0; i < gameState.enemies.length; i++) {
        if (isPointInEnemy(x, y, gameState.enemies[i])) {
            console.log("Enemy has been clicked");
        }
    }

    // If no tower selected, try placing a new tower
    if (!clickedOnTower) {
        sellButton.style.display = "none";
        selectedTower = null;
        if (selectedTowerType && gameState.money >= towerCosts[selectedTowerType] && sameTowerSelected === true) {
            let newTower;
            if (selectedTowerType === "gunner") newTower = new Gunner(x, y);
            else if (selectedTowerType === "tank") newTower = new Tank(x, y);
            
            gameState.towers.push(newTower);
            gameState.money -= towerCosts[selectedTowerType];
            updateMoney();
        }
    }
});

sellButton.addEventListener("click", () => {
    if (selectedTower) {
        // Refund 50% of tower cost
        const refund = Math.floor(towerCosts[selectedTower.type] * 0.5);
        gameState.money += refund;
        updateMoney();
        sellButton.style.display = "none";

        // Remove the tower
        gameState.towers = gameState.towers.filter(t => t !== selectedTower);
        selectedTower = null;
    } else {
        alert("No tower selected to sell!");
    }
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    gameState.enemies = gameState.enemies.filter(e => !e.isDead);
    gameState.enemies.forEach(enemy => {
        enemy.move();
        enemy.draw();
    });

    // Update towers, shoot enemies in range
    gameState.towers.forEach(tower => {
        tower.update(); 

        for (const enemy of gameState.enemies) {
            const dx = enemy.x - tower.x;
            const dy = enemy.y - tower.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist <= tower.range && tower.canShoot()) {
            tower.shoot(enemy);
            break; // shoot only one enemy per update
        }
        }
        tower.draw(tower === selectedTower);
    });

    // Move and draw bullets
    gameState.bullets = gameState.bullets.filter(bullet => !bullet.isHit);
    gameState.bullets.forEach(bullet => {
        bullet.move();
        bullet.draw();
    });

    frameCount++;
    requestAnimationFrame(gameLoop);

    if (gameState.gameRunning === true) {
        checkWaveCleared();
        updateWaves();
        if (gameState.currenthearts <= 0) {
            alert("Game Over :(")
            gameState.gameRunning = false;
            return;
        }
    }
}

// Hide Stuff
showScreen(titleScreen);
sellButton.style.display = "none";

// Stuff
updateMoney();
gameLoop();

export { Enemy, Sheller, Speedling, Gunner, Tank, Bullet, TankBullet };
export { updateMoney, updateLevel, updateStars, updateHearts, showScreen }
/* Version history
V1.14.4 - Shows cost and name of each node (next to node) and put description and effect when clicking on a node
V1.14.5 - Fixed a few things with node and improved quality
V1.14.6 - Now when you unlock upgrades, it says purchased :D
V1.15 - Updated path mechanics, added more paths possible
V1.15.1 - Finally added the hearts system so you can LOSE
V1.15.2 - Fixed a few displaying bugs and some other annoying bugs (around 4 or 5 total)
V1.16 - Added level 4 offically
V1.16.1 - Modified original levels and did more stuff :0
*/ 