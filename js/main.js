const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = 300;

const dinoImg = new Image();
dinoImg.src = './images/dino.png';

const cactusImg = new Image();
cactusImg.src = './images/cactus.png';

let gravity = 0.5;
let jumpPower = 12;
let gameSpeed = 3;
let score = 0;
let isGameOver = false;

const dino = {
    x: 50,
    y: 200,
    width: 50,
    height: 50,
    vy: 0,
    jumping: false,
    draw() {
        ctx.drawImage(dinoImg, this.x, this.y, this.width, this.height);
    },
    update() {
        if (this.jumping) {
            this.vy -= gravity;
            this.y -= this.vy;
        } else {
            if (this.y < 200) {
                this.vy -= gravity;
                this.y -= this.vy;
            } else {
                this.y = 200;
                this.vy = 0;
            }
        }
    }
};

class Cactus {
    constructor() {
        this.x = canvas.width;
        this.y = 200;
        this.width = 50;
        this.height = 50;
    }
    draw() {
        ctx.drawImage(cactusImg, this.x, this.y, this.width, this.height);
    }
    update() {
        this.x -= gameSpeed;
        this.draw();
    }
}

const cactuses = [];
let timer = 0;
let animation;

function frameLoop() {
    animation = requestAnimationFrame(frameLoop);
    timer++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경 바닥 그리기
    ctx.fillStyle = "#ccc";
    ctx.fillRect(0, 250, canvas.width, 2);

    // 점수 표시
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 150, 30);

    // 난이도 증가
    if (timer % 1000 === 0) {
        gameSpeed += 0.5;
    }

    if (timer % 120 === 0) {
        cactuses.push(new Cactus());
        score += 10;
    }

    cactuses.forEach((cactus, i, arr) => {
        if (cactus.x + cactus.width < 0) {
            arr.splice(i, 1);
        }
        cactus.update();

        if (checkCollision(dino, cactus)) {
            gameOver();
        }
    });

    dino.update();
    dino.draw();
}

function checkCollision(dino, cactus) {
    return (
        dino.x < cactus.x + cactus.width &&
        dino.x + dino.width > cactus.x &&
        dino.y < cactus.y + cactus.height &&
        dino.y + dino.height > cactus.y
    );
}

function gameOver() {
    isGameOver = true;
    cancelAnimationFrame(animation);
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText("Press R to Restart", canvas.width / 2 - 80, canvas.height / 2 + 40);
}

document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && !dino.jumping && dino.y >= 200) {
        dino.jumping = true;
        dino.vy = jumpPower;
    }
    if (e.code === 'KeyR' && isGameOver) {
        location.reload();
    }
});

document.addEventListener('keyup', function (e) {
    if (e.code === 'Space') {
        dino.jumping = false;
    }
});

frameLoop();