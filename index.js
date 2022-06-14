const canvas = document.getElementById("canvas");
const scoreCard = document.getElementById("theScore");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let score = 0;
const playerStartPos = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};
let projectiles = [];
let enemies = [];
let particles = [];
let stars = [];
const starSize = 3;
const friction = 0.99;
//  ***********************************************************************************
//  PLAYER
const playerColor = "purple";
const moveWithMouse = false;
//  SCORING
const lossOfProjectile = -25;
const hitButNotDestroy = 20;
const hitAndDestroy = 100;
//  STARS
const NUMBER_OF_STARS = 100;
const MAX_SIZE = 5;
//  PROJECTILE
const projectileSpeed = 7;
const projectileSize = 5;

//  ENEMY
const maxEnemySize = 30;
const minEnemySize = projectileSize * 1.5;
let enemySpawnSpeed = 2; // seconds
const explosionAwesomeness = 5;
const enemyReductionOnHit = 10;
let enemyVelocity = 2;
//  PARTICLES
const maxExplosionParticleVelocity = 10;
const maxParticleExplosionSize = 2;
//  *************************************************************************************

//  CLASSES
class Star {
  constructor(x, y, length, color) {
    (this.x = x),
      (this.y = y),
      (this.length = length),
      (this.color = `hsl(${Math.random() * 360},50%,50%)`);
    this.size = length;
  }
  draw() {
      c.beginPath();
      c.fillStyle = "rgba(225,225,225,0.5)";
    c.lineWidth = 1;
    c.strokeStyle = "white";
    c.moveTo(this.x, this.y);
    c.lineTo(this.x, this.y + this.size * 2);
    c.stroke();
    c.moveTo(this.x - this.size, this.y + this.size);
    c.lineTo(this.x + this.size, this.y + this.size);
      c.stroke();
     c.moveTo(this.x + this.size/2, this.y+(this.size/2));
     c.lineTo(this.x - this.size/2, this.y + this.size*1.5);
     c.stroke();     
     c.moveTo(this.x - this.size / 2, this.y + this.size / 2);
     c.lineTo(this.x + this.size / 2, this.y + this.size * 1.5);
     c.stroke();
  }
}
class Player {
  constructor(x, y, radius, color) {
    this.alive = true;
    this.x = playerStartPos.x;
    this.y = playerStartPos.y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    if (this.alive) {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
    }
  }
}
class Projectile {
  constructor(x, y, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = projectileSize;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
class Enemy {
  constructor(x, y, color, radius, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
  update() {
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
class Particle {
  constructor(x, y, color, radius, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }
  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }
  update() {
    this.draw();
    this.velocity.x = this.velocity.x * friction;
    this.velocity.y = this.velocity.y * friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha = this.alpha - 0.01;
  }
}
//  ************************************************************************************
//  THE CODE
setInterval(() => {
  enemySpawnSpeed = enemySpawnSpeed * 0.75;
  enemyVelocity = enemyVelocity + 0.15;
}, 10000);
const mainPlayer = new Player(100, 100, 10, playerColor);
mainPlayer.draw();
function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (maxEnemySize - minEnemySize) + minEnemySize;
    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    const color = `hsl(${Math.random() * 360},50%,50%)`;

    let angle = Math.atan2(mainPlayer.y - y, mainPlayer.x - x);
    const velocity = {
      x: Math.cos(angle) * enemyVelocity,
      y: Math.sin(angle) * enemyVelocity,
    };
    if (mainPlayer.alive) {
      const newEnemyToSpawn = new Enemy(x, y, color, radius, velocity);
      enemies.push(newEnemyToSpawn);
    }
  }, 1000 * enemySpawnSpeed);
}
let animationID;
function increaseScore(amount) {
  score = score + amount;
  scoreCard.innerHTML = score;
}
const newStar = new Star(50, 50, 3, "white");
// CREATE THE STARS
function createTheStars(amount) {
 for (let i = 0; i < amount; i++) {
   stars.push(
     new Star(
       Math.random() * innerWidth,
       Math.random() * innerHeight,
       Math.random() * Math.random() * MAX_SIZE,
       "white"
     )
   );
 }

}
function animate() {
  animationID = requestAnimationFrame(animate);
  stars.forEach((star) => {
    star.draw();
  });

  c.fillStyle = "rgb(0,0,0,.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  mainPlayer.draw();
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
  projectiles.forEach((projectile, projectileIndex) => {
    if (
      projectile.x - projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width
    ) {
      setTimeout(() => {
        projectiles.splice(projectileIndex, 1);
        increaseScore(lossOfProjectile);
      }, 0);
    }
    if (
      projectile.y - projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        increaseScore(lossOfProjectile);
        projectiles.splice(projectileIndex, 1);
      }, 0);
    }
    projectile.update();
    projectile.draw();
  });
  if (enemies) {
    enemies.forEach((enemy, index) => {
      constDistFromPlayer = Math.hypot(
        mainPlayer.x - enemy.x,
        mainPlayer.y - enemy.y
      );
      if (
        mainPlayer.alive &&
        constDistFromPlayer - enemy.radius - mainPlayer.radius < 1
      ) {
        // enemy has hit main player.
        for (let i = 0; i < enemy.radius * explosionAwesomeness; i++) {
          particles.push(
            new Particle(
              mainPlayer.x, // its x position
              mainPlayer.y, // its y position
              mainPlayer.color, // its color
              Math.random() * maxParticleExplosionSize, // radius
              {
                x:
                  (Math.random() - 0.5) *
                  (Math.random() * maxExplosionParticleVelocity), // the velocity on the x axis
                y:
                  (Math.random() - 0.5) *
                  (Math.random() * maxExplosionParticleVelocity),
              }
            )
          );

          particles.push(
            new Particle(
              enemy.x, // its x position
              enemy.y, // its y position
              enemy.color, // its color
              Math.random() * maxParticleExplosionSize, // radius
              {
                x:
                  (Math.random() - 0.5) *
                  (Math.random() * maxExplosionParticleVelocity), // the velocity on the x axis
                y:
                  (Math.random() - 0.5) *
                  (Math.random() * maxExplosionParticleVelocity),
              }
            )
          );
           enemies = null;
          setTimeout(() => {
            cancelAnimationFrame(animationID);
          }, 2000);

          mainPlayer.alive = false;
        }
      }
      projectiles.forEach((projectile, projectileIndex) => {
        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
        // enemy hits projectile
        if (dist - enemy.radius - projectile.radius < 1) {
          for (let i = 0; i < enemy.radius * explosionAwesomeness; i++) {
            particles.push(
              new Particle(
                projectile.x, // its x position
                projectile.y, // its y position
                enemy.color, // its color
                Math.random() * maxParticleExplosionSize, // radius
                {
                  x:
                    (Math.random() - 0.5) *
                    (Math.random() * maxExplosionParticleVelocity), // the velocity on the x axis
                  y:
                    (Math.random() - 0.5) *
                    (Math.random() * maxExplosionParticleVelocity),
                }
              )
            );
          }
          projectiles.splice(projectileIndex, 1);
          if (enemy.radius - enemyReductionOnHit >= minEnemySize) {
            increaseScore(hitButNotDestroy);
            gsap.to(enemy, {
              radius: enemy.radius - enemyReductionOnHit,
            });
          } else {
            increaseScore(hitAndDestroy);
            enemies.splice(index, 1);
          }
        }
      });
      enemy.update();
      enemy.draw();
    });
  }
}
addEventListener("keydown", (event) => {
  event.preventDefault();
  if (event.key == "ArrowLeft") {
    mainPlayer.x = mainPlayer.x - 10;
  }
  if (event.key == "ArrowRight") {
    mainPlayer.x = mainPlayer.x + 10;
  }
  if (event.key == "ArrowUp") {
    mainPlayer.y = mainPlayer.y - 10;
  }
  if (event.key == "ArrowDown") {
    mainPlayer.y = mainPlayer.y + 10;
  }
});
addEventListener("click", (event) => {
  if (mainPlayer.alive) {
    let angle = Math.atan2(
      event.clientY - mainPlayer.y,
      event.clientX - mainPlayer.x
    );
    const projectile = new Projectile(mainPlayer.x, mainPlayer.y, "white", {
      x: Math.cos(angle) * projectileSpeed,
      y: Math.sin(angle) * projectileSpeed,
    });

    projectiles.push(projectile);
    projectile.draw();
  }
});
addEventListener("mousemove", (event) => {
  if (moveWithMouse) {
    mainPlayer.x = event.clientX;
    mainPlayer.y = event.clientY;
  }
});
createTheStars(NUMBER_OF_STARS)
spawnEnemies();
animate();

