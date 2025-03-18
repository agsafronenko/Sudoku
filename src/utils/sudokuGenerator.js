import { solve, isValid, shuffleArray } from "./sudokuSolver";

// Create a random filled Sudoku board
function createFullBoard() {
  const board = Array(9)
    .fill()
    .map(() => Array(9).fill(0));

  fillBoard(board);

  return board;
}

// Recursively fill a board with random values
function fillBoard(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // Find an empty cell
      if (board[row][col] === 0) {
        // Try digits 1-9 in random order
        const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

        for (const num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;

            // Recursively try to fill the rest
            if (fillBoard(board)) {
              return true;
            }

            // If we couldn't fill, backtrack
            board[row][col] = 0;
          }
        }

        // No valid digit found
        return false;
      }
    }
  }

  // If we got here, the board is filled
  return true;
}

// Remove numbers to create a puzzle
function createPuzzle(board, emptyCellCount) {
  const puzzle = JSON.parse(JSON.stringify(board));
  const positions = [];

  // Create a list of all positions
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push({ row: i, col: j });
    }
  }

  // Shuffle positions
  const shuffledPositions = shuffleArray(positions);

  // Remove numbers one by one, ensuring the puzzle remains solvable
  let removed = 0;

  for (let i = 0; i < shuffledPositions.length && removed < emptyCellCount; i++) {
    const { row, col } = shuffledPositions[i];
    const temp = puzzle[row][col];
    puzzle[row][col] = 0;
    removed++;

    // If removing too many numbers or making the puzzle unsolvable, add it back
    if (!hasSolution(puzzle)) {
      puzzle[row][col] = temp;
      removed--;
    }
  }

  return puzzle;
}

// Check if the puzzle has a solution
function hasSolution(board) {
  const copy = JSON.parse(JSON.stringify(board));
  return solve(copy);
}

// Generate a puzzle with the given difficulty
function generatePuzzle(difficulty) {
  // Define empty cell count ranges for each difficulty
  const difficultyRanges = {
    "very-easy": { min: 40, max: 45 },
    easy: { min: 46, max: 49 },
    medium: { min: 50, max: 54 },
    hard: { min: 55, max: 59 },
    expert: { min: 60, max: 64 },
  };

  const range = difficultyRanges[difficulty] || difficultyRanges.medium;
  const emptyCellCount = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

  // Create a solution and puzzle
  const solution = createFullBoard();
  const puzzle = createPuzzle(solution, emptyCellCount);

  return { puzzle, solution };
}

export { generatePuzzle, createFullBoard, createPuzzle };
