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