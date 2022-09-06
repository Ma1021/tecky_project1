const unitLength = 20;
const strokeColor = 50;
let test = { playRow: 4, playColumn: 5, mineNum: 2 };
let easy = { playRow: 9, playColumn: 9, mineNum: 10 };
let middle = { playRow: 16, playColumn: 16, mineNum: 40 };
let difficult = { playRow: 16, playColumn: 30, mineNum: 99 };
let level = easy;
let board;
let backgroundColor = "#bebebe";
let selectedDiff = document.querySelector("select#difficulty");
let boxCreated = [];
let boxTemplate = document.querySelector(".box");
let boxContainer = document.querySelector(".boxContainer");
// let boxInfo = [];
let mineExist = false;
let neighborNum = 0;
let mineNumCheck = 0;
let resetBtn = document.querySelector("#reset");

// My customize variable
let madeTools = false;

// display: none
let imageCovered = document.querySelector(".covered");
let imageFlag = document.querySelector(".flag");
imageCovered.remove();
imageFlag.remove();
// remove template of box
boxTemplate.remove();

startGame();

selectedDiff.addEventListener("change", () => {
  console.log("change");
  console.log(selectedDiff.value);
  switch (selectedDiff.value) {
    case "easy":
      level = easy;
      startGame();
      break;
    case "middle":
      level = middle;
      startGame();
      break;
    case "difficult":
      level = difficult;
      startGame();
      break;
    default:
      console.log("Wrong level");
      break;
  }
});

function startGame() {
  boxCreated = [];
  boxContainer.textContent = "";
  for (let x = 0; x < level.playRow; x++) {
    boxCreated[x] = document.createElement("div");
    boxCreated[x].classList.add("row");
    boxContainer.appendChild(boxCreated[x]);

    // create and store information of box
    // boxInfo[x] = [];
    for (let y = 0; y < level.playColumn; y++) {
      boxCreated[x][y] = boxTemplate.cloneNode(true);
      // boxCreated[x][y].textContent = `${x}${y}`;
      boxCreated[x].appendChild(boxCreated[x][y]);
      let img = imageCovered.cloneNode(true);
      boxCreated[x][y].appendChild(img);
      // make sure to add back the picture after adding neighbor and clicked
      // boxCreated[x][y].appendChild(image);

      // store information
      // boxInfo[x][y] = { mine: mineExist, neighbor: neighborNum };
    }
  }

  createMine();
  checkMine();
  checkPlay();
}
function createMine() {
  // randomly make mine ?????????????????? probability????????????????
  // How to get all of them generated without being too much// too less????
  mineNumCheck = 0;
  while (mineNumCheck < level.mineNum) {
    for (let x = 0; x < level.playRow; x++) {
      for (let y = 0; y < level.playColumn; y++) {
        if (mineNumCheck >= level.mineNum) {
          break;
        }
        if (
          Math.random() < level.mineNum / (level.playColumn * level.playRow)
            ? true
            : false
        ) {
          if (!boxCreated[x][y].classList.contains("mine")) {
            boxCreated[x][y].classList.add("mine");
            // boxInfo[x][y].mine = true;
            mineNumCheck++;
          }
        }
      }
    }
  }
}

// check neighbor
function checkMine() {
  for (let x = 0; x < level.playRow; x++) {
    for (let y = 0; y < level.playColumn; y++) {
      let neighborMineNum = 0;
      let currentBox = boxCreated[x][y];
      if (!currentBox.classList.contains("mine")) {
        for (let i of [-1, 0, 1]) {
          for (let j of [-1, 0, 1]) {
            if (
              (i == 0 && j == 0) ||
              x + i < 0 ||
              y + j < 0 ||
              x + i == level.playRow ||
              y + j == level.playColumn
            ) {
              continue;
            }

            let mineNeighbor =
              boxCreated[(x + i + level.playRow) % level.playRow][
                (y + j + level.playColumn) % level.playColumn
              ];

            // really count the number neighbor mine
            if (mineNeighbor.classList.contains("mine")) {
              neighborMineNum += 1;
            }
          }
        }

        // adding neighbor background
        switch (neighborMineNum) {
          case 0:
            currentBox.classList.add("pressed");
            break;
          case 1:
            currentBox.classList.add("one");
            currentBox.classList.add("num");
            break;
          case 2:
            currentBox.classList.add("two");
            currentBox.classList.add("num");
            break;
          case 3:
            currentBox.classList.add("three");
            currentBox.classList.add("num");
            break;
          case 4:
            currentBox.classList.add("four");
            currentBox.classList.add("num");
            break;
          case 5:
            currentBox.classList.add("five");
            currentBox.classList.add("num");
            break;
          case 6:
            currentBox.classList.add("six");
            currentBox.classList.add("num");
            break;
          case 7:
            currentBox.classList.add("seven");
            currentBox.classList.add("num");
            break;
          case 8:
            currentBox.classList.add("eight");
            currentBox.classList.add("num");
            break;
          default:
            console.log("error on neighbor creating");
            break;
        }
      }
    }
  }
}

