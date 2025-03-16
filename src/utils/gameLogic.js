// Check if the solution is correct
function checkSolution(board, solution) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== solution[row][col]) {
        return false;
      }
    }
  }

  return true;
}

// Check if the board is completely filled
function isBoardFilled(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return false;
      }
    }
  }

  return true;
}

// Find incorrect cells
function findIncorrectCells(board, solution) {
  const incorrectCells = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] !== 0 && board[row][col] !== solution[row][col]) {
        incorrectCells.push({ row, col });
      }
    }
  }

  return incorrectCells;
}

export { checkSolution, isBoardFilled, findIncorrectCells };
