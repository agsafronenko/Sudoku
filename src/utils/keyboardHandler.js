// src/utils/keyboardHandler.js
import { playSound } from "./soundUtils";

/**
 * Handles keyboard input for the Sudoku game
 * @param {Object} params - Parameters object
 * @param {Object|null} params.selectedCell - Currently selected cell {row, col}
 * @param {Array} params.originalBoard - Original board with fixed cells
 * @param {function} params.handleNumberInput - Function to handle number input
 * @param {function} params.toggleNoteMode - Function to toggle note mode
 * @param {Array} params.notes - 2D array containing notes for each cell
 * @param {function} params.setNotes - Function to update notes
 * @param {function} params.setSelectedCell - Function to set selected cell
 * @param {function} params.showHint - Function to use a hint
 * @param {function} params.showIncorrectCells - Function to show incorrect cells
 * @param {function} params.startNewGame - Function to start a new game
 */

export const handleKeyDown = (e, params) => {
  const { selectedCell, originalBoard, handleNumberInput, toggleNoteMode, notes, setNotes, setSelectedCell, showHint, showIncorrectCells, startNewGame } = params;

  // Prevent default action for game control keys
  if ((e.key >= "1" && e.key <= "9") || e.key === "Delete" || e.key === "Backspace" || e.key.toLowerCase() === "n" || ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) || e.key === "h" || e.key === "c" || e.key === "p") {
    e.preventDefault();
  }

  // Handle number keys 1-9
  if (e.key >= "1" && e.key <= "9") {
    // Only allow input on non-original cells
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    if (originalBoard[row][col] === 0) {
      handleNumberInput(parseInt(e.key, 10));
    }
  }
  // Handle Delete or Backspace to clear cell
  else if (e.key === "Delete" || e.key === "Backspace") {
    // Only allow clearing non-original cells
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    if (originalBoard[row][col] === 0) {
      handleNumberInput(0);
      // Handle clearing notes for Play mode only
      if (notes.length > 0) {
        const newNotes = [...notes];
        newNotes[row][col] = [];
        setNotes(newNotes);
      }
    }
  }
  // Handle p key to toggle pen/pencil mode
  else if (e.key.toLowerCase() === "p") {
    toggleNoteMode();
  }
  // Handle h key for hint
  else if (e.key.toLowerCase() === "h") {
    showHint();
  }
  // Handle c key for checking mistakes
  else if (e.key.toLowerCase() === "c") {
    showIncorrectCells();
  }
  // Handle n key for new game
  else if (e.key.toLowerCase() === "n") {
    startNewGame();
  }
  // Handle arrow keys for navigation
  else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    navigateWithArrowKeys(e.key, selectedCell, originalBoard, setSelectedCell);
  }
};

/**
 * Navigate the board using arrow keys
 */
const navigateWithArrowKeys = (key, selectedCell, originalBoard, setSelectedCell) => {
  // If no cell is selected yet, start from the center
  let row = 4;
  let col = 4;

  if (selectedCell) {
    row = selectedCell.row;
    col = selectedCell.col;
  }

  let newRow = row;
  let newCol = col;

  switch (key) {
    case "ArrowUp":
      newRow = Math.max(0, row - 1);
      break;
    case "ArrowDown":
      newRow = Math.min(8, row + 1);
      break;
    case "ArrowLeft":
      newCol = Math.max(0, col - 1);
      break;
    case "ArrowRight":
      newCol = Math.min(8, col + 1);
      break;
    default:
      break;
  }

  // Check if cell has changed
  if (newRow !== row || newCol !== col) {
    // Remove any lingering "key-pressed" classes from all cells
    const allCells = document.querySelectorAll(".cell.key-pressed");
    allCells.forEach((cell) => {
      cell.classList.remove("key-pressed");
    });

    playSound("clickCell");

    // Update the selectedCell state
    setSelectedCell({ row: newRow, col: newCol });

    setTimeout(() => {
      const cell = document.querySelector(`.row:nth-child(${newRow + 1}) .cell:nth-child(${newCol + 1})`);
      if (cell) {
        cell.classList.add("key-pressed");
        setTimeout(() => {
          cell.classList.remove("key-pressed");
        }, 300);
      }
    }, 10);
  }
};
/**
 * Set up keyboard event listeners
 */
export const setupKeyboardListeners = (handlers) => {
  const keyDownHandler = (e) => handleKeyDown(e, handlers);

  window.addEventListener("keydown", keyDownHandler);

  // Return a cleanup function
  return () => {
    window.removeEventListener("keydown", keyDownHandler);
  };
};
