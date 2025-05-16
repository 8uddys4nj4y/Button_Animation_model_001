const canvas = document.getElementById('branchCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let branches = [];
let animationRunning = false;

class Branch {
  constructor(x, y, angle, depth) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.length = Math.random() * 30 + 20;
    this.life = 0;
    this.depth = depth;
  }

  update() {
    const dx = Math.cos(this.angle) * 2.0;
    const dy = Math.sin(this.angle) * 2.0;
    this.x += dx;
    this.y += dy;
    this.life++;

    // Only split once per branch to reduce processing
    if (this.life === 10 && this.depth < 5) {
      branches.push(new Branch(this.x, this.y, this.angle + 0.5, this.depth + 1));
      branches.push(new Branch(this.x, this.y, this.angle - 0.5, this.depth + 1));
    }
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = `rgba(0, 255, 255, ${1 - this.depth * 0.3})`;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + Math.cos(this.angle) * 2, this.y + Math.sin(this.angle) * 2);
    ctx.stroke();
  }
}

function growBranches(x, y) {
  for (let i = 0; i < 8; i++) {
    let angle = Math.random() * Math.PI * 2;
    branches.push(new Branch(x, y, angle, 0));
  }
  if (!animationRunning) {
    animate();
  }
}

function animate() {
  animationRunning = true;
  let frame = 0;
  const maxFrames = 60; // ~2 seconds of animation

  const interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    branches.forEach((b, i) => {
      b.update();
      b.draw();
      if (b.life > 30) branches.splice(i, 1);
    });

    frame++;
    if (frame > maxFrames) {
      clearInterval(interval);
      animationRunning = false;
    }
  }, 1000 / 30); // ~30 FPS
}

document.getElementById("glowButton").addEventListener("mouseenter", (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  growBranches(x, y);
});
