const canvas = document.getElementById("myCanvas");
const gameElement = document.getElementById("game");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const c = canvas.getContext("2d");

//global variables
let red = "rgb(255, 3, 3)";
let redLowAlpha = "rgba(255, 3, 3, .5)";
let yellow = "rgb(206, 245, 66)";
let yellowMidAlpha = "rgba(206, 245, 66, .5)";
let yellowLowAlpha = "rgba(206, 245, 66, .05)";
let magenta = "rgb(235, 33, 134)";
let magentaMidAlpha = "rgba(235, 33, 134, .5)";
let magentaLowAlpha = "rgba(235, 33, 134, .1)";
let white = "rgb(255, 255, 255)";
let whiteMidAlpha = "rgba(255,255,255, .5)";
let whiteLowAlpha = "rgba(255, 255, 255, .05)";
let neonBlue = "rgb(0, 255, 255)";
let neonBlueLowAlpha = "rgba(0, 255, 255, .2)";
let neonGreen = "rgb(0, 252, 38)";
let neonGreenLowAlpha = "rgba(0, 252, 38, .05)";
let blackNoAlpha = "rgba(0,0,0,0)";

let score = 0;
let projSpeed = 13;
let projSize = 10;
let enemySpawnChance = 70;
let powerUpSpawnChance = 140;
let enemySpeed = 5;
let playerSpeed = 5;
let particleSpeed = 23;
let entityArr = [];
let enemyArr = [];
let powerUpArr = [];
let particleArr = [];
let ambientParticleArr = [];
let ambientParticleSpeed = 1.5;
let particleDecay = 0.9;
let particleAge = 30;
let particleSize = 4;
let gameOver = false;
let enemySizeMin = 15;
let enemySizeMax = 45;
let playerSize = 20;
let playerCol = whiteMidAlpha;
let playerStroke = white;
let powerUpDurration = 350;
let powerUpSpeed = 5;
let waveIndex = 0;
let numberOfWaves = 0;
let mouseDownIndex = 0;
let autoFireIndex = 12;
let mouseClientX = 0;
let mouseClientY = 0;
let mouseIsDown = false;
let shouldRunWave = false;
let projectileCol = neonBlueLowAlpha;
let projectileStroke = neonBlue;
let ambientParticleColor = whiteMidAlpha;
let powerUpSpawnIndex = 0;
let rapidFire = false;
let invincibleProjectiles = false;
let homingProjectiles = false;
let projectileHomingIndex = 0;
let doubleProjectiles = false;
let bossIsActive = false;
let powerUpTypeArr = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let bossTypeArr = [0, 1, 2, 3];
let tempArr = [];
let runWaveIndex = 0;
let shouldRunWaveMessage1 = false;
let shouldRunWaveMessage2 = false;
let shouldAnimate = false;
let shouldRunStartGameMessage = true;
let startGameFrameIndex = 0;
let fullScreen = false;

//colission detection function

const colisionDetect = (x1, y1, r1, x2, y2, r2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) - (r1 + r2);
};

// distance formula

const determineClosestObject = (x1, y1, array) => {
  tempArr = [];
  for (let i = 0; i < array.length; i++) {
    tempArr.push(Math.pow(array[i].x - x1, 2) + Math.pow(array[i].y - y1, 2));
  }
  if (tempArr.indexOf(Math.min(...tempArr)) == -1) {
    console.log(enemyArr);
    console.log(tempArr);
    console.log(Math.min(...tempArr));
    console.log(tempArr.indexOf(Math.min(...tempArr)));
  }
  return tempArr.indexOf(Math.min(...tempArr));
};

//event listeners for resize and clicking

