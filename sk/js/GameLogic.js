// Purpose: This file is used to create the game logic for the game. It fetches the data from the google sheet and creates the correct array and shuffled array. It also checks if the characters are in the correct position and updates the UI accordingly. It also has the drag and drop functionality for the game.

let puzzleNumber = 1;
let correctArray = [];
let shuffledCharacters = [];
let shuffledArray = [];
let totalPlayableCharacters = 0;

//--------------------------This function is used to fetch the data from the google sheet----------------------//
async function getData() {
 puzzleNumber = new URLSearchParams(document.location.search).get("puzzleNumber");
 if (!puzzleNumber)
  puzzleNumber = json.puzzleNumber;
   if (!isNaN(puzzleNumber) && puzzleNumber >= 0 && puzzleNumber < json.data.length) {
        }
  else
    puzzleNumber = json.data.length-1;
 
return json.data;
}
  
  //----------------------------------- Creating and checking THE ARRAYS ------------------------------------------//
  
  function displayPuzzleNumber() {
    let puzzleNumberElement = document.getElementById('SHABD-number');
    puzzleNumberElement.textContent = `svastika-padam - Game #${puzzleNumber}`;
  }

  // This function is used to create the correct array
  function createCorrectArray(data) {
    const localArray = [];
    const currentRow = data[puzzleNumber]; // Check for the date I want the data from
  
    let row = 1;
    let column = 1;
  
    for (let i = 1; i < currentRow.length; i++) {
      localArray.push({ character: currentRow[i], row: row, column: column }); // Pushes the data in and increments the row and 
      column++;
      if (column > 5) {
        column = 1;
        row++;
      }
    }
  
    return localArray;
  }
  
  // Function to check if the characters are in the correct position
  function checkifCorrectPosition() {
    let newCharacterArray = correctArray.map(item => item.character);
    for (let i = 0; i < correctArray.length; i++) {
      let currentCharacter = shuffledArray[i].character.innerHTML;
  
      // Handle '❌' symbol
      if (correctArray[i].character === '❌') {
        shuffledArray[i].character.classList.add('button__disabled');
        shuffledArray[i].character.classList.remove('almostcorrect__button', 'correct__button', 'button','drag__button','button__css');
        shuffledArray[i].character.parentElement.classList.add('button__container__disabled');
        shuffledArray[i].character.parentElement.classList.remove('drag__container','button__container');
        shuffledArray[i].character.draggable = false;
        continue;
      }
  
      // Handle green buttons (correct position)
      if (correctArray[i].character === currentCharacter) {
        shuffledArray[i].character.classList.add('correct__button');
        shuffledArray[i].character.classList.remove('almostcorrect__button', 'button', 'button__disabled');
        shuffledArray[i].character.parentElement.classList.remove('button__container__disabled', 'drag__container');
        shuffledArray[i].character.draggable = false;
        newCharacterArray[i] = null;
      } else {
        // Handle yellow buttons (almost correct position)
        let found = false;
        for (let j = 0; j < correctArray.length; j++) {
          if (currentCharacter === newCharacterArray[j] && newCharacterArray[j] !== '❌') {
            newCharacterArray[j] = null;
            if (shuffledArray[i].row === correctArray[j].row || shuffledArray[i].column === correctArray[j].column) {
              shuffledArray[i].character.classList.add('almostcorrect__button');
              shuffledArray[i].character.classList.remove('correct__button', 'button', 'button__disabled');
              shuffledArray[i].character.parentElement.classList.remove('button__container__disabled');
              shuffledArray[i].character.parentElement.classList.add('button__container','drag__container');
              found = true;
              break;
            }
          }
        }
        // Handle gray buttons (incorrect position)
        if (!found) {
          shuffledArray[i].character.classList.add('button');
          shuffledArray[i].character.classList.remove('almostcorrect__button', 'correct__button', 'button__disabled');
          shuffledArray[i].character.parentElement.classList.remove('button__container__disabled');
        }
      }
    }
  }
  
  // Function to populate shuffledArray with cell variables and row/column numbers
  function populateShuffledArrayWithCells() {
    const gridSize = 5; // Assuming a 5x5 grid
  
    for (let row = 1; row <= gridSize; row++) {
      for (let column = 1; column <= gridSize; column++) {
        const cellIndex = (row - 1) * gridSize + column;
        const cell = document.getElementById(`grid-button${cellIndex}`);
        shuffledArray.push({ character: cell, row: row, column: column });
      }
    }
  }
  // Function to populate the cells with the shuffled characters
  function populateCellsFromShuffledCharacters() {
    shuffledCharacters.forEach((character, index) => {
      const cell = shuffledArray[index].character;
      if (character !== '❌') {
        cell.innerHTML = character;
      } else {
        cell.innerHTML = '';
      }
    });
  }
  // Function to create the shuffled characters array
  function createShuffledCharacters(correctArray) {
    const shuffledCharacters = new Array(25).fill(null);
    const remainingCharacters = correctArray.filter(item => item.character !== '❌').map(item => item.character);
    totalPlayableCharacters = remainingCharacters.length;
  
    // Fill the same positions with '❌'
    correctArray.forEach((item, index) => {
      if (item.character === '❌') {
        shuffledCharacters[index] = '❌';
      }
    });
  
    // Helper function to get random index
    function getRandomIndex(array) {
      return Math.floor(Math.random() * array.length);
    }
  
    // Assign around 1/3rd of the leftover characters to the same positions
    const samePositionCount = Math.floor(remainingCharacters.length / 3);
    for (let i = 0; i < samePositionCount; i++) {
      const index = getRandomIndex(remainingCharacters);
      const character = remainingCharacters.splice(index, 1)[0];
      const positionIndex = correctArray.findIndex(item => item.character === character);
      if (shuffledCharacters[positionIndex] === null) {
        shuffledCharacters[positionIndex] = character;
      } else {
        const emptyIndex = shuffledCharacters.findIndex(item => item === null);
        shuffledCharacters[emptyIndex] = character;
      }
    }
  
    // Assign around half of the remaining characters to the same row or column
    const sameRowOrColumnCount = Math.floor(remainingCharacters.length / 2);
    for (let i = 0; i < sameRowOrColumnCount; i++) {
      const index = getRandomIndex(remainingCharacters);
      const character = remainingCharacters.splice(index, 1)[0];
      const positionIndex = correctArray.findIndex(item => item.character === character);
      const sameRowOrColumnPositions = correctArray.filter(item =>
        (item.row === correctArray[positionIndex].row || item.column === correctArray[positionIndex].column) && shuffledCharacters[correctArray.indexOf(item)] === null
      );
      if (sameRowOrColumnPositions.length > 0) {
        const positionIndex = getRandomIndex(sameRowOrColumnPositions);
        shuffledCharacters[correctArray.indexOf(sameRowOrColumnPositions[positionIndex])] = character;
      } else {
        const emptyIndex = shuffledCharacters.findIndex(item => item === null);
        shuffledCharacters[emptyIndex] = character;
      }
    }
  
    // Scatter the remaining characters randomly in the remaining empty positions
    while (remainingCharacters.length > 0) {
      const index = getRandomIndex(remainingCharacters);
      const character = remainingCharacters.splice(index, 1)[0];
      let randomPosition;
      do {
        randomPosition = getRandomIndex(shuffledCharacters);
      } while (shuffledCharacters[randomPosition] !== null);
      shuffledCharacters[randomPosition] = character;
    }
    return shuffledCharacters;
  }
  
  function checkAndShuffleIfNeeded() {
    const maxGreenCharacters = Math.round(totalPlayableCharacters / 3);
    let greenCount = countGreenCharacters(shuffledCharacters, correctArray);
    let attempts = 0;
    const maxAttempts = 100; // Set a maximum number of attempts to avoid infinite loop
  
    while (greenCount > maxGreenCharacters && attempts < maxAttempts) {
        shuffledCharacters = createShuffledCharacters(correctArray);
        greenCount = countGreenCharacters(shuffledCharacters, correctArray);
        attempts++;
  
    }
  
    if (attempts >= maxAttempts) {
        console.warn("Max attempts reached while shuffling characters. Proceeding with the current shuffle.");
    }
  }
  
  function countGreenCharacters(shuffledCharacters, correctArray) {
    let count = 0;
    for (let i = 0; i < shuffledCharacters.length; i++) {
        if (shuffledCharacters[i] !== '❌' && shuffledCharacters[i] === correctArray[i].character) {
            count++;
        }
    }
    return count;
  }
  // ------------------------------------------DRAG AND DROP FUNCTIONALITY------------------------------------------//
  
  var gridButtons = document.querySelectorAll(".drag__button");
  var buttonContainers = document.querySelectorAll(".drag__container");
  var draggedButton = null; 
  var originalContainer = null; 
  var swapCounterElement = document.getElementById("swaps-remaining-number");
  var swapCounterNum = parseInt(swapCounterElement.innerHTML);
  
  // Calculate the number of swaps based on the number of gray characters
  function calculateSwaps() {
    const baseSwaps = ((totalPlayableCharacters - 12) / (25 - 12)) * (18 - 10) + 10;
    //const ratio = totalGrayCharacters/totalPlayableCharacters;
    swapCounterElement.innerHTML = Math.round(baseSwaps); 
    swapCounterNum = parseInt(swapCounterElement.innerHTML);
  }
  
  gridButtons.forEach((button) => {
    button.addEventListener("dragstart", () => {
      button.classList.add("dragging")
      draggedButton = button; 
      originalContainer = button.parentElement; 
    });
  
    button.addEventListener("dragend", () => {
      button.classList.remove("dragging")
      draggedButton = null; 
      originalContainer = null; 
    });
  });
  
  buttonContainers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      container.classList.add("hovered__over");
    });
  
    container.addEventListener("dragleave", () => {
      container.classList.remove("hovered__over");
    });
  
    container.addEventListener("drop", () => {
      if (originalContainer !== container && container.classList.contains("drag__container")) {
        const tempInnerHTML = draggedButton.innerHTML;
        draggedButton.innerHTML = container.firstElementChild.innerHTML;
        container.firstElementChild.innerHTML = tempInnerHTML;
    
        checkifCorrectPosition();
        buttonContainers = document.querySelectorAll(".drag__container");
    
        if (swapCounterNum > 0) {
          swapCounterNum--; 
          swapCounterElement.innerHTML = swapCounterNum.toString();
        }
        
        if (isPuzzleCompleted()) {
          gameWon(); 
        } else {
          gameOver();
        } 
      }
    });  
  });
  
  let messageContainer = document.getElementById('message-container');
  let messageText = document.getElementById('message-text');
  let retryButton = document.getElementById('retry-button');
  let trymoreButton = document.getElementById('trymore-button');
  
  function showMessage(isWin) {
      if (isWin) {
          messageText.textContent = "YOU WON!";
          messageText.parentElement.classList.add('message__box', 'message__box--win');
          messageText.parentElement.classList.remove('message__box--lose');
          retryButton.style.display = "none";
          trymoreButton.style.display = "inline-block";
      } else {
          messageText.textContent = "YOU LOST!";
          messageText.parentElement.classList.add('message__box', 'message__box--lose');
          messageText.parentElement.classList.remove('message__box--win');
          retryButton.style.display = "inline-block";
          trymoreButton.style.display = "none";
      }
      messageContainer.style.display = "flex";
  }
  
  function gameOver() {
    if (swapCounterNum == 0) {
        showMessage(false);
        for (let i = 0; i <= shuffledArray.length - 1; i++) {
            let currentCharacter = shuffledArray[i].character;
  
            if (currentCharacter.classList.contains("almostcorrect__button") || currentCharacter.classList.contains("button")) {
                currentCharacter.classList.add("loser__wrong__button");
            } else {
                currentCharacter.classList.add("loser__correct__button");
            }
            currentCharacter.draggable = false;
        }
    }
  }
  
  function gameWon() {
    showMessage(true);
    for (let i = 0; i <= shuffledArray.length - 1; i++) {
        let currentCharacter = shuffledArray[i].character;
        currentCharacter.classList.add("winner__button");
        currentCharacter.draggable = false;
    }
  }
  
  function isPuzzleCompleted() {
      let correctCounter = 0;
      for (let i = 0; i <= shuffledArray.length - 1; i++) {
          if (shuffledArray[i].character.classList.contains("correct__button")) {
              correctCounter++;
          }
      }
      if (correctCounter == totalPlayableCharacters) {
          gameWon();
          return true;
      }
      return false;
  }
  
  // ----------------------------------------------SHARE BUTTON---------------------------------------------------//
  let copyMessage = document.getElementById('copy-message');
  
  function generateShareText() {
      let shareText = `स्वस्तिक-पदम् (svastika-padam) #${puzzleNumber}, I got ${swapCounterNum}⭐\n\n`;
      for (let i = 0; i < correctArray.length; i++) {
          if (i % 5 === 0 && i !== 0) {
              shareText += '\n';
          }
          let currentCharacter = shuffledArray[i].character;
          if (currentCharacter.classList.contains('correct__button')) {
              shareText += '🟧';//🟩
          } else if (currentCharacter.classList.contains('almostcorrect__button') || currentCharacter.classList.contains('button')) {
              shareText += '🟨';//⬛
          } else {
              shareText += '⬜';
          }
      }
      shareText += `\n\nPlay the game at: https://tg.zat.am/sk/index.htm?puzzleNumber=${puzzleNumber} `;
      return shareText;
  }
  
  function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
          copyMessage.style.display = 'block';
          setTimeout(() => {
              copyMessage.style.display = 'none';
          }, 2000);
      }).catch(err => {
          console.error('Could not copy text: ', err);
      });
  }
  
  document.getElementById('share-button').addEventListener('click', () => {
      let shareText = generateShareText();
      copyToClipboard(shareText);
  });


//----------------------------------------------APP SETUP---------------------------------------------------//
getData().then(data => {
    if (data) {
      displayPuzzleNumber();
      correctArray = createCorrectArray(data);
      shuffledCharacters = createShuffledCharacters(correctArray);
      checkAndShuffleIfNeeded(); // Check and shuffle if needed
      populateShuffledArrayWithCells();
      populateCellsFromShuffledCharacters();
      checkifCorrectPosition();
      calculateSwaps();
    }
  });  