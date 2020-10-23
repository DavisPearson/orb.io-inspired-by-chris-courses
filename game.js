const canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const c = canvas.getContext("2d");
let score = 0;
let projSpeed = 10;
let projSize = 15;
let enemySpawnChance = 70;
let enemySpeed = 1.5;
let playerSpeed = 3;
let particleSpeed = 23;
let entityArr = [];
let enemyArr = [];
let particleArr = [];
let powerUpArr = [];
let particleDecay = 0.9;
let particleAge = 50;
let gameOver = false;
let enemySizeMin = 20;
let enemySizeMax = 50;
let playerSize = 20;
let powerUpDurration = 350;
let powerUpSpeed = 6;
projectileCol = "rgba(100, 255, 255, 0.5)";
let rapidFire = false;
let invincibleProjectiles = false;
const colisionDetect = (x1, y1, r1, x2, y2, r2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)) - (r1 + r2);
};
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
class Projectile {
  constructor(x, y, r, col, dx, dy) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.col = col;
    this.dx = dx;
    this.dy = dy;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = "rgba(0, 255, 255, 0.5)";
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
  }
}
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: playerSize,
  playerCol: "rgba(250, 250, 250)",
  col2: "black",
  dx: 0,
  dy: 0,
  damage: playerSize,
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    c.fillStyle = this.playerCol;
    c.fill();
  },
  shoot(dx, dy) {
    c.beginPath();
    c.arc(this.x, this.y, projSize, 0, Math.PI * 2, false);
    c.fillStyle = projectileCol;
    c.strokeStyle = "black";
    c.fill();
    c.stroke();
    entityArr.push(
      new Projectile(this.x, this.y, projSize, projectileCol, dx, dy)
    );
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
class Enemy {
  constructor(x, y, r, col) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.col = col;
    this.damage = r;
  }
  determineDirection() {
    if (
      this.col === "yellow" ||
      this.col === "green" ||
      this.col === "white" ||
      this.col === "pink"
    ) {
      let a = this.x - player.x;
      let b = this.y - player.y;
      let num = Math.atan2(a, b);
      this.dx = Math.sin(num) * powerUpSpeed;
      this.dy = Math.cos(num) * powerUpSpeed;
    } else {
      let a = this.x - player.x;
      let b = this.y - player.y;
      let num = Math.atan2(a, b);
      this.dx = Math.sin(num) * enemySpeed;
      this.dy = Math.cos(num) * enemySpeed;
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
      enemyArr.splice(this.i, 1);
    }
    if (this.r > this.damage) {
      this.r -= 2;
      score += 2;
    }
    if (this.r <= 10) {
      if (this.col === "yellow") {
        powerUpArr.push(new PowerUp("strongerProjectiles"));
      }
      if (this.col === "green") {
        powerUpArr.push(new PowerUp("fasterPlayer"));
      }
      if (this.col === "white") {
        powerUpArr.push(new PowerUp("rapidFire"));
      }
      if (this.col === "pink") {
        powerUpArr.push(new PowerUp("invincibleProjectiles"));
      }
      enemyArr.splice(this.i, 1);
      spawnParticles(this.x, this.y, this.col, 20);
      player.r += 1;
      player.damage += 1;
      enemySizeMax += 0.2;
      enemySizeMin += 0.2;
      enemySpawnChance *= 0.999;
      score += Math.floor(player.r / 5);
    }
  }
}
const createEnemy = () => {
  let k = Math.floor(Math.random() * enemySpawnChance);
  if (k == 0) {
    let enemyCol = "";
    let randIndex = Math.floor(Math.random() * 2);
    if (randIndex == 0) {
      enemyCol = "red";
    } else if (randIndex == 1) {
      enemyCol = "blue";
    } else {
      enemyCol = "green";
    }
    let r =
      Math.floor(Math.random() * (enemySizeMax - enemySizeMin)) + enemySizeMin;
    let x = Math.random() * window.innerWidth;
    let y = Math.floor(Math.random() * 2) * window.innerHeight;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2, false);
    c.fillStyle = "red";
    c.fill();
    enemyArr.push(new Enemy(x, y, r, enemyCol));
  } else if (k == 1) {
    let m = Math.floor(Math.random() * 40);
    if (m == 0) {
      enemyCol = "yellow";
    } else if (m == 1) {
      enemyCol = "green";
    } else if (m == 2) {
      enemyCol = "white";
    } else if (m == 3) {
      enemyCol = "pink";
    }
    if (m == 0 || m == 1 || m == 2 || m == 3) {
      let r =
        Math.floor(Math.random() * (enemySizeMax - enemySizeMin)) +
        enemySizeMin;
      let x = Math.random() * window.innerWidth;
      let y = Math.floor(Math.random() * 2) * window.innerHeight;
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2, false);
      c.fillStyle = "red";
      c.fill();
      enemyArr.push(new Enemy(x, y, r, enemyCol));
    }
  }
};
class PowerUp {
  constructor(type) {
    this.type = type;
    this.age = 0;
  }
  run() {
    if (this.type === "strongerProjectiles") {
      projSize = 30;
      this.age++;
    } else if (this.type === "fasterPlayer") {
      playerSpeed = 6;
      this.age++;
    } else if (this.type === "rapidFire") {
      rapidFire = true;
      this.age++;
    } else if (this.type == "invincibleProjectiles") {
      invincibleProjectiles = true;
      projSize = 5;
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
      powerUpArr.splice(this.i, 1);
      projSize = 12;
      playerSpeed = 3;
      rapidFire = false;
      invincibleProjectiles = false;
    }
  }
}

const animate = () => {
  requestAnimationFrame(animate);
  //c.clearRect(0, 0, window.innerWidth, window.innerHeight)
  if (gameOver == false) {
    c.fillStyle = "rgba(0, 0, 0, 0.2)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    createEnemy();
    player.update();
    console.log(score);
    let scoreDisplay = document.querySelector("#scoreDisplay");
    scoreDisplay.innerHTML = score;
    if (rapidFire == true) {
      let randDx = (Math.random() - 0.5) * 15;
      let randDy = (Math.random() - 0.5) * 15;
      player.shoot(randDx, randDy);
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
  }
  for (let i = powerUpArr.length - 1; i >= 0; i--) {
    powerUpArr[i].update(i);
  }
};
animate();