const autoFire = (x, y) => {
  if (mouseIsDown) {
    let mouseX = x;
    let mouseY = y;
    let a = mouseX - player.x;
    let b = mouseY - player.y;
    let c = Math.atan2(a, b);
    let dx = Math.sin(c) * projSpeed;
    let dy = Math.cos(c) * projSpeed;
    player.shoot(dx, dy);
    if (doubleProjectiles) {
      player.shoot(-dx, -dy);
    }
    mouseDownIndex = 0;
  }
};
window.addEventListener("resize", function () {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});
window.addEventListener("mousedown", function (event) {
  if (shouldAnimate) {
    mouseIsDown = true;
    mouseDownIndex = 0;
    mouseClientX = event.clientX;
    mouseClientY = event.clientY;
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    let a = mouseX - player.x;
    let b = mouseY - player.y;
    let c = Math.atan2(a, b);
    let dx = Math.sin(c) * projSpeed;
    let dy = Math.cos(c) * projSpeed;
    player.shoot(dx, dy);
    if (doubleProjectiles) {
      player.shoot(-dx, -dy);
    }
  }
});
addEventListener("mousemove", function (event) {
  mouseClientX = event.clientX;
  mouseClientY = event.clientY;
});
addEventListener("mouseup", function (event) {
  mouseDownIndex = 0;
  mouseIsDown = false;
});
addEventListener("keydown", function (event) {
  if (event.key === "b") {
    enemyArr.push(new Boss(2));
    bossIsActive = true;
  }
});
addEventListener("keydown", function (event) {
  if (event.key === " ") {
    if (shouldAnimate && gameOver !== true) {
      shouldAnimate = false;
    } else if (gameOver == true) {
      score = 0;
      projSpeed = 13;
      projSize = 10;
      enemySpawnChance = 70;
      powerUpSpawnChance = 140;
      enemySpeed = 6;
      playerSpeed = 5;
      entityArr = [];
      enemyArr = [];
      powerUpArr = [];
      particleArr = [];
      ambientParticleArr = [];
      gameOver = false;
      enemySizeMin = 15;
      enemySizeMax = 45;
      playerSize = 20;
      playerCol = whiteMidAlpha;
      playerStroke = white;
      powerUpSpeed = 7;
      waveIndex = 0;
      numberOfWaves = 0;
      mouseDownIndex = 0;
      autoFireIndex = 12;
      mouseIsDown = false;
      shouldRunWave = false;
      projectileCol = neonBlueLowAlpha;
      projectileStroke = neonBlue;
      ambientParticleColor = whiteMidAlpha;
      rapidFire = false;
      invincibleProjectiles = false;
      homingProjectiles = false;
      projectileHomingIndex = 0;
      doubleProjectiles = false;
      bossIsActive = false;
      runWaveIndex = 0;
      shouldRunWaveMessage1 = false;
      shouldRunWaveMessage2 = false;
      shouldAnimate = false;
      shouldRunStartGameMessage = true;
      startGameFrameIndex = 0;
      player.hp = playerSize;
      player.damage = playerSize;
      player.x = window.innerWidth / 2;
      player.y = window.innerHeight / 2;
    } else if (shouldRunStartGameMessage) {
      shouldRunStartGameMessage = false;
      shouldAnimate = true;
      enemyArr = [];
    } else {
      shouldAnimate = true;
    }
  }
});
addEventListener("keydown", function (event) {
  if (event.key === "f" && fullScreen == false) {
    gameElement.requestFullscreen();
    fullScreen = true;
  } else if (event.key === "f") {
    document.exitFullscreen();
    fullScreen = false;
  }
});

//particle function

const spawnParticles = (x, y, col, itterations) => {
  if (itterations >= -1) {
    for (let m = 0; m <= itterations; m++) {
      let r = Math.floor(Math.random() * particleSize);
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2, false);
      c.fillStyle = col;
      c.fill();
      let dx = (Math.random() - 0.5) * particleSpeed;
      let dy = (Math.random() - 0.5) * particleSpeed;
      if (dx < -0.3 * particleSpeed || dx > 0.3 * particleSpeed) {
        if (dy < -0.3 * particleSpeed || dy > 0.3 * particleSpeed) {
          dx /= 2;
          dy /= 2;
        }
      }
      particleArr.push(new Particle(x, y, r, col, dx, dy));
    }
  } else {
    c.fillStyle = white;
    c.font = "20px Impact";
    c.textAlign = "center";
    c.fillText(itterations.toString(), x, y);
    r = itterations;
    particleArr.push(new Particle(x, y, r, col, 0, -particleSpeed / 2));
  }
};