// when user click the div
function checkPlay() {
  for (let x = 0; x < level.playRow; x++) {
    for (let y = 0; y < level.playColumn; y++) {
      let currentBox = boxCreated[x][y];

      // prevent context menu popping up
      currentBox.addEventListener("contextmenu", (e) => e.preventDefault());

      currentBox.addEventListener("mousedown", function (event) {
        if (event.button == 2) {
          currentBox.textContent = "";
          // add flag when right click
          if (event.target.className == "covered") {
            let flag = imageFlag.cloneNode(true);
            currentBox.appendChild(flag);
            currentBox.classList.add("flag");
            // remove flag when right click
          } else if (event.target.className == "flag") {
            let cover = imageCovered.cloneNode(true);
            currentBox.appendChild(cover);
            currentBox.classList.remove("flag");
          }
        }

        if (event.button == 0) {
          console.log("left");
          // if flag already exist -> not allow to pressed
          if (currentBox.classList.contains("flag")) {
            return;
          }
          currentBox.textContent = "";
          // if player step on mine
          if (currentBox.classList.contains("mine")) {
            showMessage("BOOMMMMM");
            reset();
            return;
          } // if player step on number
          else if (currentBox.classList.contains("num")) {
            currentBox.textContent = "";
            currentBox.classList.add("safe");
            if (checkWin()) {
              showMessage("YOU WIN!!!!");
              window.location.href = "./homepage/index.html";
              reset();
              return;
            }
          } else if (currentBox.classList.contains("pressed")) {
            currentBox.textContent = "";
            currentBox.classList.add("safe");
            // check if surrounding elements is also pressed
            function findPress(x, y) {
              for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                  if (
                    (i == 0 && j == 0) ||
                    x + i < 0 ||
                    y + j < 0 ||
                    x + i >= level.playRow ||
                    y + j >= level.playColumn
                  ) {
                    continue;
                  }
                  let pressBox = boxCreated[x + i][y + j];

                  // something wrong here : not align with definition in js
                  // console.log(pressBox.textContent);
                  if (pressBox.innerHTML == "") {
                    continue;
                  }
                  // with num or pressed as class
                  if (!pressBox.classList.contains("mine")) {
                    pressBox.textContent = "";
                    pressBox.classList.add("safe");
                    if (checkWin()) {
                      showMessage("YOU WIN!!!");
                      window.location.href = "./homepage/index.html";
                      reset();
                      return;
                    }
                  } // with mine as class
                  else {
                    continue;
                  }
                  // if the pressed Box is num (end of the chain)
                  // if the pressed Box is empty (end of the chain)
                  if (
                    pressBox.innerHTML == "" &&
                    pressBox.classList.contains("num")
                  ) {
                    // Still don't know why it is not return but at least it works
                    // return;
                    continue;
                  }

                  // try to findPress on the others
                  findPress(x + i, y + j);
                }
              }
            }
            findPress(x, y);
          }
        }
      });
    }
  }
}

function showMessage(msg) {
  window.alert(msg);
}

// check if the pressed div number is same with total - mine number
function checkWin() {
  let countSafe = level.playColumn * level.playRow - level.mineNum;
  console.log(countSafe, "check win inside");
  for (let x = 0; x < level.playRow; x++) {
    for (let y = 0; y < level.playColumn; y++) {
      if (boxCreated[x][y].classList.contains("safe")) {
        countSafe -= 1;
      }
      if (countSafe == 1) {
        return true;
      }
      console.log(countSafe);
    }
  }
  return false;
}

function reset() {
  for (let x = 0; x < level.playRow; x++) {
    for (let y = 0; y < level.playColumn; y++) {
      boxCreated[x][y].classList = "box";
    }
  }
  startGame();
}

resetBtn.addEventListener("click", (e) => reset());

// dark light mode
let modeContainer = document.querySelector("#containerWholeMine");
console.log(modeContainer);
let mode = document.querySelector("#mode");
mode.addEventListener("click", (e) => {
  if (mode.textContent == "dark") {
    modeContainer.classList.add("darkModeLife");
    console.log(modeContainer.classList);
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
      if (e.target.value == "game of life") {
        window.location.href = "./gameOfLife.html";
      }
    });
  } else {
    secret.classList.add("hidden");
  }
});
