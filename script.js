// References
const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let movesCount = 0;
let winCount = 0;
let seconds = 0;
let minutes = 0;
let firstCardValue;
let secondCardValue;

// Items array
const items = [
  { name: "bee", image: "img/Bear.png" },
  { name: "crocodile", image: "img/Deer.png" },
  { name: "macaw", image: "img/Elephant.png" },
  { name: "gorilla", image: "img/Fox.png" },
  { name: "tiger", image: "img/Giraffe.png" },
  { name: "monkey", image: "img/Koala.png" },
  { name: "chameleon", image: "img/Lion.png" },
  { name: "piranha", image: "img/Monkey.png" },
  { name: "anaconda", image: "img/Panda.png" },
  { name: "sloth", image: "img/Rhinoceros.png" },
  { name: "cockatoo", image: "img/Tiger.png" },
  { name: "toucan", image: "img/Zebra.png" },
];

// Function to generate random items
const generateRandom = (size = 4) => {
  let tempArray = [...items];
  let cardValues = [];
  size = (size * size) / 2;
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

// Function to generate game matrix
const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img with="100px" height="100px"src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched")) {
        card.classList.add("flipped");
        if (!firstCard) {
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          movesCounter();
          secondCard = card;
          secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = false;
            winCount += 1;
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

// Function to count moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

// Function to generate time
const timeGenerator = () => {
  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

// Function to start the game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  interval = setInterval(timeGenerator, 1000);
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();

  // Adding timeout to end the game after 1 minute
  setTimeout(() => {
    stopGame();
    result.innerHTML = "<h2>Game Over</h2>";
  }, 60000);
});

// Function to stop the game
stopButton.addEventListener("click", () => {
  restartGame();
  result.innerHTML = "<h2>Game Over</h2>";
});

// Function to initialize the game
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  matrixGenerator(cardValues);
  stopButton.style.display = "block"; // Show the stop button
};


// Function to stop the game
const stopGame = () => {
  controls.classList.remove("hide");
  
  //stopButton.style.display = "none"; // Hide the stop button
  startButton.classList.remove("hide");
  clearInterval(interval);
  cards.forEach((card) => {
    card.classList.remove("flipped");
    stopButton.classList.add("hide");
  });
};



// Function to restart the game
const restartGame = () => {
  stopGame(); // Stop the current game if it's running
  
  // Reset all variables to their initial values
  firstCard = false;
  secondCard = false;
  movesCount = 0;
  winCount = 0;
  seconds = 0;
  minutes = 0;
  clearInterval(interval);
  
  // Initialize the game again
  initializer();
};