//projectile class

class Projectile {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.r = projSize + player.damage / 8;
    this.dx = dx;
    this.dy = dy;
    this.age = 0;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.strokeStyle = projectileStroke;
    c.fillStyle = projectileCol;
    c.lineWidth = 5;
    c.stroke();
    c.fill();
  }
  determineDirection() {
    projectileHomingIndex = determineClosestObject(this.x, this.y, enemyArr);
    if (projectileHomingIndex >= 0) {
      let num = Math.atan2(
        this.x - enemyArr[projectileHomingIndex].x,
        this.y - enemyArr[projectileHomingIndex].y
      );
      this.dx = Math.sin(num) * projSpeed * -1;
      this.dy = Math.cos(num) * projSpeed * -1;
    }
  }
  update(i) {
    if (homingProjectiles == true && this.age > 20 && enemyArr.length >= 0) {
      this.determineDirection();
    }
    this.i = i;
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
    this.age++;
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
        if (invincibleProjectiles !== true) {
          spawnParticles(this.x, this.y, projectileStroke, 3);
          entityArr.splice(this.i, 1);
        }
        enemyArr[l].shrink(this.r);
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
  hp: playerSize,
  damage: playerSize,
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = playerCol;
    c.strokeStyle = playerStroke;
    c.lineWidth = this.r / 4;
    c.stroke();
    c.fill();
    c.fillStyle = "rgba(0, 0, 0, 1)";
    c.font = "17px Arial";
    c.textAlign = "center";
    c.fillText(this.hp.toString(), this.x, this.y + 5);
  },
  shoot(dx, dy) {
    c.beginPath();
    c.arc(this.x, this.y, projSize, 0, Math.PI * 2, false);
    c.fillStyle = projectileCol;
    c.fill();
    entityArr.push(new Projectile(this.x, this.y, dx, dy));
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
        ) <= 0 &&
        enemyArr[k].isBoss !== true
      ) {
        spawnParticles(enemyArr[k].x, enemyArr[k].y, enemyArr[k].col, 12);
        this.damage -= enemyArr[k].r / 2;
        enemyArr.splice(k, 1);
      }
    }
    if (this.damage < this.hp) {
      this.hp -= 1;
      spawnParticles(this.x, this.y, playerCol, 1);
    }
    if (this.hp < 1) {
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
    if (this.r >= -1) {
      c.beginPath();
      c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      c.fillStyle = this.col;
      c.fill();
    } else {
      c.fillStyle = white;
      c.font = "40px Impact";
      c.textAlign = "center";
      c.fillText(this.r.toString(), this.x, this.y);
    }
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
    if (
      this.originalX !== 0 &&
      this.originalX !== window.innerWidth &&
      this.originalY !== 0 &&
      this.originalY !== window.innerHeight
    ) {
      if (this.col == neonGreen) {
        this.dy = enemySpeed * 2;
        this.dx = 0;
      } else if (this.col == magenta) {
        this.dx = enemySpeed * 2;
        this.dy = 0;
      } else if (this.col == white) {
        let a = this.x - player.x;
        let b = this.y - player.y;
        let num = Math.atan2(a, b);
        this.dx = -Math.sin(num) * powerUpSpeed * 1.5;
        this.dy = -Math.cos(num) * powerUpSpeed * 1.5;
      }
    }
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
      player.hp += 1;
      player.damage += 1;
      runWaveIndex++;
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
  }

  // powerup enemy

  let n = Math.floor(Math.random() * powerUpSpawnChance);
  if (n == 1) {
    let m = Math.floor((Math.random() * powerUpSpawnChance) / 4);
    enemyArr.push(
      new PowerUpEnemy(
        Math.floor(Math.random() * 2) * window.innerWidth,
        Math.random() * window.innerHeight,
        Math.floor(Math.random() * (enemySizeMax - enemySizeMin)) +
          enemySizeMin,
        m
      )
    );
  }
};

