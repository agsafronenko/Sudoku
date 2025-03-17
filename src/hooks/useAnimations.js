import { useRef } from "react";
import { playNewGameAnimation, playWinAnimation, playLoseAnimation, playNumberInputAnimation, playHintAnimation } from "../utils/animationUtils";
import { useCallback } from "react";

export const useAnimations = () => {
  const boardRef = useRef(null);
  const previousCellRef = useRef(null);

  // Function to set or update the board reference
  const setBoardRef = (element) => {
    boardRef.current = element;
  };

  // Functions that use the board reference
  const animateNewGame = useCallback(() => {
    playNewGameAnimation(boardRef.current);
    // Reset the previous cell reference on new game
    previousCellRef.current = null;
  }, []);

  const animateWin = () => {
    playWinAnimation(boardRef.current);
  };

  const animateLose = () => {
    playLoseAnimation(boardRef.current);
  };

  // Functions that take a cell element
  const animateCellSelect = (row, col) => {
    if (!boardRef.current) return;

    // Clear any existing animation classes first
    const allCells = boardRef.current.querySelectorAll(".cell");
    allCells.forEach((cell) => {
      cell.classList.remove("animate-select");
      cell.classList.remove("key-pressed");
    });

    // Apply the new animation
    const cellElement = boardRef.current.querySelector(`.row:nth-child(${row + 1}) .cell:nth-child(${col + 1})`);
    if (cellElement) {
      cellElement.classList.add("animate-select");
      // Automatically remove the animation class after it completes
      setTimeout(() => {
        cellElement.classList.remove("animate-select");
      }, 300);
    }
  };

  const animateNumberInput = (rowIndex, colIndex, isNoteMode = false) => {
    if (!boardRef.current) return;

    const cellElement = boardRef.current.querySelector(`.row:nth-child(${rowIndex + 1}) .cell:nth-child(${colIndex + 1})`);

    playNumberInputAnimation(cellElement, isNoteMode);
  };

  const animateHint = (rowIndex, colIndex) => {
    if (!boardRef.current) return;

    const cellElement = boardRef.current.querySelector(`.row:nth-child(${rowIndex + 1}) .cell:nth-child(${colIndex + 1})`);

    // Update the previously selected cell to be the hint cell
    previousCellRef.current = cellElement;

    playHintAnimation(cellElement);
  };

  return {
    setBoardRef,
    animateNewGame,
    animateWin,
    animateLose,
    animateCellSelect,
    animateNumberInput,
    animateHint,
  };
};
