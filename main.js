const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const moneyDisplay = document.getElementById("money");

const PATH = [  // simple path points enemies follow (x,y)
  { x: 0, y: 180 },
  { x: 600, y: 180 },
];

let money = 100;
const TOWER_COST = 50;

// Draw the path line


class Enemy {
  constructor() {
    this.speed = 1;
    this.hp = 10;
    this.maxHp = 10;
    this.def = 0;
    this.radius = 12;
    this.pathIndex = 0;
    this.x = PATH[0].x;
    this.y = PATH[0].y;
    this.isDead = false;
    this.reward = 10;
  }

  move() {
    if (this.pathIndex >= PATH.length - 1) return;

    const target = PATH[this.pathIndex + 1];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.speed) {
      this.x = target.x;
      this.y = target.y;
      this.pathIndex++;
    } else {
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
    }
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Health bar
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
    this.x = PATH[0].x;
    this.y = PATH[0].y;
    this.isDead = false;
    this.reward = 20;
  }
    draw() {
    ctx.fillStyle = "purple";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Health bar
    ctx.fillStyle = "black";
    ctx.fillRect(this.x - 15, this.y - 20, 30, 5);
    ctx.fillStyle = "lime";
    ctx.fillRect(this.x - 15, this.y - 20, (this.hp / this.maxHp) * 30, 5);
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
    this.x = PATH[0].x;
    this.y = PATH[0].y;
    this.isDead = false;
    this.reward = 15;
  }
  
}

class Tower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.range = 100;
    this.fireRate = 30; // frames between shots
    this.counter = 0;
  }

  draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x - 15, this.y - 15, 30, 30);

    // Optional: draw range circle
    ctx.strokeStyle = "rgba(0,0,255,0.3)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();
  }

  canShoot() {
    return this.counter === 0;
  }

  shoot(enemy) {
    bullets.push(new Bullet(this.x, this.y, enemy));
    this.counter = this.fireRate;
  }

  update() {
    if (this.counter > 0) this.counter--;
  }
}

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
    this.target.hp -= damage - this.target.def;
    if (this.target.hp <= 0) {
      this.target.isDead = true;
      money += this.target.reward;
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

let enemies = [];
let towers = [];
let bullets = [];
let timer = 0;

setInterval(() =>  {
  timer+=1;
}, 1000);

function spawnEnemy() {
  enemies.push(new Enemy());
  if (timer>=5) {
    enemies.push(new Sheller());
  };
  if (timer>=10)
    enemies.push(new Speedling());
};

  setInterval(() =>  {
    spawnEnemy();
  }, 2000);
  
function updateMoney() {
  moneyDisplay.textContent = money;
}

// Place towers by tapping/clicking
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (money >= TOWER_COST) {
    towers.push(new Tower(x, y));
    money -= TOWER_COST;
    updateMoney();
  } else {
    alert("Not enough money for a tower!");
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'brown';
  ctx.lineWidth = 30;
  ctx.beginPath();
  ctx.moveTo(PATH[0].x, PATH[0].y);
  ctx.lineTo(PATH[1].x, PATH[1].y);
  ctx.stroke();
  ctx.lineWidth = 1;
  // Spawn enemies every 120 frames (~2 seconds at 60fps)
  // Move and draw enemies
  enemies = enemies.filter(e => !e.isDead);
  enemies.forEach(enemy => {
    enemy.move();
    enemy.draw();
  });

  // Update towers, shoot enemies in range
  towers.forEach(tower => {
    tower.update();

    for (const enemy of enemies) {
      const dx = enemy.x - tower.x;
      const dy = enemy.y - tower.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= tower.range && tower.canShoot()) {
        tower.shoot(enemy);
        break; // shoot only one enemy per update
      }
    }

    tower.draw();
  });

  // Move and draw bullets
  bullets = bullets.filter(bullet => !bullet.isHit);
  bullets.forEach(bullet => {
    bullet.move();
    bullet.draw();
  });


  frameCount++;
  requestAnimationFrame(gameLoop);
}

let frameCount = 0;
updateMoney();
gameLoop();