//power up/ power up enemy classes

class PowerUpEnemy {
  constructor(x, y, r, type) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.r = r;
    this.type = type;
    this.damage = r;
    this.age = 0;
    this.sinIndex = (Math.random() - 0.5) * 30;
    if (this.type == 8) {
      this.r *= 3;
      this.damage *= 3;
    }
  }
  determineDirection() {
    if (this.type >= powerUpTypeArr.length) {
      let a = this.x - player.x;
      let b = this.y - player.y;
      let num = Math.atan2(a, b);
      this.dx = Math.sin(num) * powerUpSpeed;
      this.dy = Math.cos(num) * powerUpSpeed;
    } else if (this.type < powerUpTypeArr.length) {
      if (this.originalX == 0) {
        this.dx = -powerUpSpeed * 1.5;
        this.dy = Math.sin(this.age / 15) * this.sinIndex;
      } else if (this.originalX == window.innerWidth) {
        this.dx = powerUpSpeed * 1.5;
        this.dy = Math.sin(this.age / 15) * this.sinIndex;
      } else {
        let a = this.x - player.x;
        let b = this.y - player.y;
        let num = Math.atan2(a, b);
        this.dx = Math.sin(num) * powerUpSpeed * 1.5;
        this.dy = Math.cos(num) * powerUpSpeed * 1.5;
      }
    }
  }
  draw() {
    if (this.type <= 7) {
      this.col = blackNoAlpha;
      this.stroke = neonBlue;
    } else if (this.type == 8) {
      this.col = blackNoAlpha;
      this.stroke = "rgb(155, 50, 168)";
    } else {
      this.col = blackNoAlpha;
      this.stroke = yellow;
    }
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.strokeStyle = this.stroke;
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
    this.determineDirection();
    this.x -= this.dx;
    this.y -= this.dy;
    this.draw();
    this.age++;
    if (this.type == 8 && this.age % 40 == 0) {
      enemyArr.push(
        new PowerUpEnemy(
          this.x,
          this.y,
          15,
          Math.floor(Math.random() * powerUpTypeArr.length)
        )
      );
    }
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
    if (this.r <= 7) {
      enemyArr.splice(this.i, 1);
      powerUpArr.push(new PowerUp(this.type));
      spawnParticles(this.x, this.y, this.stroke, 20);
      player.hp += 1;
      player.damage += 1;

      runWaveIndex++;
    }
  }
}

