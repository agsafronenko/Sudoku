import { useState, useCallback } from "react";
import { playSound } from "../utils/soundUtils";

/**
 * Custom hook for handling user input on the sudoku board
 * @param {Object} options - Configuration options
 * @param {Object} options.boardState - Board state from useBoardState
 * @param {Function} options.onCompletionCheck - Function to call when checking for completion
 * @param {Function} options.animateCellSelect - Function to animate cell selection
 * @param {Function} options.animateNumberInput - Function to animate number input
 * @returns {Object} Input handlers and state
 */
function useInputHandler(options) {
  const { boardState, onCompletionCheck, animateCellSelect, animateNumberInput, animateHint } = options;

  const { board, originalBoard, selectedCell, setSelectedCell, updateCell, updateNotes, clearNotes, solution } = boardState;

  const [isNoteMode, setIsNoteMode] = useState(false);

  // Handle cell click
  const handleCellClick = useCallback(
    (row, col) => {
      // Skip if this is a fixed cell from the original board
      if (originalBoard && originalBoard[row][col] !== 0) return;

      playSound("clickCell");
      setSelectedCell({ row, col });

      if (animateCellSelect) {
        animateCellSelect(row, col);
      }
    },
    [originalBoard, setSelectedCell, animateCellSelect]
  );

  // Handle number input
  const handleNumberInput = useCallback(
    (number) => {
      if (!selectedCell) return;
      const { row, col } = selectedCell;
      // Skip if this is a fixed cell from the original board
      if (originalBoard && originalBoard[row][col] !== 0) return;

      if (number === 0) {
        playSound("clear");
      } else {
        playSound("clickButton");
      }

      // Handle note mode
      if (isNoteMode) {
        if (number === 0) {
          // Clear notes and cell value
          clearNotes(row, col);
          updateCell(row, col, 0);
        } else {
          updateNotes(row, col, number);
        }

        if (animateNumberInput) {
          animateNumberInput(row, col, true); // true for note mode
        }
      } else {
        // Regular number placement
        const currentValue = board[row][col];
        const newValue = currentValue === number ? 0 : number;
        const isChanging = currentValue !== newValue;

        clearNotes(row, col);

        const result = updateCell(row, col, newValue);

        // Animate the number input
        if (isChanging && number !== 0 && animateNumberInput) {
          animateNumberInput(row, col, false);
        }

        // Check for game completion
        if (result.complete && onCompletionCheck) {
          onCompletionCheck(result.correct);
        }
      }
    },
    [selectedCell, originalBoard, isNoteMode, board, updateCell, clearNotes, updateNotes, animateNumberInput, onCompletionCheck]
  );

  // Toggle note mode
  const toggleNoteMode = useCallback(() => {
    playSound("clickButton");
    setIsNoteMode((prev) => !prev);
    setSelectedCell(null);
  }, [setSelectedCell]);

  // Show hint (for play mode)
  const showHint = useCallback(() => {
    if (!solution || !updateCell) return null;

    playSound("hint");

    // Find empty cells
    const emptyCells = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) return null;

    // Select a random empty cell
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const { row, col } = randomCell;

    // Fill with correct value
    const result = updateCell(row, col, solution[row][col]);

    // Clear notes for this cell
    clearNotes(row, col);

    // Highlight the hint cell
    setSelectedCell({ row, col });

    if (animateHint) {
      setTimeout(() => {
        animateHint(row, col);
      }, 50);
    }

    // Check for game completion
    if (result.complete && onCompletionCheck) {
      onCompletionCheck(result.correct);
    }

    // Return the cell used for the hint
    return { row, col };
  }, [board, solution, updateCell, clearNotes, setSelectedCell, animateHint, onCompletionCheck]);

  return {
    isNoteMode,
    setIsNoteMode,
    toggleNoteMode,
    handleCellClick,
    handleNumberInput,
    showHint,
  };
}

export default useInputHandler;
