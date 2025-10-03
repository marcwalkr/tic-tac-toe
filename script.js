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

  const clear = () => {
    board = [
      ["", "", ""], 
      ["", "", ""], 
      ["", "", ""]
    ];
  }

  const filled = () => {
    for (const row of board) {
      for (const cell of row) {
        if (cell === "") return false;
      }
    }

    return true;
  }

  return { getCell, placeMarker, clear, filled }
})();

const Display = (function () {
  const promptPlayerData = () => {
    const player1Name = prompt("Enter name for Player One");
    const player1Marker = prompt("Enter marker for Player One");

    const player2Name = prompt("Enter name for Player Two");
    const player2Marker = prompt("Enter marker for Player Two");

    const player1 = createPlayer(player1Name, player1Marker);
    const player2 = createPlayer(player2Name, player2Marker);

    return [player1, player2];
  }

  const promptMove = (playerName) => {
    const answer = prompt(`${playerName}'s Turn\nEnter a position to place your marker.`);
    let [row, column] = answer.split(" ");

    row = Number(row);
    column = Number(column);

    return { row, column }
  }

  const print = () => {
    console.log(`${Board.getCell(0, 0)}\t${Board.getCell(0, 1)}\t${Board.getCell(0, 2)}`);
    console.log(`${Board.getCell(1, 0)}\t${Board.getCell(1, 1)}\t${Board.getCell(1, 2)}`);
    console.log(`${Board.getCell(2, 0)}\t${Board.getCell(2, 1)}\t${Board.getCell(2, 2)}`);
  }

  return { promptPlayerData, promptMove, print };
})(Board);

const Game = (function () {
  let players = null;
  let currentPlayerIdx = 0;

  const getCurrentPlayer = () => {
    return players[currentPlayerIdx % players.length];
  }

  const setPlayers = (newPlayers) => {
    players = newPlayers;
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

  const isLegalMove = (row, column) => {
    return Board.getCell(row, column) === "";
  }

  const playTurn = (row, column) => {
    if (!isLegalMove(row, column)) {
      return { valid: false, winner: null, tie: false }
    } 

    const currentPlayer = getCurrentPlayer();
    Board.placeMarker(currentPlayer.marker, row, column);
    currentPlayerIdx++;

    const { winner, tie } = checkOutcome();
    return { valid: true, winner, tie };
  }

  return { getCurrentPlayer, setPlayers, playTurn }
})(Board);

const players = Display.promptPlayerData();
Game.setPlayers(players);

let winner = null;
let tie = false;
while (!winner && !tie) {
  const playerName = Game.getCurrentPlayer().name;
  const move = Display.promptMove(playerName);
  const result = Game.playTurn(move.row, move.column);

  if (!result.valid) {
    console.log("That position has already been taken.");
  }

  winner = result.winner;
  tie = result.tie;

  Display.print();
}

if (winner) {
  console.log(`Winner: ${winner.name}`);
  winner.addWin();
}

if (tie) console.log("Tied");