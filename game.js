const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const c = canvas.getContext("2d");

//global variables

let score = 0;
let projSpeed = 13;
let projSize = 10;
let enemySpawnChance = 70;
let enemySpeed = 6;
let playerSpeed = 4;
let particleSpeed = 23;
let entityArr = [];
let enemyArr = [];
let particleArr = [];
let powerUpEnemyArr = [];
let powerUpArr = [];
let ambientParticleArr = [];
let ambientParticleSpeed = 3;
let particleDecay = 0.9;
let particleAge = 30;
let gameOver = false;
let enemySizeMin = 15;
let enemySizeMax = 45;
let playerSize = 10;
let playerCol = "rgb(255, 255, 255)";
let playerStroke = "rgb(0, 255, 255)";
let powerUpDurration = 350;
let powerUpSpeed = 7;
let projectileCol = "rgba(0, 255, 255, 0.5)";
let projectileStroke = "rgba(0, 255, 255, 0.5)";

let rapidFire = false;
let invincibleProjectiles = false;
const powerUpTypeArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

//colission detection function

const colisionDetect = (x1, y1, r1, x2, y2, r2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) - (r1 + r2);
};

//event listeners for resize and clicking

window.addEventListener("resize", function () {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});
window.addEventListener("click", function (event) {
  let mouseX = event.clientX;
  let mouseY = event.clientY;
  let a = mouseX - player.x;
  let b = mouseY - player.y;
  let c = Math.atan2(a, b);
  let dx = Math.sin(c) * projSpeed;
  let dy = Math.cos(c) * projSpeed;
  player.shoot(dx, dy);
});

//particle function

const spawnParticles = (x, y, col, itterations) => {
  for (let m = 0; m <= itterations; m++) {
    let r = Math.floor(Math.random() * 4);
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2, false);
    c.fillStyle = col;
    c.fill();
    let dx = (Math.random() - 0.5) * particleSpeed;
    let dy = (Math.random() - 0.5) * particleSpeed;
    particleArr.push(new Particle(x, y, r, col, dx, dy));
  }
};

//projectile class

class Projectile {
  constructor(x, y, r, dx, dy) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.dx = dx;
    this.dy = dy;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.strokeStyle = projectileStroke;
    c.fillStyle = projectileCol;
    c.lineWidth = 4;
    c.stroke();
    c.fill();
  }
  update(i) {
    this.i = i;
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
    if (
      this.x - this.r > window.innerWidth ||
      this.x + this.r < 0 ||
      this.y - this.r > window.innerHeight ||
      this.y + this.r < 0
    ) {
      entityArr.splice(this.i, 1);
    }
    for (let l = enemyArr.length - 1; l >= 0; l--) {
      let projEnemyDist = colisionDetect(
        this.x,
        this.y,
        this.r,
        enemyArr[l].x,
        enemyArr[l].y,
        enemyArr[l].r
      );
      if (projEnemyDist <= 0) {
        spawnParticles(this.x, this.y, projectileCol, 3);
        enemyArr[l].shrink(this.r);
        if (invincibleProjectiles === false) {
          entityArr.splice(this.i, 1);
        }
      }
    }
    for (let l = powerUpEnemyArr.length - 1; l >= 0; l--) {
      let projEnemyDist = colisionDetect(
        this.x,
        this.y,
        this.r,
        powerUpEnemyArr[l].x,
        powerUpEnemyArr[l].y,
        powerUpEnemyArr[l].r
      );
      if (projEnemyDist <= 0) {
        spawnParticles(this.x, this.y, projectileCol, 3);
        powerUpEnemyArr[l].shrink(this.r);
        if (invincibleProjectiles === false) {
          entityArr.splice(this.i, 1);
        }
      }
    }
  }
}

