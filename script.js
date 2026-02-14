// === Настройки ===
const emojis = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🍑'];
const gameArea = document.getElementById('gameArea');
const basket = document.getElementById('basket');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');

let score = 0;
let lives = 3;
let basketX = 260; // начальная позиция: (600 - 80) / 2 = 260
let gameActive = true;

// Обновляем позицию корзины
function updateBasketPosition() {
  basket.style.left = `${basketX}px`;
}
updateBasketPosition();

// === Управление стрелками ===
window.addEventListener('keydown', (e) => {
  if (!gameActive) return;
  const speed = 25; // ← увеличена скорость!
  if (e.key === 'ArrowLeft') {
    basketX = Math.max(0, basketX - speed);
  } else if (e.key === 'ArrowRight') {
    basketX = Math.min(600 - 80, basketX + speed); // ← ширина поля = 600
  }
  updateBasketPosition();
});

// === Создание падающего эмодзи ===
function createFallingEmoji() {
  if (!gameActive) return;

  const emoji = document.createElement('div');
  emoji.className = 'falling';
  emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];

  const startX = Math.random() * (600 - 40); // ← спавн внутри 600px
  emoji.style.left = `${startX}px`;
  gameArea.appendChild(emoji);

  let posY = -50;
  const fallSpeed = 2 + Math.random() * 2;

  const fallInterval = setInterval(() => {
    if (!gameActive) {
      clearInterval(fallInterval);
      return;
    }

    posY += fallSpeed;
    emoji.style.top = `${posY}px`;

    // Проверка столкновения
    if (posY > gameArea.offsetHeight - 60) {
      const basketRect = basket.getBoundingClientRect();
      const emojiRect = emoji.getBoundingClientRect();
      const gameAreaRect = gameArea.getBoundingClientRect();

      const isCaught =
        emojiRect.right > basketRect.left &&
        emojiRect.left < basketRect.right;

      if (isCaught) {
        score++;
        scoreEl.textContent = score;
      } else {
        lives--;
        livesEl.textContent = lives;
        if (lives <= 0) {
          endGame();
        }
      }

      emoji.remove();
      clearInterval(fallInterval);
    }
  }, 30);
}

// === Спавн эмодзи каждые 1–2 секунды ===
let spawnInterval = setInterval(() => {
  if (gameActive) createFallingEmoji();
}, 1000 + Math.random() * 1000);

// === Завершение игры ===
function endGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  alert(`Игра окончена!\nВаш счёт: ${score}`);
}

// === Адаптация под resize (опционально, но оставим для надёжности) ===
window.addEventListener('resize', () => {
  basketX = Math.min(basketX, 600 - 80);
  updateBasketPosition();
});