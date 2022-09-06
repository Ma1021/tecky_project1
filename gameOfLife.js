const unitLength = 20;
const boxColor = 150;
const strokeColor = 50;
let columns; /* To be determined by window width <-- determined by width of the container and unitLength */
let rows; /* To be determined by window height <-- determined by height of the container and unitLength */
let board;

// My customize variable
let madeTools = false;
// slide
let fr = 1;
let slider;
let colorPickerCust;

// check dark mode light mode
let modeContainer = document.querySelector("#containerWhole");

let colorButtonObj = {
  red: "#e61b1b",
  orange: "#ffaa00",
  yellow: "#ffe600",
  green: "#26e600",
  blue: "#004de6",
  purple: "#6600cc",
};

let colorSelected = [100, 100, 100, 255];

let colorButtons = document.querySelectorAll(".colorPick");

// resizing bool
let shouldNotGenerate = true;

// survive and die
let survive;
let over;
let lone;

// game container
let canvasContainer = document.querySelector("#canvas");

function setup() {
  //   slider.position(windowWidth - width, windowHeight - height);
  // make slider
  if (!madeTools) {
    slider = createSlider(1, 10, 1, 1);
    slider.parent("#frameRSlider");
    fr = slider.value();
    document.querySelector("#frameR > span").textContent = fr;
    survive = createSelect();
    over = createSelect();
    lone = createSelect();
    survive.parent(document.querySelector("#rulesSurvive"));
    over.parent(document.querySelector("#rulesOver"));
    lone.parent(document.querySelector("#rulesLone"));
    for (let i = 1; i < 9; i++) {
      survive.option(i);
      over.option(i);
      lone.option(i);
    }
    survive.selected(3);
    over.selected(3);
    lone.selected(2);

    colorPickerCust = createColorPicker(100, 100);
    colorPickerCust.parent("#colorCust");

    madeTools = true;
  }
  /* Set the canvas to be under the element #canvas*/
  // System Variable: get the windowWidth/ windowHeight while window.onload
  let rect = canvasContainer.getBoundingClientRect();
  const canvas = createCanvas(rect.width, rect.height);
  canvas.parent(document.querySelector("#canvas"));

  /*Calculate the number of columns and rows */
  // width = width of canvas
  // from left to right, how many squares
  columns = floor(width / unitLength);
  // height = height of canvas
  // from top to bottom, how many squares
  rows = floor(height / unitLength);

  /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
  board = [];
  // put the square of first row to an array
  for (let i = 0; i < columns; i++) {
    board[i] = [];
  }

  // create :
  /* [[, , ,],
    [, , ,],
    [, , , ]] */
  // Now both currentBoard and nextBoard are array of array of undefined values.
  init(); // Set the initial values of the currentBoard and nextBoard
}

/**
 * Initialize/reset the board state
 */
function init() {
  // set value stored in each box <-- default lifeless
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      createBox(i, j);
    }
  }
  noLoop();
}

/**
 * Resize the canvas when window size resize
 */
function windowResized() {
  // check if the box was newly created
  let rect = canvasContainer.getBoundingClientRect();
  resizeCanvas(rect.width, rect.height);

  columns = floor(width / unitLength);
  rows = floor(height / unitLength);

  // if board already exist => keep it
  // if board was newly draw => assign a life to it
  for (let i = 0; i < columns; i++) {
    if (!board[i]) {
      board[i] = [];
    }
    for (let j = 0; j < rows; j++) {
      if (!board[i][j]) {
        createBox(i, j);
      }
    }
  }
  draw();
  shouldNotGenerate = true;
}

function createBox(x, y) {
  let zero = 255;
  return (board[x][y] = {
    current: false,
    next: false,
    count: 0,
    rgba_a_current: 255,
    rgba_a_next: 255,
    rgba_r_current: zero,
    rgba_r_next: zero,
    rgba_g_current: zero,
    rgba_g_next: zero,
    rgba_b_current: zero,
    rgba_b_next: zero,
  });
}

