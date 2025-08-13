// when click buttons to play, it goes to play
const buttons = document.getElementsByClassName("levelBtn");

for (let button of buttons) {
    button.addEventListener("click", () => {
        levelSelectScreen.style.display = "none";
        gameScreen.style.display = "block";
    });
}

document.getElementById("start").addEventListener("click", () => {
    titleScreen.style.display = "none";
    gameScreen.style.display = "none"
    levelSelectScreen.style.display = "block";
});

document.getElementById("back").addEventListener("click", () => {
    levelSelectScreen.style.display = "none";
    gameScreen.style.display = "none"
    titleScreen.style.display = "block";
});


//displays

let level = 1
window.updateLevel = function() {
    levelDisplay.textContent = level;
}




// Exports
export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");

export const titleScreen = document.getElementById("titlepage");
export const levelSelectScreen = document.getElementById("levelSelect");
export const gameScreen = document.getElementById("playing");

export const moneyDisplay = document.getElementById("money");
export const waveDisplay = document.getElementById("wave");
export const levelDisplay = document.getElementById("level");


export let frameCount = 0;

export const gameState = {
    wave: 1,
    money: 100,
    enemies: [],
    towers: [],
    bullets : [],
    path: [],
}

import { checkWaveCleared } from "./Levelselect.js"

// Tower costs

const TOWER_COSTS = {
    gunner: 50,
    tank: 150
}

// Images
const gunnerimg = document.getElementById("gunnerimg");
gunnerimg.src = "images/gunner.png";

const tankimg = document.getElementById("tankimg");
tankimg.src = "images/tank.png"


const swarmerimg = document.getElementById("swarmerimg");
swarmerimg.src = "images/swarmer.png"

const shelldrakimg = document.getElementById("shelldrakimg");
shelldrakimg.src = "images/shelldrak.png"

const speedlingimg = document.getElementById("speedlingimg");
speedlingimg.src = "images/speedling.png"

gunnerimg.style.display = "none";
tankimg.style.display = "none";
swarmerimg.style.display = "none";
shelldrakimg.style.display = "none";
speedlingimg.style.display = "none";




// Enemies
class Enemy {
    constructor() {
        this.speed = 1;
        this.hp = 10;
        this.maxHp = 10;
        this.def = 0;
        this.radius = 12;
        this.pathIndex = 0;
        this.x = gameState.path[0].x;
        this.y = gameState.path[0].y;
        this.isDead = false;
        this.reward = 10;
    }

    move() {
        if (this.pathIndex >= gameState.path.length - 1) return;
            const target = gameState.path[this.pathIndex + 1];
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.speed) {
            this.x = target.x;
            this.y = target.y;
            this.pathIndex++;
        
        if (this.pathIndex >= gameState.path.length - 1) {
        // add lives going down there
            this.IsDead = true;
        
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
        this.speed = 0.3;
        this.hp = 20;
        this.maxHp = 20;
        this.def = 1;
        this.radius = 20;
        this.pathIndex = 0;
        this.x = gameState.path[0].x;
        this.y = gameState.path[0].y;
        this.isDead = false;
        this.reward = 20;
    }
        draw() {
            ctx.drawImage(shelldrakimg, this.x - 50, this.y - 50)
            this.drawHealthBar()
    }
    
}

class Speedling extends Enemy {
    constructor() {
        super();
        this.speed = 1.5;
        this.hp = 8;
        this.maxHp = 8;
        this.def = 0;
        this.radius = 10;
        this.pathIndex = 0;
        this.x = gameState.path[0].x;
        this.y = gameState.path[0].y;
        this.isDead = false;
        this.reward = 15;
    }
    draw() {
        ctx.drawImage(speedlingimg, this.x - 25, this.y - 25)
        this.drawHealthBar()
    }
    
}

// towers
class Gunner {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 100;
        this.fireRate = 30; // frames between shots
        this.counter = 0;
        this.type = "gunner"
    }

    draw(selected = false) {
        ctx.drawImage(gunnerimg, this.x - 25, this.y - 25)

    if (selected) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x - 18, this.y - 18, 36, 36);
    }

    // range circle
        ctx.strokeStyle = "rgba(0,0,255,0.3)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.stroke();
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
        this.range = 150;
        this.fireRate = 75;
        this.type = "tank";
    }
    
    draw(selected = false) {
        ctx.drawImage(tankimg, this.x - 50, this.y - 50)

    if (selected) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x - 18, this.y - 18, 36, 36);
    }

    // range cir
        ctx.strokeStyle = "rgba(0,0,255,0.3)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    shoot(enemy) {
        gameState.bullets.push(new TankBullet(this.x, this.y , enemy));
        this.counter = this.fireRate;
    }
}

let selectedTowerType = null
document.getElementById("gunner").addEventListener("click", () => {
    selectedTowerType = "gunner"
});

document.getElementById("tank").addEventListener("click", () => {
    selectedTowerType = "tank"
});

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
        this.splashRadius = 30; // splash damage radius in pixels
    }

    hitTarget() {
        this.target.hp -= 6 - this.target.def;  
        if (this.target.hp <= 0) this.target.isDead = true;
        
        gameState.enemies.forEach(enemy => {
        if (enemy !== this.target) {
            const dx = enemy.x - this.target.x;
            const dy = enemy.y - this.target.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= this.splashRadius) {
            enemy.hp -= 2 - enemy.def; // splash damage = 5
            if (enemy.hp <= 0) enemy.isDead = true;
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


function updateWaves() {
    waveDisplay.textContent = gameState.wave - 1;
}
  
function updateMoney() {
    moneyDisplay.textContent = gameState.money;
}


// Place towers by tapping/clicking

let selectedTower = null;

function isPointInTower(x, y, tower) {
    return (
        x >= tower.x - 15 &&
        x <= tower.x + 15 &&
        y >= tower.y - 15 &&
        y <= tower.y + 15
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
        
        sellButton.style.position ="absolute"
        sellButton.style.display ="block"
        sellButton.style.left = (rect.left + selectedTower.x + 20 ) + "px";
        sellButton.style.top = (rect.top + selectedTower.y + 20 ) + "px";
        
        
        break;
        }
    }

    // If no tower selected, try placing a new tower
    if (!clickedOnTower) {
        sellButton.style.display = "none";
        selectedTower = null;
        if (selectedTowerType && gameState.money >= TOWER_COSTS[selectedTowerType]) {
        let newTower;
        if (selectedTowerType === "gunner") newTower = new Gunner(x, y);
        else if (selectedTowerType === "tank") newTower = new Tank(x, y);
        
        gameState.towers.push(newTower);
        gameState.money -= TOWER_COSTS[selectedTowerType];
        updateMoney();
        } else {
        alert("Not enough money or no tower selected!");
        }
    }
});

const sellButton = document.getElementById("selltower");

sellButton.addEventListener("click", () => {
    if (selectedTower) {
        // Refund 50% of tower cost
        const refund = Math.floor(TOWER_COSTS[selectedTower.type] * 0.5);
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
    updateWaves();
    checkWaveCleared();
}

// Hide Stuff
gameScreen.style.display = "none"
levelSelectScreen.style.display = "none";


// Stuff
updateMoney();
gameLoop();

export { Enemy, Sheller, Speedling, Gunner, Tank, Bullet, TankBullet };

/* Version history
V1.11.5 - Instead of drawing the sprites, I added images
V1.11.6 - Balancing changes + changed file to module
V1.11.7 - Fixed a few errors that have stuck with me for awhile (checkwave and pathing errors)
V1.11.8 - Fixed tower error and optimized code
*/
