const SHAPES = [
  [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
  ],
];

const COLORS = [
  "#fff",
  "#FF00FF",
  "#16a4d8",
  "#60dbe8",
  "#FF0000",
  "#FFFF00",
  "#008000",
];

const ROWS = 17;
const COLS = 10;

let scoreBoard = document.querySelector("#score");
let canvas = document.querySelector("#tetris");
let ctx = canvas.getContext("2d");
ctx.scale(30, 30); //17(rows)*30(px) = 510px (height of canvas)

let piecesObj = null;
let grid = gridGenrate();
let score = 0;
//console.log(grid);
//  console.log(piecesObj)

//...........Generating random tetris pieces, color
function GenrateRandomPiece() {
  let ran = Math.floor(Math.random() * 6);
  // console.log(SHAPES[ran])
  let piece = SHAPES[ran];
  let colorIndex = ran + 1;
  let x = 4;
  let y = 0;
  return { piece, x, y, colorIndex };
}

//.........To render pieces again and again by timing 500ms
setInterval(newGameState, 500);
function newGameState() {
  checkGrid();
  if (piecesObj == null) {
    piecesObj = GenrateRandomPiece();
    renderPiece();
  }
  MoveDown();
}

//...............checking the filled rows
function checkGrid() {
  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    let filledRow = true;
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == 0) {
        filledRow = false;
      }
    }
    if (filledRow) {
      grid.splice(i, 1); //.........removing the ith row
      grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      count++;
    }
  }
  //......................conditions for score update
  if (count == 1) {
    score += 10;
  } else if (count == 2) {
    score += 30;
  } else if (count == 3) {
    score += 50;
  } else if (count > 3) {
    score += 100;
  }
  scoreBoard.innerHTML = "Score:" + score;
}

//............rendering the random pieces with colors in UI.....
function renderPiece() {
  let piece = piecesObj.piece;
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      if (piece[i][j] == 1) {
        ctx.fillStyle = COLORS[piecesObj.colorIndex];
        ctx.fillRect(piecesObj.x + j, piecesObj.y + i, 1, 1);
      }
    }
  }
}

//.................functions for moving pieces left right.....................
function MoveDown() {
  //   console.log("hello");
  if (!collision(piecesObj.x, piecesObj.y + 1)) piecesObj.y += 1;
  else {
    //.......jab piece collide krega bottom m tb hum uska color fix kr rahe hai grid m.
    for (let i = 0; i < piecesObj.piece.length; i++) {
      for (let j = 0; j < piecesObj.piece[i].length; j++) {
        if (piecesObj.piece[i][j] == 1) {
          let c = piecesObj.x + j;
          let r = piecesObj.y + i;
          grid[r][c] = piecesObj.colorIndex;
        }
      }
    }
    if (piecesObj.y == 0) {
      alert("Game Over");
      grid = gridGenrate();
      score = 0;
    }
    piecesObj = null;
  }
  renderGrid();
}

function moveLeft() {
  if (!collision(piecesObj.x - 1, piecesObj.y))
    //checks if there is not collision
    piecesObj.x -= 1;
  renderGrid();
}

function moveRight() {
  if (!collision(piecesObj.x + 1, piecesObj.y)) piecesObj.x += 1;
  renderGrid();
}

//.............checking if piece is collide or not................
function collision(x, y) {
  let piece = piecesObj.piece;
  for (let i = 0; i < piece.length; i++) {
    for (let j = 0; j < piece[i].length; j++) {
      if (piece[i][j] == 1) {
        let c = x + j;
        let r = y + i;
        if (c >= 0 && c < COLS && r >= 0 && r < ROWS) {
          if (grid[r][c] > 0) {
            return true;
          }
        } else {
          return true;
        }
      }
    }
  }
  return false;
}

//..........Generating grid........
function gridGenrate() {
  let grid = [];
  for (let r = 0; r < ROWS; r++) {
    grid.push([]);
    for (let c = 0; c < COLS; c++) {
      grid[r].push(0);
    }
  }
  return grid;
}

//.........Rendering grid in UI
function renderGrid() {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      ctx.fillStyle = COLORS[grid[r][c]];
      ctx.fillRect(c, r, 1, 1);
    }
  }
  renderPiece(); //after making the perivious piece white we doing renderPiece
}

//...............move pieces from left to right................
document.addEventListener("keydown", (e) => {
  // console.log(e)
  let key = e.code;
  //console.log(key);
  if (key == "ArrowDown") {
    MoveDown();
  } else if (key == "ArrowLeft") {
    moveLeft();
  } else if (key == "ArrowRight") {
    moveRight();
  }
});
let leftButton = document.querySelector(".left");
let rightButton = document.querySelector(".right");

leftButton.addEventListener("click", () => {
  //console.log("Left is active")
  if (!collision(piecesObj.x - 1, piecesObj.y))
    //........................checks if there is not collision
    piecesObj.x -= 1;
  renderGrid();
});

rightButton.addEventListener("click", ()=>{
  //console.log("Right is active")
  if (!collision(piecesObj.x + 1, piecesObj.y)) piecesObj.x += 1;
  renderGrid();
})