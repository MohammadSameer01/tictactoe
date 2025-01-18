let boxes = document.querySelectorAll(".box");
let userOneTurn = true;
let gameIndex = 0;
let isGameWon = false;

let modal = document.querySelector(".WinnermodalContainer");

let playerOneSound = new Audio("assets/sounds/playerOne.mp3");
let playerTwoSound = new Audio("assets/sounds/playerTwo.mp3");
let gameOverSound = new Audio("assets/sounds/gameOver.mp3");
let gameDrawSound = new Audio("assets/sounds/gameDraw.mp3");
let cleanSound = new Audio("assets/sounds/cleanSound.mp3");

//
let soundCnt = document.querySelector(".soundCnt");
let isSoundOn = false;

let winningLineCnt = document.querySelector(".winningLineCnt");
let winLine = document.querySelector(".winningLine");

//
//
//
//
//
//
//
// Initialize Players and Handle Local Storage
let playerOne = {
  name: "Player1",
  bio: "I thrive on strategy, focusing on the center and corners. I love creating multiple winning paths and never hesitate to make a bold move. Tic Tac Toe is my game — I’m always ready to outsmart my opponent.",
  icon: "X",
  color: "#FF0000",
  winCount: 0,
};
let playerTwo = {
  name: "Player2",
  bio: "I play patiently, waiting for the perfect moment to strike. I enjoy exploiting my opponent’s mistakes and using every opportunity to take control. I may not move first, but I always think ahead to win.",
  icon: "O",
  color: "#ffff00",
  winCount: 0,
};
playerOne.textColor = getTextColor(playerOne.color);
playerTwo.textColor = getTextColor(playerTwo.color);

// Retrieve players from local storage or set defaults
function loadPlayersFromStorage() {
  const storedPlayerOne = JSON.parse(localStorage.getItem("playerOne"));
  const storedPlayerTwo = JSON.parse(localStorage.getItem("playerTwo"));

  if (storedPlayerOne) playerOne = storedPlayerOne;
  if (storedPlayerTwo) playerTwo = storedPlayerTwo;
}

function savePlayersToStorage() {
  localStorage.setItem("playerOne", JSON.stringify(playerOne));
  localStorage.setItem("playerTwo", JSON.stringify(playerTwo));
}

loadPlayersFromStorage();

boxes.forEach((box) => {
  box.innerHTML = "";
  box.addEventListener("click", () => {
    if (playerOne.icon !== playerTwo.icon) {
      gameIndex++;
      if (userOneTurn) {
        box.innerHTML = playerOne.icon;
        userOneTurn = false;

        if (isSoundOn === true) {
          playerOneSound.play();
        }

        // box.style.color = playerOne.color;
      } else {
        box.innerHTML = playerTwo.icon;
        userOneTurn = true;

        if (isSoundOn === true) {
          playerTwoSound.play();
        }

        // box.style.color = playerTwo.color;
      }
      box.disabled = true;

      isGameWonFunction();
      gameDraw();
    } else {
      alertFunc(`Both players icon cannot be ${playerOne.icon}`, "red", 3000);
    }
  });
});

// WINNING PATTERNS
const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];
function isGameWonFunction() {
  winPatterns.forEach((pattern) => {
    let position1 = boxes[pattern[0]].innerText;
    let position2 = boxes[pattern[1]].innerText;
    let position3 = boxes[pattern[2]].innerText;

    if (position1 != "" && position2 != "" && position3 != "") {
      if (position1 === position2 && position2 === position3) {
        //
        isGameWon = true;
        gameOver();

        if (isSoundOn === true) {
          gameOverSound.play();
        }

        winModalDisplayer(position1);
        CongratulationsDisplayer(position1);
        winValuesUpdate(position1);
        savePlayersToStorage();
        updateValues();

        let patternWin = [pattern[0], pattern[1], pattern[2]];

        if (navigator.vibrate) {
          navigator.vibrate([1000, 70, 10]); // Vibration pattern for win
        }

        if (position1 === playerOne.icon) {
          winnerAnimtaions(playerOne.color);
          themeColorFunc(playerOne.color);

          alertFunc(
            `${playerOne.name} Won`,
            playerOne.color,
            1000,
            playerOne.textColor
          );

          winningLineDisplay(patternWin, playerOne.color);
        } else {
          winnerAnimtaions(playerTwo.color);
          themeColorFunc(playerTwo.color);

          alertFunc(
            `${playerTwo.name} Won`,
            playerTwo.color,
            1000,
            playerTwo.textColor
          );

          winningLineDisplay(patternWin, playerTwo.color);
        }
      }
    }
  });
}

