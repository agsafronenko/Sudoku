import { useState, useCallback } from "react";

/**
 * Custom hook for managing board state
 * @param {Object} options - Configuration options
 * @param {boolean} options.isGameMode - Whether this is game mode or solver mode
 * @param {Function} options.generateInitialBoard - Function to generate initial board (for play mode)
 * @returns {Object} Board state and manipulation functions
 */
function useBoardState(options = {}) {
  const { isGameMode = true, generateInitialBoard = null } = options;

  // Board states
  const [board, setBoard] = useState(
    Array(9)
      .fill()
      .map(() => Array(9).fill(0))
  );
  const [solution, setSolution] = useState(null);
  const [originalBoard, setOriginalBoard] = useState(
    Array(9)
      .fill()
      .map(() => Array(9).fill(0))
  );
  const [notes, setNotes] = useState(
    Array(9)
      .fill()
      .map(() =>
        Array(9)
          .fill()
          .map(() => [])
      )
  );
  const [selectedCell, setSelectedCell] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Start new game/reset board
  const resetBoard = useCallback(
    (difficultyLevel) => {
      if (isGameMode && generateInitialBoard) {
        const { puzzle, solution: fullSolution } = generateInitialBoard(difficultyLevel);
        setBoard(JSON.parse(JSON.stringify(puzzle)));
        setSolution(fullSolution);
        setOriginalBoard(JSON.parse(JSON.stringify(puzzle)));
      } else {
        // For solver mode, just clear the board
        const emptyBoard = () =>
          Array(9)
            .fill()
            .map(() => Array(9).fill(0));
        setBoard(emptyBoard);
        setOriginalBoard(emptyBoard);
        setSolution(null);
      }

      setSelectedCell(null);
      setNotes(
        Array(9)
          .fill()
          .map(() =>
            Array(9)
              .fill()
              .map(() => [])
          )
      );
      setGameComplete(false);
      setIsCorrect(false);
    },
    [isGameMode, generateInitialBoard]
  );

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

  // Update a cell's value
  const updateCell = useCallback(
    (row, col, value) => {
      const newBoard = [...board];
      newBoard[row][col] = value;
      setBoard(newBoard);

      // Check if board is filled (for play mode)
      if (isGameMode && isBoardFilled(newBoard) && solution) {
        const correct = checkSolution(newBoard, solution);
        setGameComplete(true);
        setIsCorrect(correct);
        return { complete: true, correct };
      }

      return { complete: false };
    },
    [board, isGameMode, solution]
  );

  // Update notes for a cell
  const updateNotes = useCallback(
    (row, col, number) => {
      const newNotes = [...notes];
      const cellNotes = [...newNotes[row][col]];

      const noteIndex = cellNotes.indexOf(number);
      if (noteIndex === -1) {
        cellNotes.push(number); // Add number to notes
      } else {
        cellNotes.splice(noteIndex, 1); // Remove number from notes
      }

      newNotes[row][col] = cellNotes;
      setNotes(newNotes);
    },
    [notes]
  );

  // Clear notes for a cell
  const clearNotes = useCallback(
    (row, col) => {
      const newNotes = [...notes];
      newNotes[row][col] = [];
      setNotes(newNotes);
    },
    [notes]
  );

  // Find incorrect cells on the board
  const getIncorrectCells = useCallback(() => {
    if (!solution) return [];
    const incorrectCells = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] !== 0 && board[row][col] !== solution[row][col]) {
          incorrectCells.push({ row, col });
        }
      }
    }

    return incorrectCells;
  }, [board, solution]);

  // Set the solution
  const setSolutionBoard = useCallback((solvedBoard) => {
    setSolution(solvedBoard);
    setBoard(JSON.parse(JSON.stringify(solvedBoard)));
  }, []);

  return {
    board,
    setBoard,
    solution,
    setSolution: setSolutionBoard,
    originalBoard,
    notes,
    setNotes,
    clearNotes,
    updateNotes,
    selectedCell,
    setSelectedCell,
    updateCell,
    resetBoard,
    gameComplete,
    isCorrect,
    getIncorrectCells,
  };
}

export default useBoardState;
