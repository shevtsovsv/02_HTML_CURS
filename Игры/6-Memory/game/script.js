// Элементы на странице
const gameBoard = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const attemptsElement = document.getElementById("attempts");
const totalPairsElement = document.getElementById("total-pairs");
const restartButton = document.getElementById("restart-btn");

// Картинки для игры (из папки img)
const cardImages = [
  "img/dog.png",
  "img/kat.png",
  "img/rabbit.png",
  "img/fox.png",
  "img/bear.png",
  "img/panda.png",
  "img/koala.png",
  "img/lion.png",
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let attempts = 0;
let canFlip = true;

// Инициализация игры
function initGame() {
  // Очищаем доску
  gameBoard.innerHTML = "";
  cards = [];
  flippedCards = [];
  matchedPairs = 0;
  attempts = 0;
  canFlip = true;

  // Обновляем счетчики
  scoreElement.textContent = matchedPairs;
  attemptsElement.textContent = attempts;

  // Создаем пары карточек
  const gameCards = [...cardImages, ...cardImages];
  totalPairsElement.textContent = cardImages.length;

  // Перемешиваем карточки
  shuffleArray(gameCards);

  // Создаем карточки на доске
  for (let i = 0; i < gameCards.length; i++) {
    // Создаем элемент карточки
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = i;

    // Лицевая сторона (картинка)
    const front = document.createElement("div");
    front.classList.add("card-front");
    const img = document.createElement("img");
    img.src = gameCards[i];
    img.alt = `Картинка`;
    front.appendChild(img);

    // Обратная сторона (рубашка)
    const back = document.createElement("div");
    back.classList.add("card-back");
    back.textContent = "?";

    // Добавляем стороны в карточку
    card.appendChild(front);
    card.appendChild(back);

    // Добавляем обработчик клика
    card.addEventListener("click", flipCard);

    // Добавляем карточку на доску и в массив
    gameBoard.appendChild(card);
    cards.push({
      element: card,
      imgSrc: gameCards[i],
      isFlipped: false,
      isMatched: false,
    });
  }
}

// Функция перемешивания массива
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Функция переворота карточки
function flipCard() {
  const clickedCard = this;
  const cardIndex = clickedCard.dataset.index;
  const cardData = cards[cardIndex];

  // Проверяем, можно ли перевернуть эту карточку
  if (!canFlip || cardData.isFlipped || cardData.isMatched) {
    return;
  }

  // Переворачиваем карточку
  clickedCard.classList.add("flipped");
  cardData.isFlipped = true;
  flippedCards.push(cardData);

  // Если перевернули 2 карточки, проверяем на совпадение
  if (flippedCards.length === 2) {
    canFlip = false;
    attempts++;
    attemptsElement.textContent = attempts;

    checkForMatch();
  }
}

// Проверка совпадения карточек - КАК В ПЕРВОМ ВАРИАНТЕ!
function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.imgSrc === card2.imgSrc) {
    // НАШЛИ ПАРУ - как в первом варианте!
    card1.isMatched = true;
    card2.isMatched = true;

    // Убираем класс flipped и добавляем matched
    // matched в CSS показывает картинку всегда
    card1.element.classList.remove("flipped");
    card2.element.classList.remove("flipped");
    card1.element.classList.add("matched");
    card2.element.classList.add("matched");

    matchedPairs++;
    scoreElement.textContent = matchedPairs;

    // Очищаем массив
    flippedCards = [];
    canFlip = true;

    // Проверяем, закончилась ли игра
    if (matchedPairs === cardImages.length) {
      setTimeout(() => {
        alert(`🎉 Поздравляем! Вы нашли все пары!\nПопыток: ${attempts}`);
      }, 500);
    }
  } else {
    // Не совпали - переворачиваем обратно через секунду
    setTimeout(() => {
      card1.element.classList.remove("flipped");
      card2.element.classList.remove("flipped");

      card1.isFlipped = false;
      card2.isFlipped = false;

      flippedCards = [];
      canFlip = true;
    }, 1000);
  }
}

// Запуск игры при загрузке страницы
document.addEventListener("DOMContentLoaded", initGame);

// Обработчик кнопки перезапуска
restartButton.addEventListener("click", initGame);