function winValuesUpdate(player) {
  if (player === playerOne.icon) {
    playerOne.winCount++;
  } else if (player === playerTwo.icon) {
    playerTwo.winCount++;
  }
}

function gameOver() {
  if (isGameWon === true) {
    boxes.forEach((box) => {
      box.disabled = true;
    });
  }
}

function enableBoxes() {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });
}

function winModalDisplayer(player) {
  let WinnermodalContainer = document.querySelector(".WinnermodalContainer");

  let textDisplayer = document.querySelector(".WinnermodalContainer p");

  if (player === playerOne.icon) {
    textDisplayer.innerText = `${playerOne.name} Won the match`;
    // WinnermodalContainer.style.color = "";
    // WinnermodalContainer.style.background = playerOne.color;
  } else if (player === playerTwo.icon) {
    textDisplayer.innerText = `${playerTwo.name} Won the match`;
    // WinnermodalContainer.style.background = playerTwo.color;
    // WinnermodalContainer.style.color = "black";
  } else {
    // WinnermodalContainer.style.background = "#333";
    // WinnermodalContainer.style.color = "";
    textDisplayer.innerText = `Game Draw`;
  }

  modal.classList.add("WinnermodalContainerActive");
}

function newGame() {
  userOneTurn = true;
  gameIndex = 0;
  isGameWon = false;

  enableBoxes();
  modal.classList.remove("WinnermodalContainerActive");

  themeColorFunc();

  boxes.forEach((box) => {
    box.classList.remove("winnerBoxClass");
    box.style.borderColor = "";
  });

  winningLineCnt.style.zIndex = "-1";
  winLine.style.height = "0";
  winLine.style.transform = "0";
}

let newGameBtn = document.querySelector(".newGameBtn");
newGameBtn.addEventListener("click", newGame);

function gameDraw() {
  if (gameIndex === 9 && isGameWon === false) {
    winModalDisplayer();

    if (isSoundOn === true) {
      gameDrawSound.play();
    }
  }
}

let pointsContainer = document.querySelector(".pointsContainer");
function mediaQueries() {
  pointsContainer.style.display = "block";
  if (window.matchMedia("(max-width: 1000px)").matches) {
    let gameSection = document.querySelector("#game");
    let sectionTwo = document.createElement("section");
    sectionTwo.setAttribute("class", "sectionTwo");

    pointsContainer.style.cssText = "width:fit-content;margin:auto";

    sectionTwo.appendChild(pointsContainer);
    gameSection.after(sectionTwo);
  }
}
mediaQueries();
pointsContainer.style.display = "block";

function boxHoverEffectsFunction() {
  let userOneCard = document.getElementById("playerOneCard");
  let userTwoCard = document.getElementById("playerTwoCard");

  userOneCard.style.background = playerOne.color;
  userOneCard.style.color = playerOne.textColor;

  userTwoCard.style.background = playerTwo.color;
  userTwoCard.style.color = playerTwo.textColor;

  if (userOneTurn === true && gameIndex < 9 && isGameWon === false) {
    userOneCard.style.opacity = "1";
    userTwoCard.style.opacity = ".25";
  } else if (userOneTurn === false && gameIndex < 9 && isGameWon === false) {
    userOneCard.style.opacity = ".25";
    userTwoCard.style.opacity = "1";
  } else {
    userOneCard.style.opacity = ".25";
    userTwoCard.style.opacity = ".25";
  }

  boxes.forEach((box) => {
    if (
      userOneTurn === true &&
      box.innerText === "" &&
      isGameWon === false &&
      window.matchMedia("(min-width: 900px)").matches
    ) {
      box.addEventListener("mouseenter", function () {
        box.style.backgroundColor = playerOne.color; // Change background color on hover
      });
      box.addEventListener("mouseleave", function () {
        box.style.backgroundColor = ""; // Reset background when hover ends
      });
    } else if (
      userOneTurn === false &&
      box.innerText === "" &&
      isGameWon === false &&
      window.matchMedia("(min-width: 900px)").matches
    ) {
      box.addEventListener("mouseenter", function () {
        box.style.backgroundColor = playerTwo.color; // Change background color on hover
      });

      box.addEventListener("mouseleave", function () {
        box.style.backgroundColor = ""; // Reset background when hover ends
      });
    } else {
      box.addEventListener("mouseenter", function () {
        box.style.backgroundColor = ""; // Change background color on hover
      });
    }
  });
}

