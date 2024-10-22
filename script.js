const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const shootButton = document.getElementById('shootButton');
const restartButton = document.getElementById('restartButton');
const messageElement = document.getElementById('message');
const angleInput = document.getElementById('angle');
const velocityInput = document.getElementById('velocity');
const angleValue = document.getElementById('angleValue');
const velocityValue = document.getElementById('velocityValue');

let fire = { x: Math.random() * 800 + 50, y: 340, size: 60 }; // Fogo mais para baixo e maior, mas visível
let airplane = { x: 100, y: 20, width: 80, height: 30 }; // Posição do avião na parte superior

// Imagens
let airplaneImage = new Image();
airplaneImage.src = 'aviao.png';

let fireImage = new Image();
fireImage.src = 'fogo.png';

// Essa função vai desenhar o fogo
function drawFire() {
    ctx.drawImage(fireImage, fire.x, fire.y, fire.size, fire.size);
}

// Essa função vai para desenhar o avião
function drawAirplane() {
    ctx.drawImage(airplaneImage, airplane.x, airplane.y, airplane.width, airplane.height);
}

// Função para desenhar a mira pontilhada
function drawDottedCrosshair(x, y) {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]); // Define um estilo de linha pontilhada
    ctx.beginPath();
    ctx.moveTo(x - 5, y); // Diminuir o comprimento da mira
    ctx.lineTo(x + 5, y);
    ctx.moveTo(x, y - 5); // Diminuir o comprimento da mira
    ctx.lineTo(x, y + 5);
    ctx.stroke();
    ctx.setLineDash([]); // Reseta para linha sólida
}

// Função para calcular a trajetória do projétil
function calculateTrajectory(angle, velocity) {
    const angleRad = angle * (Math.PI / 180);
    const vx = velocity * Math.cos(angleRad);
    const vy = velocity * Math.sin(angleRad);
    let t = 0;

    const trajectoryPoints = [];

    // Calcula onde o projétil irá parar
    while (true) {
        const x = airplane.x + vx * t;
        const y = 20 + vy * t; // Começa de cima (20) e vai para baixo
        if (y > canvas.height) break; // Para se sair da tela
        trajectoryPoints.push({ x, y });
        t += 0.1;
    }
    return trajectoryPoints;
}

// Função que realiza o disparo
function shootCannon(angle, velocity) {
    const angleRad = angle * (Math.PI / 180);
    const vx = velocity * Math.cos(angleRad);
    const vy = velocity * Math.sin(angleRad);
    let projectileX = airplane.x; // Começa na posição do avião
    let projectileY = 20; // Começa de cima

    // Move o avião para a parte inferior da tela e dispara o projétil
    const airplaneMoveInterval = setInterval(() => {
        if (airplane.x < canvas.width - airplane.width) {
            airplane.x += 5; // Move o avião para a direita
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawAirplane();
            drawFire();

            // Atualiza a posição do projétil ao mesmo tempo
            projectileX += vx * 0.1; // Move horizontalmente
            projectileY += vy * 0.1; // Move verticalmente

            // Desenhar a bola de canhão azul
            ctx.beginPath();
            ctx.arc(projectileX, projectileY, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'blue'; // Cor do projétil
            ctx.fill();

            // Checa colisão com o fogo
            if (projectileX >= fire.x && projectileX <= fire.x + fire.size && projectileY >= fire.y && projectileY <= fire.y + fire.size) {
                clearInterval(airplaneMoveInterval);
                messageElement.textContent = 'Você apagou o fogo! Avançando para a próxima fase.';
                messageElement.style.color = 'green';
                resetGame();
            }

            // Checa se o projétil saiu da tela
            if (projectileY > canvas.height || projectileX > canvas.width) {
                clearInterval(airplaneMoveInterval);
                messageElement.textContent = 'Você errou! Tente novamente.';
                messageElement.style.color = 'red';
            }
        } else {
            clearInterval(airplaneMoveInterval); // Para o movimento do avião
        }
    }, 30);
}

// Função para reiniciar o jogo
function resetGame() {
    fire.x = Math.random() * 700 + 50; // Nova posição do fogo
    airplane.x = 100; // Reseta a posição do avião
}

// Inicializa o jogo
function initGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAirplane();
    drawFire();
}

// Função para atualizar a mira pontilhada
function updateCrosshair() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAirplane();
    drawFire();

    const trajectory = calculateTrajectory(angleInput.value, velocityInput.value);
    trajectory.forEach(point => drawDottedCrosshair(point.x, point.y));
}

// Eventos de clique
shootButton.addEventListener('click', () => {
    const angle = parseFloat(angleInput.value);
    const velocity = parseFloat(velocityInput.value);
    messageElement.textContent = '';
    shootCannon(angle, velocity);
});

restartButton.addEventListener('click', () => {
    resetGame();
    initGame();
    messageElement.textContent = '';
});

// Atualiza os valores de exibição do ângulo e velocidade
angleInput.addEventListener('input', () => {
    angleValue.textContent = angleInput.value;
    updateCrosshair(); // Atualiza a mira
});

velocityInput.addEventListener('input', () => {
    velocityValue.textContent = velocityInput.value;
    updateCrosshair(); // Atualiza a mira
});

// Inicializa o jogo
initGame();