//player object

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: playerSize,
  dx: 0,
  dy: 0,
  damage: playerSize,
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = playerCol;
    c.strokeStyle = playerStroke;
    c.lineWidth = 3;
    c.stroke();
    c.fill();
  },
  shoot(dx, dy) {
    c.beginPath();
    c.arc(this.x, this.y, projSize, 0, Math.PI * 2, false);
    c.fillStyle = projectileCol;
    c.fill();
    entityArr.push(new Projectile(this.x, this.y, projSize, dx, dy));
  },
  update() {
    this.draw();
    this.x += this.dx;
    this.y += this.dy;
    for (let k = enemyArr.length - 1; k >= 0; k--) {
      if (
        colisionDetect(
          this.x,
          this.y,
          this.r,
          enemyArr[k].x,
          enemyArr[k].y,
          enemyArr[k].r
        ) <= 0
      ) {
        spawnParticles(enemyArr[k].x, enemyArr[k].y, enemyArr[k].col, 12);
        enemyArr.splice(k, 1);
        this.damage -= 10;
      }
    }
    for (let k = powerUpEnemyArr.length - 1; k >= 0; k--) {
      if (
        colisionDetect(
          this.x,
          this.y,
          this.r,
          powerUpEnemyArr[k].x,
          powerUpEnemyArr[k].y,
          powerUpEnemyArr[k].r
        ) <= 0
      ) {
        spawnParticles(
          powerUpEnemyArr[k].x,
          powerUpEnemyArr[k].y,
          powerUpEnemyArr[k].col,
          12
        );
        powerUpEnemyArr.splice(k, 1);
        this.damage -= 10;
      }
    }
    if (this.damage < this.r) {
      this.r -= 1;
      spawnParticles(this.x, this.y, this.playerCol, 1);
    }
    if (this.r < 5) {
      gameOver = true;
    }
    if (this.x + this.r <= 0) {
      this.x = window.innerWidth + (this.r - 1);
    } else if (this.x - this.r >= window.innerWidth) {
      this.x = 0 - (this.r - 1);
    } else if (this.y + this.r <= 0) {
      this.y = window.innerHeight + (this.r - 1);
    } else if (this.y - this.r >= window.innerHeight) {
      this.y = 0 - (this.r - 1);
    }
  },
};

//direction functions

let dKey = "";
let sKey = "";
let aKey = "";
let wKey = "";
addEventListener("keydown", function (event) {
  if (event.key === "w") {
    player.dy = -playerSpeed;
    wKey = true;
  } else if (event.key === "a") {
    player.dx = -playerSpeed;
    aKey = true;
  } else if (event.key === "s") {
    player.dy = playerSpeed;
    sKey = true;
  } else if (event.key === "d") {
    player.dx = playerSpeed;
    dKey = true;
  }
});

addEventListener("keyup", function (event) {
  if (event.key === "w" && sKey == false) {
    player.dy = 0;
    wKey = false;
  } else if (event.key === "a" && dKey == false) {
    player.dx = 0;
    aKey = false;
  } else if (event.key === "s" && wKey == false) {
    player.dy = 0;
    sKey = false;
  } else if (event.key === "d" && aKey == false) {
    player.dx = 0;
    dKey = false;
  } else if (event.key === "w") {
    player.dy = playerSpeed;
    wKey = false;
  } else if (event.key === "a") {
    player.dx = playerSpeed;
    aKey = false;
  } else if (event.key === "s") {
    player.dy = -playerSpeed;
    sKey = false;
  } else if (event.key === "d") {
    player.dx = -playerSpeed;
    dKey = false;
  }
});

//particle class

class Particle {
  constructor(x, y, r, col, dx, dy) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.col = col;
    this.dx = dx;
    this.dy = dy;
    this.age = 0;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = this.col;
    c.fill();
  }
  update(i) {
    this.i = i;
    this.draw();
    this.x += this.dx;
    this.y += this.dy;
    this.age += 1;
    this.dx *= particleDecay;
    this.dy *= particleDecay;
    if (this.age >= particleAge) {
      particleArr.splice(this.i, 1);
    }
  }
}

//enemy class