class Boss {
  constructor(type) {
    this.dx = 0;
    this.dy = 0;
    this.type = type;
    this.age = 1;
    this.isBoss = true;
    enemySpawnChance = 100000;
    powerUpSpawnChance = 100000;

    //type 0

    if (this.type == 0) {
      this.x = 100;
      this.y = -200;
      this.r = 200;
      this.damage = this.r;
      this.col = magentaLowAlpha;
      this.stroke = magenta;
    }

    // type 1
    else if (this.type == 1) {
      this.x = 200;
      this.y = 200;
      this.r = 100;
      this.damage = this.r;
      this.col = yellowLowAlpha;
      this.stroke = yellow;
    }

    //type 2
    else if (this.type == 2) {
      this.x = -200;
      this.y = 200;
      this.r = 150;
      this.damage = this.r;
      this.stroke = neonGreen;
      this.col = neonGreenLowAlpha;
      this.moveLeft = false;
    }

    // type 3
    else if (this.type == 3) {
      this.x = -200;
      this.y = 100;
      this.r = 100;
      this.damage = this.r;
      this.stroke = white;
      this.col = whiteLowAlpha;
      this.moveLeft = false;
    }
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.strokeStyle = this.stroke;
    c.fillStyle = this.col;
    c.lineWidth = 30;
    c.fill();
    c.stroke();
  }
  shrink(damage) {
    //type 0

    if (this.type == 0) {
      this.damage -= damage / (3 + player.hp / 20);
    }

    //type 1
    else if (this.type == 1) {
      this.damage -= damage / (3 + player.hp / 20);
    }

    //type 2
    else if (this.type == 2) {
      console.log(this.damage);
      this.damage -= damage / (3 + player.hp / 20);
    } else if (this.type == 3) {
      console.log(this.damage);
      this.damage -= damage / (3 + player.hp / 20);
    }
  }
  determineDirection() {
    //type 0

    if (this.type == 0) {
      this.dx = Math.sin(this.age / 20) * 10;
      if (this.y > player.y) {
        this.dy = -1.5;
      } else {
        this.dy = 1.5;
      }
    }

    //type 1
    else if (this.type == 1) {
      this.dx = 0;
      this.dy = 0;
      if (this.age == 100) {
        spawnParticles(this.x, this.y, this.stroke, 60);
        enemyArr.push(
          new PowerUpEnemy(
            this.x,
            this.y,
            20,
            Math.floor(Math.random() * powerUpTypeArr.length)
          )
        );
        this.x = window.innerWidth - 200;
      } else if (this.age == 200) {
        spawnParticles(this.x, this.y, this.stroke, 60);
        enemyArr.push(
          new PowerUpEnemy(
            this.x,
            this.y,
            20,
            Math.floor(Math.random() * powerUpTypeArr.length)
          )
        );
        this.y = window.innerHeight - 200;
      } else if (this.age == 300) {
        spawnParticles(this.x, this.y, this.stroke, 60);
        enemyArr.push(
          new PowerUpEnemy(
            this.x,
            this.y,
            20,
            Math.floor(Math.random() * powerUpTypeArr.length)
          )
        );
        this.x = 200;
      } else if (this.age == 400) {
        spawnParticles(this.x, this.y, this.stroke, 60);
        enemyArr.push(
          new PowerUpEnemy(
            this.x,
            this.y,
            20,
            Math.floor(Math.random() * powerUpTypeArr.length)
          )
        );
        this.y = 200;
        this.age = 0;
      }
    }

    // type 2
    else if (this.type == 2) {
      if (this.x + this.r > window.innerWidth) {
        this.moveLeft = true;
        spawnParticles(window.innerWidth, this.y, this.stroke, 100);
        enemyArr.push(
          new PowerUpEnemy(
            this.x,
            this.y,
            20,
            Math.floor(Math.random() * powerUpTypeArr.length)
          )
        );
      } else if (this.x - this.r < 0) {
        this.moveLeft = false;
        if (this.x - this.r > -13) {
          spawnParticles(0, this.y, this.stroke, 100);
          enemyArr.push(
            new PowerUpEnemy(
              this.x,
              this.y,
              20,
              Math.floor(Math.random() * powerUpTypeArr.length)
            )
          );
        }
      }
      if (this.moveLeft == true) {
        this.dx = -13;
        this.dy = Math.sin(this.age / 15) * 5;
      } else if (this.moveLeft !== true) {
        this.dx = 13;
        this.dy = Math.sin(this.age / 15) * 5;
      }
    }

    //type 3
    else if (this.type == 3) {
      if (this.age > 100) {
        if (this.x + this.r > window.innerWidth) {
          this.x = window.innerWidth - this.r;
          this.dx = 0;
          this.dy = 10;
        } else if (this.y + this.r > window.innerHeight) {
          this.y = window.innerHeight - this.r;
          this.dy = 0;
          this.dx = -10;
        } else if (this.x - this.r < 0) {
          this.x = this.r;
          this.dx = 0;
          this.dy = -10;
        } else if (this.y - this.r < 0) {
          this.y = this.r;
          this.dy = 0;
          this.dx = 10;
        }
      } else {
        this.dx = 10;
        this.dy = 0;
      }
      if (this.x + this.r == window.innerWidth) {
        spawnParticles(window.innerWidth, this.y, this.stroke, 1);
      } else if (this.y + this.r == window.innerHeight) {
        spawnParticles(this.x, window.innerHeight, this.stroke, 1);
      } else if (this.x - this.r == 0) {
        spawnParticles(0, this.y, this.stroke, 1);
      } else if (this.y - this.r == 0) {
        spawnParticles(this.x, 0, this.stroke, 1);
      }
    }
  }

