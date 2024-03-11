const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const info = document.getElementById('info-msg');
const allSquares = document.querySelectorAll('.square');

let characterMoving = false;

const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
]

for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[i].length; j++) {
    gameContainer.innerHTML +=
      map[i][j] === 1 
      ? `<div class="wall square" id="s-${i + 1}-${j + 1}"></div>`
      : `<div class="open square" id="s-${i + 1}-${j + 1}"></div>`;
  }
}


const openSquares = document.querySelectorAll('.open');
let playerPosition = document.getElementById('s-4-4');

gameContainer.addEventListener('click', (event) => {
  const clickedSquare = event.target;
  
  if (clickedSquare.classList.contains('open') && !characterMoving) {
    characterMoving = true;
    info.textContent = 'The player is moving...';
    openSquares.forEach((square) => square.classList.remove('goal-square'));
    clickedSquare.classList.toggle('goal-square');

    const movePath = createMovePath(clickedSquare);
    movePlayer(movePath);
  } else if (characterMoving) {
    alert('Please wait.');
  } else {
    alert('This wall is too solid!');
  }
});


function createMovePath(destination) {
  const startSquare = playerPosition;
  let queue = [startSquare];
  let visited = new Set([startSquare])
  let parent = [];

  while (queue.length > 0) {
    const currentSquare = queue.shift();

    if (currentSquare.id === destination.id) {
      let shortestPath = [];
      
      parent.reverse();

      const filteredPath = [...new Set(parent).values()];
      filteredPath.unshift(destination.id);

      let compareSquare = filteredPath[0];
      let compareRow;
      let compareCol;

      for (let i = 1; i < filteredPath.length - 1; i++) {
        [, compareRow, compareCol] = compareSquare.split('-').map(Number);

        if (filteredPath[i] === `s-${compareRow}-${compareCol + 1}` || filteredPath[i] === `s-${compareRow}-${compareCol - 1}` || filteredPath[i] === `s-${compareRow + 1}-${compareCol}` || filteredPath[i] === `s-${compareRow - 1}-${compareCol}`) {
          compareSquare = filteredPath[i];           
        } else {
          filteredPath.splice(i, 1);
          i--;
        }
      }

      shortestPath = filteredPath.reverse();
      return shortestPath;
    }

    const adjacentOpenSquares = checkAdjacentSquares(currentSquare).filter((adjSquare) => adjSquare.classList.contains('open'));

    for (let i = 0; i < adjacentOpenSquares.length; i++) {
      if (!visited.has(adjacentOpenSquares[i])) {
        queue.push(adjacentOpenSquares[i]);
        visited.add(adjacentOpenSquares[i]);
        parent.push(currentSquare.id);
      }
    }
  }
  console.log('Target square not found!')
  return false;
}


function movePlayer(idPath) {
  let index = 0;

  const intervalId = setInterval(() => {
    if (idPath.length > 1) {
      const [, row, col] = idPath[0].split('-').map(Number);
      const [, nextRow, nextCol] = idPath[1].split('-').map(Number);

      if (nextRow === row - 1) {
        move('top', '-');                     // UP
        console.log('moving up');
      } else if (nextRow === row + 1) {
        move('top', '+');                     // DOWN
        console.log('moving down');
      } else if (nextCol === col - 1) {
        move('left', '-');                    // LEFT
        console.log('moving left');
      } else if (nextCol === col + 1) {
        move('left', '+');                    // RIGHT
        console.log('moving right');
      } else {
        alert('Error, please contact the developer.');
        return;
      }

      idPath.splice(index, 1);
    } else {
      clearInterval(intervalId);
      playerPosition = document.getElementById(idPath[0]);
      idPath = [];
      characterMoving = false;
      info.textContent = 'Success!';
      return;
    }
  }, 255);
}

function checkAdjacentSquares(clickedSquare) {
  const clickedSquareId = clickedSquare.id;
  const [, row, col] = clickedSquareId.split('-').map(Number);

  const adjacentElements = [
    {
      row: row - 1,     // Above
      col
    },
    {
      row: row + 1,     // Below
      col
    },
    {
      row,              // Left
      col: col - 1,
    },
    {
      row,              // Right
      col: col + 1
    }
  ];

  const validAdjacentElements = adjacentElements.filter(adj => adj.row >= 1 && adj.row <= 15 && adj.col >= 1 && adj.col <= 15);

  const validAdjacentIds = validAdjacentElements.map(adj => `s-${adj.row}-${adj.col}`);
  const adjacentElementsArray = validAdjacentIds.map(id => document.getElementById(id));

  return adjacentElementsArray;
}

function move(property, operator) {
  let i = 0;
  let interval;
  const operators = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
  };

  const operation = operators[operator];

  if (!operation) {
    console.error('Invalid operator: ', operator);
    return undefined;
  }

  interval = setInterval(() => {
    player.style[property] = operation(parseInt(player.style[property] || 0, 10), 1) + 'px';
    if (++i >= 51) {
      clearInterval(interval);
      return;
    }
  }, 5)
}

window.addEventListener('resize', () => {
  if (window.innerWidth < 800) {
    info.textContent = 'Please increase your window size to play.';
  } else {
    info.textContent = 'Click an open square to move the player.';
  }
});