class Enemy {
  constructor(x, y, r, col) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.col = col;
    this.damage = r;
    this.originalX = x;
    this.originalY = y;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = this.col;
    c.fill();
  }
  shrink(damage) {
    this.damage -= damage;
  }
  update(i) {
    this.i = i;
    if (this.originalX === 0) {
      this.dx = enemySpeed;
      this.dy = 0;
    } else if (this.originalX === window.innerWidth) {
      this.dx = enemySpeed * -1;
      this.dy = 0;
    } else if (this.originalY === 0) {
      this.dy = enemySpeed;
      this.dx = 0;
    } else if (this.originalY === window.innerHeight) {
      this.dy = enemySpeed * -1;
      this.dx = 0;
    }
    this.x += this.dx;
    this.y += this.dy;
    this.draw();

    if (
      this.y + 200 < 0 ||
      this.y - 200 > window.innerHeight ||
      this.x + 200 < 0 ||
      this.x - 200 > window.innerWidth
    ) {
      enemyArr.splice(this.i, 1);
    }
    if (this.r > this.damage) {
      this.r -= 2;
      score += 2;
    }
    if (this.r <= 10) {
      enemyArr.splice(this.i, 1);
      spawnParticles(this.x, this.y, this.col, 20);
      player.r += 1;
      player.damage += 1;
      score += Math.floor(player.r / 5);
    }
  }
}

//enemy creation function

const createEnemy = () => {
  let k = Math.floor(Math.random() * enemySpawnChance);
  if (k == 0) {
    let enemyCol = "";
    let randIndex = Math.floor(Math.random() * 2);
    if (randIndex == 0) {
      enemyCol = "red";
    } else if (randIndex == 1) {
      enemyCol = "blue";
    }
    if (enemyCol === "blue") {
      let r =
        Math.floor(Math.random() * (enemySizeMax - enemySizeMin)) +
        enemySizeMin;
      let x = Math.random() * window.innerWidth;
      let y = Math.floor(Math.random() * 2) * window.innerHeight;
      enemyArr.push(new Enemy(x, y, r, enemyCol));
    } else if (enemyCol === "red") {
      let r =
        Math.floor(Math.random() * (enemySizeMax - enemySizeMin)) +
        enemySizeMin;
      let y = Math.random() * window.innerHeight;
      let x = Math.floor(Math.random() * 2) * window.innerWidth;
      enemyArr.push(new Enemy(x, y, r, enemyCol));
    }
  } else if (k == 1) {
    let m = Math.floor(Math.random() * 40);
    if (m <= powerUpTypeArr.length - 1) {
      let r =
        Math.floor(Math.random() * (enemySizeMax - enemySizeMin)) +
        enemySizeMin;
      let x = Math.random() * window.innerWidth;
      let y = Math.floor(Math.random() * 2) * window.innerHeight;
      powerUpEnemyArr.push(new PowerUpEnemy(x, y, r, m));
    }
  }
};

//power up/ power up enemy classes

class PowerUpEnemy {
  constructor(x, y, r, type) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.type = type;
    this.damage = r;
  }
  determineDirection() {
    let a = this.x - player.x;
    let b = this.y - player.y;
    let num = Math.atan2(a, b);
    this.dx = Math.sin(num) * powerUpSpeed;
    this.dy = Math.cos(num) * powerUpSpeed;
  }
  draw() {
    if (this.type <= 4) {
      this.col = "rgb(255, 255,255)";
    } else {
      this.col = "rgb(0,0,0)";
    }
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.strokeStyle = "rgb(206, 245, 66)";
    c.lineWidth = 10;
    c.fillStyle = this.col;
    c.stroke();
    c.fill();
  }
  shrink(damage) {
    this.damage -= damage;
  }
  update(i) {
    this.i = i;
    if (this.type <= 7) {
      this.r++;
    }
    this.determineDirection();
    this.x -= this.dx;
    this.y -= this.dy;
    this.draw();

    if (
      this.y + 200 < 0 ||
      this.y - 200 > window.innerHeight ||
      this.x + 200 < 0 ||
      this.x - 200 > window.innerWidth
    ) {
      enemyPowerUpArr.splice(this.i, 1);
    }
    if (this.r > this.damage) {
      this.r -= 2;
      score += 2;
    }
    if (this.r <= 10) {
      powerUpEnemyArr.splice(this.i, 1);
      powerUpArr.push(new PowerUp(this.type));
      spawnParticles(this.x, this.y, "rgb(206, 245, 66)", 20);
      player.r += 1;
      player.damage += 1;
      score += Math.floor(player.r / 5);
    }
  }
}

