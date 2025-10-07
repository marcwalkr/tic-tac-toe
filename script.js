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

  return { };
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

  return { getCurrentPlayer, getPlayers, setPlayers, playTurn, reset }
})();