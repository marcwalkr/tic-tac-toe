function createPlayer(name, marker, number) {
  let wins = 0;
  const getWins = () => wins;
  const addWin = () => wins++;

  return { name, marker, number, getWins, addWin };
}

const Board = (function () {
  let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ];

  const getCell = (row, column) => board[row][column];

  const placeMarker = (marker, row, column) => {
    board[row][column] = marker;
  }

  const filled = () => {
    for (const row of board) {
      for (const cell of row) {
        if (cell === "") return false;
      }
    }

    return true;
  }

  const clear = () => {
    board = [
      ["", "", ""], 
      ["", "", ""], 
      ["", "", ""]
    ];
  }

  return { getCell, placeMarker, filled, clear }
})();

const Display = (function () {
  const playerForm = document.querySelector(".player-form");
  const game = document.querySelector(".game");
  const player1NameLabel = document.querySelector(".game__player-one-name");
  const player2NameLabel = document.querySelector(".game__player-two-name");
  const currentPlayerLabel = document.querySelector(".game__current-player");
  const player1Wins = document.querySelector(".game__player-one-wins");
  const player2Wins = document.querySelector(".game__player-two-wins");
  const gameBoard = document.querySelector(".game-board");
  const gameOverMessage = document.querySelector(".game__message");
  const newGameButton = document.querySelector(".game__new-game-btn");

  const setPlayerLabels = (p1, p2) => {
    player1NameLabel.textContent = p1;
    player2NameLabel.textContent = p2;
  }

  const setCurrentPlayerLabel = (player) => {
    currentPlayerLabel.textContent = player;
  }

  const showGameScreen = () => {
    playerForm.classList.remove("is-active");
    game.classList.add("is-active");
  }

  const renderBoard = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cell = gameBoard.querySelector(`[data-row="${i}"][data-column="${j}"]`);
        const value = Board.getCell(i, j);
        cell.textContent = value;

        cell.classList.remove("cell--x", "cell--o");

        if (value === "X") cell.classList.add("cell--x");
        if (value === "O") cell.classList.add("cell--o");
      }
    }
  }

  const setWins = (playerNum, wins) => {
    if (playerNum === 1) {
      player1Wins.textContent = wins;
    } else {
      player2Wins.textContent = wins;
    }
  }

  const showGameOverMessage = (winner, tie) => {
    if (tie) {
      gameOverMessage.textContent = "Tied";
    } else {
      gameOverMessage.textContent = `${winner.name} Wins!`;
    }

    gameOverMessage.classList.add("is-active");
  }

  const hideGameOverMessages = () => {
    gameOverMessage.classList.remove("is-active");
  }

  const showNewGameButton = () => {
    newGameButton.classList.add("is-active");
  }

  const hideNewGameButton = () => {
    newGameButton.classList.remove("is-active");
  }

  playerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(playerForm);
    const playerData = {
      player1Name: formData.get("player1Name").trim(),
      player1Marker: formData.get("player1Marker"),
      player2Name: formData.get("player2Name").trim(),
      player2Marker: formData.get("player2Marker")
    };

    if (playerData.player1Marker === playerData.player2Marker) {
      alert("Please select different markers.");
      return;
    }

    document.dispatchEvent(new CustomEvent("playersCreated", { detail: playerData }));
    showGameScreen();
  });
  
  gameBoard.addEventListener("click", (event) => {
    if (!event.target.classList.contains("game-board__cell")) return;
    const row = Number(event.target.dataset.row);
    const column = Number(event.target.dataset.column);
    const move = { row, column };
    document.dispatchEvent(new CustomEvent("boardClicked", { detail: move }));
  });

  newGameButton.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("newGameClicked"));
  });

  return { 
    setPlayerLabels, 
    setCurrentPlayerLabel, 
    renderBoard, 
    setWins, 
    showGameOverMessage, 
    hideGameOverMessages, 
    showNewGameButton, 
    hideNewGameButton
  };
})();

const Game = (function () {
  let players = null;
  let currentPlayerIdx = 0;
  let gameOver = false;

  const getCurrentPlayer = () => {
    return players[currentPlayerIdx % players.length];
  }

  const isLegalMove = (row, column) => {
    return Board.getCell(row, column) === "";
  }

  const checkOutcome = () => {
    const row1 = [Board.getCell(0, 0), Board.getCell(0, 1), Board.getCell(0, 2)];
    const row2 = [Board.getCell(1, 0), Board.getCell(1, 1), Board.getCell(1, 2)];
    const row3 = [Board.getCell(2, 0), Board.getCell(2, 1), Board.getCell(2, 2)];

    const col1 = [Board.getCell(0, 0), Board.getCell(1, 0), Board.getCell(2, 0)];
    const col2 = [Board.getCell(0, 1), Board.getCell(1, 1), Board.getCell(2, 1)];
    const col3 = [Board.getCell(0, 2), Board.getCell(1, 2), Board.getCell(2, 2)];

    const diag1 = [Board.getCell(0, 0), Board.getCell(1, 1), Board.getCell(2, 2)];
    const diag2 = [Board.getCell(0, 2), Board.getCell(1, 1), Board.getCell(2, 0)];

    for (const line of [row1, row2, row3, col1, col2, col3, diag1, diag2]) {
      if (line[0] !== "" && line.every(x => x === line[0])) {
        const winningMarker = line[0];
        const winner = players.find((player) => player.marker === winningMarker);
        return { winner, tie: false };
      }
    }

    if (Board.filled()) {
      return { winner: null, tie: true };
    } else {
      return { winner: null, tie: false };
    }
  }

  const reset = () => {
    Board.clear();
    gameOver = false;
    currentPlayerIdx = 0;

    Display.hideGameOverMessages();
    Display.hideNewGameButton();
    Display.renderBoard();
    
    Display.setCurrentPlayerLabel(getCurrentPlayer().name);
  }

  const playTurn = (row, column) => {
    if (!isLegalMove(row, column) || gameOver) return;

    const currentPlayer = getCurrentPlayer();
    Board.placeMarker(currentPlayer.marker, row, column);
    Display.renderBoard();

    const { winner, tie } = checkOutcome();

    if (winner) {
      winner.addWin();
      Display.setWins(winner.number, winner.getWins());
    }

    if (winner || tie) {
      gameOver = true;
      Display.showGameOverMessage(winner, tie);
      Display.showNewGameButton();
    } else {
      currentPlayerIdx++;
      Display.setCurrentPlayerLabel(getCurrentPlayer().name);
    }
  }

  document.addEventListener("playersCreated", (e) => {
    const { player1Name, player1Marker, player2Name, player2Marker } = e.detail;
    const player1 = createPlayer(player1Name, player1Marker, 1);
    const player2 = createPlayer(player2Name, player2Marker, 2);
    players = [player1, player2];
    Display.setPlayerLabels(player1Name, player2Name);
    Display.setCurrentPlayerLabel(player1Name);
  });

  document.addEventListener("boardClicked", (e) => {
    playTurn(e.detail.row, e.detail.column);
  });

  document.addEventListener("newGameClicked", (e) => {
    reset();
  });
})();