  shoot() {
    //type 0

    if (this.type == 0) {
      if (this.age % 40 == 0) {
        enemyArr.push(new Enemy(this.x, this.y, 30, this.stroke));
        spawnParticles(this.x, this.y, this.stroke, 5);
      }
      if (this.age % 110 == 0) {
        spawnParticles(this.x, this.y, this.stroke, 5);
        enemyArr.push(
          new PowerUpEnemy(
            this.x,
            this.y,
            30,
            Math.floor(Math.random() * powerUpTypeArr.length)
          )
        );
      }
    }

    //type 1
    else if (this.type == 1 && this.age % 25 == 0 && this.age % 100 !== 0) {
      spawnParticles(this.x, this.y, this.stroke, 10);

      enemyArr.push(new PowerUpEnemy(this.x, this.y, 15, 20));
    }

    //type 2
    else if (this.type == 2 && this.age % 10 == 0) {
      enemyArr.push(new Enemy(this.x, this.y, 12, neonGreen));
    }

    //type 3
    else if (this.type == 3 && this.age % 40 == 0) {
      if (this.age % 200 == 0) {
        enemyArr.push(
          new PowerUpEnemy(
            this.x,
            this.y,
            20,
            Math.floor(Math.random() * powerUpTypeArr.length)
          )
        );
      } else {
        enemyArr.push(new Enemy(this.x, this.y, 20, white));
      }
    }
  }
  update(i) {
    this.i = i;
    this.determineDirection();
    this.age++;
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
    this.shoot();
    invincibleProjectiles = false;
    bossIsActive = true;
    if (this.r > this.damage) {
      this.r -= 2;
      score += 2;
    }
    if (this.r <= 10) {
      particleSpeed = 75;
      particleSize = 10;
      spawnParticles(this.x, this.y, this.stroke, 200);
      particleSpeed = 23;
      particleSize = 4;
      enemyArr.splice(this.i, 1);
      player.hp += 1;
      player.damage += 1;

      runWaveIndex = 0;
      enemySpawnChance = 70;
      powerUpSpawnChance = 140;
      bossIsActive = false;
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
      if (this.age == 0) {
        projSize = 30;
        spawnParticles(player.x, player.y, white, "LARGE ORBS");
      }
      this.age++;
    } else if (this.type === 1) {
      if (this.age == 0) {
        playerSpeed = 9;
        playerStroke = magenta;
        playerCol = magentaMidAlpha;
        spawnParticles(player.x, player.y, white, "FAST PLAYER");
      }
      this.age += 0.5;
    } else if (this.type === 2) {
      if (this.age == 0) {
        rapidFire = true;
        spawnParticles(player.x, player.y, white, "RAPID FIRE");
      }
      this.age += 2;
    } else if (this.type === 3 && bossIsActive == false) {
      if (this.age == 0) {
        invincibleProjectiles = true;
        projectileCol = yellowLowAlpha;
        projectileStroke = yellow;
        spawnParticles(player.x, player.y, white, "INVINCIBLE ORBS");
      }
      this.age++;
    } else if (this.type == 4) {
      if (this.age == 0) {
        projSpeed = 26;
        projectileStroke = magenta;
        projectileCol = magentaMidAlpha;
        spawnParticles(player.x, player.y, white, "FAST ORBS");
      }
      this.age += 0.6;
    } else if (this.type == 5) {
      if (this.age == 0) {
        homingProjectiles = true;
        projectileCol = redLowAlpha;
        projectileStroke = red;
        spawnParticles(player.x, player.y, white, "TRACKING ORBS");
      }
      this.age++;
    } else if (this.type == 6) {
      if (this.age == 0) {
        doubleProjectiles = true;
        spawnParticles(player.x, player.y, white, "DOUBLE ORBS");
      }
      this.age += 0.6;
    } else if (this.type == 7) {
      if (this.age == 0) {
        autoFireIndex = 4;
        spawnParticles(player.x, player.y, white, "AUTO FIRE");
      }
      this.age++;
    }
  }
  update(i) {
    this.i = i;
    if (this.age <= powerUpDurration) {
      this.run();
    } else {
      if (this.type == 0) {
        projSize = 10;
      } else if (this.type == 1) {
        playerSpeed = 5;
        playerCol = whiteMidAlpha;
        playerStroke = white;
      } else if (this.type == 2) {
        rapidFire = false;
      } else if (this.type == 3) {
        invincibleProjectiles = false;
        projectileCol = neonBlueLowAlpha;
        projectileStroke = neonBlue;
      } else if (this.type == 4) {
        projSpeed = 13;
        projectileCol = neonBlueLowAlpha;
        projectileStroke = neonBlue;
      } else if (this.type == 5) {
        projectileCol = neonBlueLowAlpha;
        projectileStroke = neonBlue;
        homingProjectiles = false;
      } else if (this.type == 6) {
        doubleProjectiles = false;
      } else if (this.type == 7) {
        autoFireIndex = 12;
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
    this.r = 0.5;
    this.col = ambientParticleColor;
    this.type = Math.floor(Math.random() * 6);
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = this.col;
    c.fill();
  }
  update(i) {
    this.i = i;
    if (this.type <= 2) {
      this.x = window.innerWidth / 2 + this.dx * 150;
      this.y = window.innerHeight / 2 + this.dy * 150;
    } else if (this.type == 3 || this.type == 4) {
      this.dx *= 1.001;
      this.dy *= 1.0001;
      this.r *= 1.001;
      this.x = window.innerWidth / 2 + this.dx * 100;
      this.y = window.innerHeight / 2 + this.dy * 100;
    } else {
      this.dx *= 1.005;
      this.dy *= 1.0005;
      this.r *= 1.01;
      this.x = window.innerWidth / 2 + this.dx * 50;
      this.y = window.innerHeight / 2 + this.dy * 50;
    }
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

//wave function

const runWave = () => {
  waveIndex++;
  if (waveIndex == 1) {
    ambientParticleColor = "red";
    enemySpawnChance = 7000;
    powerUpSpawnChance = 4000;
  } else if (waveIndex == 200) {
    shouldRunWaveMessage1 = true;
  } else if (waveIndex == 240) {
    shouldRunWaveMessage1 = false;
  } else if (waveIndex == 250) {
    shouldRunWaveMessage2 = true;
  } else if (waveIndex == 300) {
    shouldRunWaveMessage2 = false;
  } else if (waveIndex == 400) {
    enemySpawnChance = 20;
    powerUpSpawnChance = 60;
  } else if (waveIndex == 2000) {
    ambientParticleColor = "white";
    enemySpawnChance = 100000;
    powerUpSpawnChance = 100000;
  } else if (waveIndex == 2500) {
    enemyArr.push(new Boss(Math.floor(Math.random() * bossTypeArr.length)));
    numberOfWaves++;
    bossIsActive = true;
    shouldRunWave = false;
    waveIndex = 0;
  }
};

//wave incoming message

const waveIncomingMessage1 = () => {
  c.fillStyle = "rgb(255, 255, 255)";
  c.font = "200px Impact";
  c.textAlign = "center";
  c.fillText("WAVE", window.innerWidth / 2, window.innerHeight / 2);
};
const waveIncomingMessage2 = () => {
  c.fillStyle = "rgb(255, 255, 255)";
  c.font = "200px Impact";
  c.textAlign = "center";
  c.fillText("INCOMING", window.innerWidth / 2, window.innerHeight / 2);
};

//death message

const deathMessage = () => {
  c.fillStyle = "rgb(255, 255, 255)";
  c.font = "150px Impact";
  c.textAlign = "center";
  c.fillText("GAME OVER", window.innerWidth / 2, window.innerHeight / 2);
  c.font = "50px Impact";
  c.fillText(
    "PRESS SPACE",
    window.innerWidth / 2,
    window.innerHeight / 2 + 150
  );
};

//start game message

const startGameMessage = () => {
  c.fillStyle = "rgb(255, 255, 255)";
  c.font = "50px Impact";
  c.textAlign = "center";
  c.fillText("PRESS SPACE", window.innerWidth / 2, window.innerHeight / 2);
  c.font = "25px Impact";
  c.fillText(
    "PRESS 'F' FOR FULL SCREEN",
    window.innerWidth / 2,
    window.innerHeight / 2 + 150
  );
  c.font = "150px Impact";
  c.fillText("ORB.IO", window.innerWidth / 2, window.innerHeight / 2 - 150);
};

//pause message

const pauseMessage = () => {
  c.fillStyle = "rgb(255, 255, 255)";
  c.font = "200px Impact";
  c.textAlign = "center";
  c.fillText("PAUSED", window.innerWidth / 2, window.innerHeight / 2);
};

//score message
const scoreMessage = () => {
  c.fillStyle = "rgb(255, 255, 255)";
  c.font = "40px Impact";
  c.textAlign = "center";
  c.fillText("score: " + score.toString(), window.innerWidth / 2, 50);
};
//game function

const runFrame = () => {
  if (
    shouldAnimate == false &&
    shouldRunStartGameMessage == false &&
    gameOver !== true
  ) {
    pauseMessage();
  }
  if (gameOver == false && shouldAnimate) {
    ambientBackground();
    c.fillStyle = "rgba(0, 0, 0, 0.5)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    createEnemy();
    powerUpSpawnIndex++;
    mouseDownIndex++;
    if (mouseIsDown && mouseDownIndex % autoFireIndex == 0) {
      autoFire(mouseClientX, mouseClientY);
    }
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
    player.update();
    if (rapidFire === true) {
      let randomX = (Math.random() - 0.5) * projSpeed;
      let randomY = (Math.random() - 0.5) * projSpeed;
      player.shoot(randomX, randomY);
    }
    if (runWaveIndex == 50 && bossIsActive == false) {
      shouldRunWave = true;
    }
    scoreMessage();
    if (shouldRunWave) {
      runWave();
    }
    if (shouldRunWaveMessage1) {
      waveIncomingMessage1();
    }
    if (shouldRunWaveMessage2) {
      waveIncomingMessage2();
    }
    if (score / 2000 + 5 > enemySpeed) {
      enemySpeed++;
      powerUpSpeed++;
      enemySizeMax += 1;
      enemySizeMin += 1;
    }
  } else if (gameOver) {
    deathMessage();
  }
};

const startGameFrame = () => {
  if (shouldRunStartGameMessage) {
    c.fillStyle = "rgba(0, 0, 0, 0.5)";
    c.fillRect(0, 0, canvas.width, canvas.height);

    ambientBackground();
    for (let i = ambientParticleArr.length - 1; i >= 0; i--) {
      ambientParticleArr[i].update(i);
    }
    for (let i = particleArr.length - 1; i >= 0; i--) {
      particleArr[i].update(i);
    }
    startGameFrameIndex++;
    if (startGameFrameIndex % 30 == 0) {
      startGameFrameIndex = 0;
      enemyArr.push(
        new PowerUpEnemy(
          Math.floor(Math.random() * 2) * window.innerWidth,
          Math.random() * window.innerHeight,
          Math.random() * 10 + 20,
          0
        )
      );
    }
    for (let i = enemyArr.length - 1; i >= 0; i--) {
      enemyArr[i].update(i);
    }
    startGameMessage();
  }
};
//animation function

const animate = () => {
  setInterval(function () {
    runFrame();
  }, 20);
};
const gameStartAnimation = () => {
  setInterval(function () {
    startGameFrame();
  }, 20);
};
animate();
gameStartAnimation();