class PowerUp {
  constructor(type) {
    this.type = type;
    this.age = 0;
  }
  run() {
    if (this.type === 0) {
      projSize = 30;
      this.age++;
    } else if (this.type === 1) {
      playerSpeed = 8;
      playerStroke = "rgb(16, 45, 148)";
      playerCol = "rgb(0,0,0)";
      this.age++;
    } else if (this.type === 2) {
      rapidFire = true;
      this.age++;
    } else if (this.type === 3) {
      invincibleProjectiles = true;
      projectileCol = "rgb(206, 245, 66)";
      this.age++;
    } else if (this.type == 4) {
      projSpeed = 20;
      projectileCol = "rgb(0,0,0)";
      projectileStroke = "rgb(16, 45, 148)";
      this.age++;
    }
  }
  add() {
    powerUpArr.push(this.type);
  }
  update(i) {
    this.i = i;
    if (this.age <= powerUpDurration) {
      this.run();
    } else {
      if (this.type == 0) {
        projSize = 10;
      } else if (this.type == 1) {
        playerSpeed = 3;
        playerCol = "rgb(255, 255, 255)";
        playerStroke = "rgb(0, 255, 255)";
      } else if (this.type == 2) {
        rapidFire = false;
      } else if (this.type == 3) {
        invincibleProjectiles = false;
        projectileCol = "rgb(0, 255, 255)";
      } else if (this.type == 4) {
        projSpeed = 13;
        projectileCol = "rgba(0, 255, 255, 0.5)";
        projectileStroke = "rgba(0, 255, 255, 0.5)";
      }
      powerUpArr.splice(this.i, 1);
    }
  }
}

//ambient visuals

class AmbientParticle {
  constructor(dx, dy) {
    this.dx = dx;
    this.dy = dy;
    this.x = window.innerWidth / 2 + dx * 20;
    this.y = window.innerHeight / 2 + dy * 20;
    this.r = 1;
    this.col = "rgba(255, 255, 255, .8)";
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = this.col;
    c.fill();
  }
  update(i) {
    this.i = i;
    this.dx *= 1.001;
    this.dy *= 1.001;
    this.r *= 1.01;
    this.dx *= 1 + this.r / 150;
    this.dy *= 1 + this.r / 150;
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
    if (
      this.y + 200 < 0 ||
      this.y - 200 > window.innerHeight ||
      this.x + 200 < 0 ||
      this.x - 200 > window.innerWidth
    ) {
      ambientParticleArr.splice(this.i, 1);
    }
  }
}

const ambientBackground = () => {
  let randIndex = Math.floor(Math.random() * 2);
  if (randIndex == 0) {
    ambientParticleArr.push(
      new AmbientParticle(
        (Math.random() - 0.5) * ambientParticleSpeed,
        (Math.random() - 0.5) * ambientParticleSpeed
      )
    );
  }
};

//game function

const runFrame = () => {
  if (gameOver == false) {
    ambientBackground();
    c.fillStyle = "rgba(0, 0, 0, 0.5)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    createEnemy();
    player.update();
    let scoreDisplay = document.querySelector("#scoreDisplay");
    console.log(ambientParticleArr.length);
    scoreDisplay.innerHTML = score;
    for (let i = ambientParticleArr.length - 1; i >= 0; i--) {
      ambientParticleArr[i].update(i);
    }
    for (let i = entityArr.length - 1; i >= 0; i--) {
      entityArr[i].update(i);
    }
    for (let i = enemyArr.length - 1; i >= 0; i--) {
      enemyArr[i].update(i);
    }
    for (let i = particleArr.length - 1; i >= 0; i--) {
      particleArr[i].update(i);
    }
    for (let i = powerUpArr.length - 1; i >= 0; i--) {
      powerUpArr[i].update(i);
    }
    for (let i = powerUpEnemyArr.length - 1; i >= 0; i--) {
      powerUpEnemyArr[i].update(i);
    }

    if (rapidFire === true) {
      let randomX = (Math.random() - 0.5) * projSpeed;
      let randomY = (Math.random() - 0.5) * projSpeed;
      player.shoot(randomX, randomY);
    }
  }
};

//animation function

/*const animate = () => {
  requestAnimationFrame(animate);
  runFrame();
};
animate();*/
const animate = () => {
  setInterval(function () {
    runFrame();
  }, 20);
};
animate();
