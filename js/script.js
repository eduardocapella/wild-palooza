// Elements

// Main areas
let introScreen = document.getElementById('intro');
let board = document.getElementById('board');

// Buttons
let setPlayerName = document.getElementById('setPlayerName');
let savePlayerName = document.getElementById('savePlayerName');
let startButton = document.getElementById('start');
let restartButton = document.getElementById('restartButton');
let btnGroup = document.getElementById('settingsLevel');

// Interface
let displayLevel = document.getElementById('displayLevel');
let displayScore = document.getElementById('displayScore');
let displayAttempts = document.getElementById('displayAttempts');
let rightOrWrongStats = document.getElementById('rightOrWrongStats');
let sidebar = document.getElementById('sidebar');

let part1 = document.getElementById('part1');
let part2 = document.getElementById('part2');

let playerName = document.getElementById('playerName');
let playerNameClass = document.querySelector('.playerName');

let imgPath = 'img';

/**
 * Settings object
 * level: string (easy 4, normal 6, hard 8, very hard 12)
 * cards: number
 * backOfCard: string
 */
let settings = {
  level: 'Normal',
  cards: '',
  backOfCard: imgPath + '/back-of-card.webp',
};

/**
 * Player object
 * name: string
 * attempts: array
 * score: number
 */
let player = {
  name: '',
  attempts: [],
  score: 0,
}


/**
 * Array of objects with the path of the cards
 * url: string
 * id: number
 */
 let cardsPaths = [
  { url: imgPath + '/crazy-frodog.webp', id: 1 },
  { url: imgPath + '/jack-papagai.webp', id: 2 },
  { url: imgPath + '/kitty-teeth.webp', id: 3 },
  { url: imgPath + '/pangare.webp', id: 4 },
  { url: imgPath + '/professor-llama.webp', id: 5 },
  { url: imgPath + '/crazy-froad.webp', id: 6 },
  { url: imgPath + '/banana-wizard.webp', id: 7 },
  { url: imgPath + '/popop-star.webp', id: 8 },
  { url: imgPath + '/corujasusto.webp', id: 9 },
  { url: imgPath + '/donatella.webp', id: 10 },
  { url: imgPath + '/esquiando.webp', id: 11 },
  { url: imgPath + '/girata.webp', id: 12 },
  { url: imgPath + '/muuito-estilo.webp', id: 13 },
  { url: imgPath + '/liao.webp', id: 14 }
]

function gameSetup() {

  settings = {
    level: 'normal',
    cards: '',
    backOfCard: imgPath + '/back-of-card.webp',
  };
  
  player = {
    name: '',
    attempts: [],
    score: 0,
  }

  document.getElementById('part1').classList.remove('hidden');
  document.getElementById('part2').classList.add('hidden');
  sidebar.classList.add('hidden');

  board.innerHTML = '';

  updateScore(player.score);
  updateAttempts();
  removeLevelButtonsClass();

  document.querySelector('button[value="Normal"]').classList.add('selected');
  settings.level = 'Normal';

  verifyPlayerName();
}

// gameSetup();
setPlayerName.focus();


// Eventos
setPlayerName.addEventListener('keyup', function() {
  verifyPlayerName();
});

savePlayerName.addEventListener('click', function() {
  player.name = setPlayerName.value;

  playerName.textContent = player.name;
  playerNameClass.textContent = player.name;

  part1.classList.add('hidden');
  part2.classList.remove('hidden');
});

document.getElementById('start').addEventListener('click', function() {
  introScreen.classList.add('hidden');
  
  clearTimer();
  formatTime(elapsedTime);
  updateTimer();
  
  sidebar.classList.remove('hidden');
  
  // Começa a contar o tempo
  timerInterval = setInterval(updateTimer, 1000);
});

startButton.addEventListener('click', function() {
  introScreen.classList.add('hidden');
  setLevel(settings.level);
  console.log('settings.level', settings.level);
});

btnGroup.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', function() {
    removeLevelButtonsClass();
    this.classList.add('selected');
    console.log('this.value', this.value);
    settings.level = this.value;
    verifyPlayerName();
  });
});

restartButton.addEventListener('click', function() {
  this.classList.add('hidden');
  introScreen.classList.remove('hidden');
  rightOrWrongStats.innerHTML = '';

  gameSetup();
});




function verifyPlayerName() {
  if (setPlayerName.value !== '') {
    savePlayerName.classList.remove('hidden');
  } else {
    savePlayerName.classList.add('hidden');
  }
}
verifyPlayerName();


let matches = [];
let openCards = [];
let gameCardsPaths = [];
// let attempts = [];


function updateScore(param) {
  displayScore.textContent = param;
}

function updateAttempts() {
  displayAttempts.textContent = player.attempts.length;
}


function removeLevelButtonsClass() {
  btnGroup.querySelectorAll('button').forEach(btn => {
    btn.classList.remove('selected');
  });
}