setInterval(() => {
  boxHoverEffectsFunction();
}, 1);

function updateValues() {
  document.querySelector("#playerOneCard .userName").innerText = playerOne.name;
  document.querySelector("#playerOneCard .userBio").innerText = playerOne.bio;
  document.querySelector("#playerOneCard .userIcon").innerText = playerOne.icon;
  document.querySelector("#playerOneCard .userPoints").innerText =
    playerOne.winCount;

  document.querySelector("#playerTwoCard .userName").innerText = playerTwo.name;
  document.querySelector("#playerTwoCard .userBio").innerText = playerTwo.bio;
  document.querySelector("#playerTwoCard .userIcon").innerText = playerTwo.icon;
  document.querySelector("#playerTwoCard .userPoints").innerText =
    playerTwo.winCount;
}

updateValues();

function CongratulationsDisplayer(player) {
  let gameWonText = document.createElement("div");
  gameWonText.innerText = "Congratulations";
  gameWonText.setAttribute("class", "gameWonTextClass");

  let player1Card = document.getElementById("playerOneCard");
  let player2Card = document.getElementById("playerTwoCard");

  if (isGameWon === true) {
    if (player === playerOne.icon) {
      player1Card.append(gameWonText);

      setTimeout(() => {
        gameWonText.style.scale = "1";
      }, 1);

      setTimeout(() => {
        gameWonText.style.scale = "0";
      }, 2000);

      //
    } else {
      player2Card.append(gameWonText);

      setTimeout(() => {
        gameWonText.style.scale = "1";
      }, 1);

      setTimeout(() => {
        gameWonText.style.scale = "0";
      }, 2000);
    }
  }
}

let currentPlayer = null; // To track which player is being edited
function editUserDetails() {
  let userCards = document.querySelectorAll(".userCard");

  userCards.forEach((card) => {
    if (window.matchMedia("(min-width: 900px)").matches) {
      card.addEventListener("mouseenter", () => {
        let editBtn = document.createElement("div");
        editBtn.innerText = "Edit";
        editBtn.setAttribute("class", "editBtnClass");

        if (gameIndex === 0) {
          // Append the edit button to the card
          card.append(editBtn);
        }

        // Add click listener for the edit button
        editBtn.addEventListener("click", () => {
          let inputsModal = document.querySelector(".inputsContainer");
          inputsModal.classList.add("inputsModalActive");

          let modalsSection = document.querySelector(".modalsSection");
          modalsSection.classList.add("modalsSectionActive");

          if (modalsSection.classList.contains("modalsSectionActive")) {
            document.body.style.overflow = "hidden";
          }

          // Determine which player is being edited
          if (card.id === "playerOneCard") {
            currentPlayer = playerOne;
          } else if (card.id === "playerTwoCard") {
            currentPlayer = playerTwo;
          }

          // Populate the modal inputs with current player details
          let nameInput = document.querySelector(
            ".inputsContainer .nameInputClass"
          );
          let bioInput = document.querySelector(
            ".inputsContainer .bioInputClass"
          );

          let iconInput = document.querySelector(
            ".inputsContainer .iconInputClass"
          );

          //
          let colorInput = document.querySelector(
            ".inputsContainer .colorInputClass"
          );

          nameInput.value = currentPlayer.name;
          bioInput.value = currentPlayer.bio;
          iconInput.value = currentPlayer.icon;

          colorInput.value = currentPlayer.color;
        });
      });
      card.addEventListener("mouseleave", () => {
        let editBtn = card.querySelector(".editBtnClass");
        if (editBtn) {
          editBtn.remove();
        }
      });
      //
    } else {
      let editBtn = document.createElement("div");
      editBtn.innerText = "Edit";
      editBtn.setAttribute("class", "editBtnClass");

      if (gameIndex === 0) {
        // Append the edit button to the card
        card.append(editBtn);
      }

      // Add click listener for the edit button
      editBtn.addEventListener("click", () => {
        let inputsModal = document.querySelector(".inputsContainer");
        inputsModal.classList.add("inputsModalActive");

        let modalsSection = document.querySelector(".modalsSection");
        modalsSection.classList.add("modalsSectionActive");

        if (modalsSection.classList.contains("modalsSectionActive")) {
          document.body.style.overflow = "hidden";
        }

        // Determine which player is being edited
        if (card.id === "playerOneCard") {
          currentPlayer = playerOne;
        } else if (card.id === "playerTwoCard") {
          currentPlayer = playerTwo;
        }

        // Populate the modal inputs with current player details
        let nameInput = document.querySelector(
          ".inputsContainer .nameInputClass"
        );
        let bioInput = document.querySelector(
          ".inputsContainer .bioInputClass"
        );

        let iconInput = document.querySelector(
          ".inputsContainer .iconInputClass"
        );
        //
        let colorInput = document.querySelector(
          ".inputsContainer .colorInputClass"
        );

        nameInput.value = currentPlayer.name;
        bioInput.value = currentPlayer.bio;
        iconInput.value = currentPlayer.icon;

        colorInput.value = currentPlayer.color;
      });
    }
  });
}

