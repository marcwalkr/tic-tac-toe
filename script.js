function createPlayer(name, marker) {
  let wins = 0;
  const getWins = () => wins;
  const addWin = () => wins++;

  return { name, marker, getWins, addWin };
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

  playerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(playerForm);
    const playerData = {
      player1Name: formData.get("player1Name").trim(),
      player1Marker: formData.get("player1Marker"),
      player2Name: formData.get("player2Name").trim(),
      player2Marker: formData.get("player2Marker")
    };
    document.dispatchEvent(new CustomEvent("playersCreated", { detail: playerData }));
    showGameScreen();
  });
  

  return { setPlayerLabels, setCurrentPlayerLabel };
})();

const Game = (function () {
  let players = null;
  let currentPlayerIdx = 0;

  const getCurrentPlayer = () => {
    return players[currentPlayerIdx % players.length];
  }

  const getPlayers = () => players;

  const setPlayers = (newPlayers) => {
    players = newPlayers;
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

  const playTurn = (row, column) => {
    if (!isLegalMove(row, column)) {
      return { valid: false, winner: null, tie: false };
    }

    const currentPlayer = getCurrentPlayer();
    Board.placeMarker(currentPlayer.marker, row, column);
    currentPlayerIdx++;

    const { winner, tie } = checkOutcome();
    if (winner !== null) winner.addWin();

    return { valid: true, winner, tie };
  }

  const reset = () => {
    Board.clear();
    currentPlayerIdx = 0;
  }

  document.addEventListener("playersCreated", (e) => {
    const { player1Name, player1Marker, player2Name, player2Marker } = e.detail;
    const player1 = createPlayer(player1Name, player1Marker);
    const player2 = createPlayer(player2Name, player2Marker);
    players = [player1, player2];
    Display.setPlayerLabels(player1Name, player2Name);
    Display.setCurrentPlayerLabel(player1Name);
  });

  return { getCurrentPlayer, getPlayers, setPlayers, playTurn, reset }
})();