/**
 * Visualized the boxes inside the box
 */

function draw() {
  // cardboard canvas background color
  // white background color (255)
  if (modeContainer.className == "darkModeLife") {
    background(255);
  } else {
    background(0, 0, 0, 255);
  }
  if (!shouldNotGenerate) {
    generate();
  }
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      if (board[i][j].current == true) {
        // if life, box color
        fill(
          board[i][j].rgba_r_current,
          board[i][j].rgba_g_current,
          board[i][j].rgba_b_current,
          board[i][j].rgba_a_current
        );
      } else {
        // if die, box color
        // transparent
        fill(0, 0, 0, 0);
      }
      // color of the border
      stroke(strokeColor);
      // draw the border of the box
      // x location of the box, y location of the box, width of the box
      rect(i * unitLength, j * unitLength, unitLength, unitLength);
    }
  }
  // smaller , slower
  fr = slider.value();
  frameRate(fr);
  // show framerate
}

function generate() {
  // smaller , slower
  fr = slider.value();
  frameRate(fr);
  // show framerate
  //Loop over every single box on the board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      // Count all living members in the Moore neighborhood(8 boxes surrounding)
      let neighbors = 0;
      let currentBox = board[x][y];
      if (currentBox.count == 1) {
        currentBox.rgba_a_next = 0;
        currentBox.rgba_r_next = 0;
        currentBox.rgba_b_next = 0;
        currentBox.rgba_g_next = 0;
      }

      for (let i of [-1, 0, 1]) {
        for (let j of [-1, 0, 1]) {
          if (i == 0 && j == 0) {
            // the cell itself is not its own neighbor
            continue;
          }
          // The modulo operator is crucial for wrapping on the edge

          // warning!!!!!!!!!!!!!!!!!
          let neighborhoodAlive =
            board[(x + i + columns) % columns][(y + j + rows) % rows];

          if (neighborhoodAlive.current == true) {
            // calculate the color

            currentBox.rgba_a_next =
              currentBox.rgba_a_next + neighborhoodAlive.rgba_a_current;
            currentBox.rgba_r_next =
              currentBox.rgba_r_next + neighborhoodAlive.rgba_r_current;
            currentBox.rgba_b_next =
              currentBox.rgba_b_next + neighborhoodAlive.rgba_b_current;
            currentBox.rgba_g_next =
              currentBox.rgba_g_next + neighborhoodAlive.rgba_g_current;
            // check neighbors
            neighbors += 1;
          }
        }
      }

      // rgba / number of neighbor
      if (neighbors > 0) {
        currentBox.rgba_a_next =
          currentBox.rgba_a_next /
          (neighbors + (currentBox.count == 1 ? 0 : 1));
        currentBox.rgba_r_next =
          currentBox.rgba_r_next /
          (neighbors + (currentBox.count == 1 ? 0 : 1));
        currentBox.rgba_b_next =
          currentBox.rgba_b_next /
          (neighbors + (currentBox.count == 1 ? 0 : 1));
        currentBox.rgba_g_next =
          currentBox.rgba_g_next /
          (neighbors + (currentBox.count == 1 ? 0 : 1));
      }

      currentBox.rgba_a_next *= 0.9;
      if (currentBox.rgba_a_next < 100) {
        currentBox.rgba_a_next = 100;
      }
      // Rules of Life
      // customized by the number user given
      let overNum = over.value();
      let surviveNum = survive.value();
      let loneNum = lone.value();
      if (board[x][y].current == true && neighbors < loneNum) {
        // Die of Loneliness
        board[x][y].next = false;
        board[x][y].count = 0;
      } else if (board[x][y].current == true && neighbors > overNum) {
        // Die of Overpopulation
        board[x][y].next = false;
        board[x][y].count = 0;
      } else if (board[x][y].current == false && neighbors == surviveNum) {
        // New life due to Reproduction
        board[x][y].next = true;
        board[x][y].count += 1;

        // when born, should be no transparency
        board[x][y].rgba_a_next = 255;
      } else {
        // Stasis
        // whether live = live or die = die
        board[x][y].next = board[x][y].current;
      }
    }
  }

  // after updating they as next
  // put update the current to the next
  // Swap the nextBoard to be the current Board
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      board[x][y].current = board[x][y].next;
      board[x][y].rgba_a_current = board[x][y].rgba_a_next;
      board[x][y].rgba_r_current = board[x][y].rgba_r_next;
      board[x][y].rgba_b_current = board[x][y].rgba_b_next;
      board[x][y].rgba_g_current = board[x][y].rgba_g_next;
    }
  }
}