function handleSubmitButton() {
  let submitButton = document.querySelector(".inputsContainer button");

  submitButton.addEventListener("click", () => {
    if (currentPlayer && gameIndex === 0) {
      // Get updated values from modal inputs
      let nameInput = document.querySelector(
        ".inputsContainer .nameInputClass"
      );
      let bioInput = document.querySelector(".inputsContainer .bioInputClass");
      let iconInput = document.querySelector(
        ".inputsContainer .iconInputClass"
      );
      let colorInput = document.querySelector(
        ".inputsContainer .colorInputClass"
      );

      currentPlayer.name = nameInput.value;
      currentPlayer.bio = bioInput.value;

      if (iconInput.value >= "A" && iconInput.value <= "Z") {
        currentPlayer.icon = iconInput.value;
        alertFunc("Successfully Changed.", "green", 2000);
      } else {
        alertFunc(
          "Icon must be a single, unique uppercase letter.",
          "red",
          2000
        );
      }

      currentPlayer.color = colorInput.value;
      currentPlayer.textColor = getTextColor(currentPlayer.color);

      savePlayersToStorage();
      // Update displayed values
      updateValues();

      // Close the modal

      closeInputsModalSecFunc();

      currentPlayer = null;
    } else {
      closeInputsModalSecFunc();
      alertFunc("Try again after completing the game", "red", 1000);
    }
  });
}

function alertFunc(alertContent, color, duration, textColor) {
  let alertsContainer = document.querySelector(".alertsContainer");
  let alertsContainerPara = document.querySelector(".alertsContainer p");

  alertsContainer.classList.add("alertsContainerActive");
  alertsContainer.style.background = color;
  alertsContainer.style.color = textColor;
  alertsContainerPara.innerText = alertContent;

  setTimeout(() => {
    alertsContainer.classList.remove("alertsContainerActive");
    alertsContainer.style.background = "";
    alertsContainer.style.color = "";
    alertsContainerPara.innerText = "";
  }, duration);
}

editUserDetails();
handleSubmitButton();

function closeInputsModalSecFunc() {
  let inputsModal = document.querySelector(".inputsContainer");
  inputsModal.classList.remove("inputsModalActive");

  let modalsSection = document.querySelector(".modalsSection");
  modalsSection.classList.remove("modalsSectionActive");

  document.body.style.overflow = "";
}
let closeModalSectionModal = document.querySelector(".closeModalSectionModal");
closeModalSectionModal.addEventListener("click", closeInputsModalSecFunc);

function clearStorageFunc() {
  if (isSoundOn === true) {
    cleanSound.play();
  }

  let trashSvg = document.querySelector(".trashSvg");
  trashSvg.classList.add("trashSvgActive");

  setTimeout(() => {
    localStorage.clear();

    let divs = document.querySelectorAll(".gamePoints div");
    divs.forEach((div) => {
      div.style.visibility = "hidden";
    });

    alertFunc("Storage has been successfully cleared", "green", "1000");
  }, 600);

  setTimeout(() => {
    window.location.href = "";
  }, 1200);
}

document
  .querySelector(".clearStorageCnt")
  .addEventListener("click", clearStorageFunc);
//
//
//
//
//
//
//
//
//
//
//
function winnerAnimtaions(borderColor) {
  boxes.forEach((box) => {
    box.classList.add("winnerBoxClass");
    box.style.borderColor = borderColor;
  });
}

function themeColorFunc(winnerColor) {
  const rootStyles = getComputedStyle(document.documentElement);
  const backgroundColor = rootStyles
    .getPropertyValue("--backgroundColor")
    .trim();

  let metaTag = document.createElement("meta");
  metaTag.setAttribute("name", "theme-color");
  if (winnerColor) {
    metaTag.setAttribute("content", winnerColor);
  } else {
    metaTag.setAttribute("content", backgroundColor);
  }

  document.head.prepend(metaTag);
}
themeColorFunc();

