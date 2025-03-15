// Utility to solve a Sudoku puzzle
function solveSudoku(board) {
  // First, validate the input board
  if (!isValidBoard(board)) {
    return { solved: false, board: null, message: "Invalid starting board" };
  }

  const boardCopy = JSON.parse(JSON.stringify(board));
  const solved = solve(boardCopy);

  return {
    solved,
    board: solved ? boardCopy : null,
    message: solved ? "Solved successfully" : "No solution exists",
  };
}

// Check if the initial board configuration is valid
function isValidBoard(board) {
  // Check rows
  for (let row = 0; row < 9; row++) {
    const seen = new Set();
    for (let col = 0; col < 9; col++) {
      const value = board[row][col];
      if (value !== 0) {
        if (seen.has(value)) return false;
        seen.add(value);
      }
    }
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    const seen = new Set();
    for (let row = 0; row < 9; row++) {
      const value = board[row][col];
      if (value !== 0) {
        if (seen.has(value)) return false;
        seen.add(value);
      }
    }
  }

  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Set();
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const value = board[boxRow * 3 + row][boxCol * 3 + col];
          if (value !== 0) {
            if (seen.has(value)) return false;
            seen.add(value);
          }
        }
      }
    }
  }

  return true;
}

// Check if a value is valid in a given position
function isValid(board, row, col, num) {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let y = 0; y < 9; y++) {
    if (board[y][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (board[boxRow + y][boxCol + x] === num) {
        return false;
      }
    }
  }

  return true;
}

// Solve a board using backtracking
function solve(board) {
  // Find an empty cell
  let emptyCell = findEmptyCell(board);

  // If no empty cell is found, the board is solved
  if (!emptyCell) {
    return true;
  }

  const { row, col } = emptyCell;

  // Try digits 1-9
  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      // Place the number
      board[row][col] = num;

      // Recursively try to solve the rest
      if (solve(board)) {
        return true;
      }

      // If we couldn't solve, backtrack
      board[row][col] = 0;
    }
  }

  // No solution found
  return false;
}

// Find an empty cell in the board
function findEmptyCell(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return { row, col };
      }
    }
  }
  return null;
}

export { solveSudoku, solve, isValid };