function setLevel(level) {
  console.log('setLevel called', level);
  settings.level = level;

  switch (level) {
    case 'Easy':
      settings.cards = 4;
      break;
    case 'Normal':
      settings.cards = 6;
      break;
    case 'Hard':
      settings.cards = 8;
      break;
    case 'Very-Hard':
      settings.cards = 12;
      break;
  }
  
  displayLevel.textContent = settings.level;
  setPack(settings.cards);
}



function setPack(numberOfCards) {
  // Função para embaralhar um array
  function shuffleArray(array) {
    let count = 0;
    for (let i = cardsPaths.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // console.log('i', i);
      // console.log('j', j);
      // console.log([array[i], array[j]] = [array[j], array[i]]);
      // algoritmo de Fisher-Yates para garantir que os elementos do array sejam embaralhados de forma aleatória.
      [array[i], array[j]] = [array[j], array[i]];
      // PHP function list
      if(count == numberOfCards) {
        break;
      }
    }
    return array;
  }

  // Embaralha o array cardsPaths
  let shuffledCardsPaths = shuffleArray([...cardsPaths]);

  // Seleciona os primeiros 4 itens do array embaralhado
  gameCardsPaths = shuffledCardsPaths.slice(0, settings.cards);

  sortCards();
}

function sortCards() {
  let cards = gameCardsPaths.concat(gameCardsPaths);
  cards.sort(() => Math.random() - 0.5);
  console.log('cards', cards);
  console.log('gameCardsPaths', gameCardsPaths);
  // return cards;
  
  let ulSortedCards = document.createElement('ul');
  ulSortedCards.classList.add('level-' + settings.level.toLowerCase());
  ulSortedCards.id = 'sorted-cards';

  board.append(ulSortedCards);

  cards.forEach((card, index) => {
    // sets <li>
    let ulSortedCardsLi = document.createElement('li');
    ulSortedCardsLi.classList.add('card');
    ulSortedCardsLi.id = `card-${index + 1}`;
    
    // sets <img>
    let ulSortedCardsLiImg = document.createElement('img');
    // ulSortedCardsLiImg.src = card.url;
    ulSortedCardsLiImg.src = settings.backOfCard;
    ulSortedCardsLiImg.alt = `Card ${index + 1}`;

    // append elements
    ulSortedCardsLi.append(ulSortedCardsLiImg);
    ulSortedCards.append(ulSortedCardsLi);

    ulSortedCardsLi.addEventListener('click', function(e) {
      // console.log('click');

      ulSortedCardsLiImg.src = card.url;
      matches.push(card.id);
      openCards.push(document.getElementById(`card-${index + 1}`));

      // attempts[gameRound] = card.id;
      player.attempts.push(card.id);
      // console.log('player.attempts', player.attempts);

      this.classList.add('open');

      verifyMatch(ulSortedCardsLiImg.src);

    });
  });
}
// sortCards();

function verifyMatch( imgPath ) {
  // console.log('matches', matches);
  // console.log('openCards', openCards);

  let sortedCards = document.getElementById('sorted-cards');
  let cards = sortedCards.querySelectorAll('.card:not(.matched)');


  if (matches.length === 2) {
    if (matches[0] === matches[1]) {

      openCards.forEach(card => {
        card.classList.add('matched');
        card.classList.remove('open');
      });

      player.score++;
      updateScore(player.score);

      let matchedCard = gameCardsPaths.find( (element) => element.value = matches[1] );
      // console.log('matchedCard', matchedCard);
      let img = document.createElement('img');
      img.src = imgPath;
      
      rightOrWrong(1);

    } else {

      rightOrWrong(0);

      cards.forEach(card => {
        card.classList.add('onwait');
      });

      setTimeout(() => {
        cards.forEach(card => {
          let img = card.querySelector('img');
          img.src = settings.backOfCard;
          card.classList.remove('open');
          card.classList.remove('onwait');
        });
      }, 1000);
    }
    
    
    let lastTwo = player.attempts.splice(player.attempts.length - 2, 2);
    player.attempts.push(lastTwo);
    // console.log('player.attempts', player.attempts);

    updateAttempts();

    matches = [];
    openCards = [];

    console.log('player', player);
  }
  
  checkEndGame();
}


function rightOrWrong(value) {
  let li = document.createElement('li');
  let img = document.createElement('img');
  
  if (value === 1) {
    img.src = 'img/right.png';
  } else {
    img.src = 'img/wrong.png';
  }
  
  li.append(img);
  rightOrWrongStats.append(li);
}


function checkEndGame() {
  if (player.score === settings.cards) {
    stopTimer();
    restartButton.classList.remove('hidden');
  }
}


// Inicializa o tempo decorrido
let elapsedTime = 0;
let timerInterval;


// Função para formatar o tempo em minutos e segundos
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
function clearTimer() {
  elapsedTime = 0;
}

// Função para atualizar o temporizador
function updateTimer() {
  elapsedTime++;
  document.getElementById('timer').textContent = formatTime(elapsedTime);
}

// Função para parar o temporizador
function stopTimer() {
  clearInterval(timerInterval);
}

// Adiciona evento ao botão para parar o temporizador
// document.getElementById('stopButton').addEventListener('click', stopTimer);


