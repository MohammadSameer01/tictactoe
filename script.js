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
  color: "red",
  winCount: 0,
};
let playerTwo = {
  name: "Player2",
  bio: "I play patiently, waiting for the perfect moment to strike. I enjoy exploiting my opponent’s mistakes and using every opportunity to take control. I may not move first, but I always think ahead to win.",
  icon: "O",
  color: "yellow",
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
        playerOneSound.play();
        // box.style.color = playerOne.color;
      } else {
        box.innerHTML = playerTwo.icon;
        userOneTurn = true;
        playerTwoSound.play();

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
        gameOverSound.play();

        winModalDisplayer(position1);

        if (position1 === playerOne.icon) {
          winnerAnimtaions(playerOne.color);
          themeColorFunc(playerOne.color);
        } else {
          winnerAnimtaions(playerTwo.color);
          themeColorFunc(playerTwo.color);
        }

        CongratulationsDisplayer(position1);
        winValuesUpdate(position1);
        savePlayersToStorage();
        updateValues();

        if (navigator.vibrate) {
          navigator.vibrate([1000, 70, 10]); // Vibration pattern for win
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
}

let newGameBtn = document.querySelector(".newGameBtn");
newGameBtn.addEventListener("click", newGame);

function gameDraw() {
  if (gameIndex === 9 && isGameWon === false) {
    winModalDisplayer();
    gameDrawSound.play();
  }
}

function mediaQueries() {
  if (window.matchMedia("(max-width: 1000px)").matches) {
    let pointsContainer = document.querySelector(".pointsContainer");
    let gameSection = document.querySelector("#game");
    let sectionTwo = document.createElement("section");
    sectionTwo.setAttribute("class", "sectionTwo");

    pointsContainer.style.cssText = "width:fit-content;margin:auto";

    sectionTwo.appendChild(pointsContainer);
    gameSection.after(sectionTwo);
  }
}
mediaQueries();

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
    if (currentPlayer) {
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
    }
  });
}

function alertFunc(alertContent, color, duration) {
  let alertsContainer = document.querySelector(".alertsContainer");
  let alertsContainerPara = document.querySelector(".alertsContainer p");

  alertsContainer.classList.add("alertsContainerActive");
  alertsContainer.style.background = color;
  alertsContainerPara.innerText = alertContent;

  setTimeout(() => {
    alertsContainer.classList.remove("alertsContainerActive");
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
}
let closeModalSectionModal = document.querySelector(".closeModalSectionModal");
closeModalSectionModal.addEventListener("click", closeInputsModalSecFunc);

function clearStorageFunc() {
  cleanSound.play();

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