function getTextColor(color) {
  /**
   * Returns a text color (either black or white) that contrasts well with the given color.
   *
   * @param {string} color - A string representing the color (can be a color name, hex, or rgb).
   * @returns {string} - A string representing the text color in hex format (either "#000000" for black or "#FFFFFF" for white).
   */

  // Create a temporary element to resolve the color to its RGB format
  const tempDiv = document.createElement("div");
  tempDiv.style.color = color;
  document.body.appendChild(tempDiv);

  // Get the computed RGB color
  const computedColor = getComputedStyle(tempDiv).color;
  document.body.removeChild(tempDiv);

  // Extract RGB values from "rgb(r, g, b)" format
  const rgbMatch = computedColor.match(/\d+/g);
  if (!rgbMatch || rgbMatch.length < 3) {
    throw new Error("Invalid color format");
  }

  const r = parseInt(rgbMatch[0], 10);
  const g = parseInt(rgbMatch[1], 10);
  const b = parseInt(rgbMatch[2], 10);

  // Calculate the luminance using the WCAG formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark backgrounds and black for light backgrounds
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

function musicIconFunc() {
  if (isSoundOn === true) {
    isSoundOn = false;
    soundCnt.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg>
    `;
    alertFunc("Sound is off, unmute for audio", "darkblue", 600, "white");
  } else {
    isSoundOn = true;
    soundCnt.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
          <!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
          <path
            d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"
          />
        </svg>
        `;

    alertFunc("Sound is on", "darkblue", 600, "white");
  }
}

soundCnt.addEventListener("click", musicIconFunc);

function winningLineDisplay(patternWin, winLineBgColor) {
  winningLineCnt.style.zIndex = "1";
  winLine.style.background = winLineBgColor;
  let patternPos1 = patternWin[0];
  let patternPos2 = patternWin[1];
  let patternPos3 = patternWin[2];

  if (patternPos1 === 0 && patternPos2 === 1 && patternPos3 === 2) {
    setTimeout(() => {
      winLine.style.height = "100%";
    }, 600);
    winLine.style.rotate = "90deg";

    if (window.innerWidth < 850) {
      winLine.style.transform = "translate(-125px)";
    } else {
      winLine.style.transform = "translate(-185px)";
    }
  } else if (patternPos1 === 0 && patternPos2 === 3 && patternPos3 === 6) {
    setTimeout(() => {
      winLine.style.height = "100%";
    }, 600);

    winLine.style.rotate = "0deg";

    if (window.innerWidth < 850) {
      winLine.style.transform = "translateX(-125px)";
    } else {
      winLine.style.transform = "translateX(-185px)";
    }
  } else if (patternPos1 === 0 && patternPos2 === 4 && patternPos3 === 8) {
    setTimeout(() => {
      winLine.style.height = "100%";
    }, 600);

    winLine.style.rotate = "-45deg";
    winLine.style.transform = "translateX(0px)";
  } else if (patternPos1 === 1 && patternPos2 === 4 && patternPos3 === 7) {
    setTimeout(() => {
      winLine.style.height = "100%";
    }, 600);

    winLine.style.rotate = "0deg";
    winLine.style.transform = "translate(0)";
  } else if (patternPos1 === 2 && patternPos2 === 5 && patternPos3 === 8) {
    setTimeout(() => {
      winLine.style.height = "100%";
    }, 600);

    winLine.style.rotate = "0deg";

    if (window.innerWidth < 850) {
      winLine.style.transform = "translateX(125px)";
    } else {
      winLine.style.transform = "translateX(185px)";
    }
  } else if (patternPos1 === 2 && patternPos2 === 4 && patternPos3 === 6) {
    setTimeout(() => {
      winLine.style.height = "100%";
    }, 600);

    winLine.style.rotate = "45deg";
    winLine.style.transform = "translateX(0px)";
  } else if (patternPos1 === 3 && patternPos2 === 4 && patternPos3 === 5) {
    setTimeout(() => {
      winLine.style.height = "100%";
    }, 600);
    winLine.style.rotate = "90deg";

    winLine.style.transform = "translate(0)";
  } else if (patternPos1 === 6 && patternPos2 === 7 && patternPos3 === 8) {
    setTimeout(() => {
      winLine.style.height = "100%";
    }, 600);

    winLine.style.rotate = "90deg";
    if (window.innerWidth < 850) {
      winLine.style.transform = "translate(125px)";
    } else {
      winLine.style.transform = "translate(185px)";
    }
  }
}