/**
 * When mouse is dragged
 */
function mouseDragged() {
  /**
   * If the mouse coordinate is outside the board
   */
  // mouseX = the current horizontal position of the mouse
  // mouseY = the current vertical position of the mouse
  if (
    mouseX > unitLength * columns ||
    mouseY > unitLength * rows ||
    mouseX < 0 ||
    mouseY < 0
  ) {
    return;
  }
  // index of the box moused pressed
  const x = Math.floor(mouseX / unitLength);
  const y = Math.floor(mouseY / unitLength);
  board[x][y].current = true;
  fill(colorSelected[0], colorSelected[1], colorSelected[2], colorSelected[3]);
  board[x][y].rgba_r_current = colorSelected[0];
  board[x][y].rgba_g_current = colorSelected[1];
  board[x][y].rgba_b_current = colorSelected[2];
  board[x][y].rgba_a_current = colorSelected[3];

  rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
 * When mouse is pressed
 */
function mousePressed(event) {
  if (event.buttons == 1) {
    mouseDragged();
    noLoop();
  }
}

function mouseReleased() {
  noLoop();
  fr = slider.value();
  document.querySelector("#frameR > span").textContent = fr;

  //   shouldNotGenerate = false;
}

document.querySelector("#reset").addEventListener("click", function () {
  shouldNotGenerate = true;
  init();
  draw();
});

document.querySelector("#start").addEventListener("click", function () {
  shouldNotGenerate = false;
  loop();
});

document.querySelector("#pause").addEventListener("click", function () {
  noLoop();
});

for (let colorButton of colorButtons) {
  colorButton.addEventListener("click", (event) => {
    switch (colorButton.id) {
      case "colorRed":
        colorSelected = [230, 27, 27, 255];
        console.log("color selected:", colorSelected);
        break;
      case "colorOrange":
        colorSelected = [255, 170, 0, 255];
        break;
      case "colorYellow":
        colorSelected = [255, 230, 0, 255];
        break;
      case "colorGreen":
        colorSelected = [38, 230, 0, 255];
        break;
      case "colorBlue":
        colorSelected = [0, 77, 230, 255];
        break;
      case "colorPurple":
        colorSelected = [102, 0, 204, 255];
        break;
      case "colorCust":
        colorButton.addEventListener("change", () => {
          colorSelected = [
            colorPickerCust.color().levels[0],
            colorPickerCust.color().levels[1],
            colorPickerCust.color().levels[2],
            colorPickerCust.color().levels[3],
          ];
          console.log(colorSelected);
        });
        break;
      default:
        console.log("no color selected");
        colorSelected = [100, 100, 100, 00];
        break;
    }
  });
}

// change mode
let mode = document.querySelector("#mode");
mode.addEventListener("click", (e) => {
  if (mode.textContent == "dark") {
    modeContainer.classList.add("darkModeLife");
    mode.textContent = "light";
    draw();
  } else {
    modeContainer.classList.remove("darkModeLife");
    mode.textContent = "dark";
    draw();
  }
});

let changeGame = document.querySelector("#changeGame");
let secret = document.querySelector("#secret");

changeGame.addEventListener("click", (e) => {
  if (secret.className == "hidden") {
    secret.classList.remove("hidden");
    secret.addEventListener("input", (e) => {
      if (e.target.value == "minesweeper") {
        window.location.href = "./minesweeper.html";
      }
    });
  } else {
    secret.classList.add("hidden");
  }
});
