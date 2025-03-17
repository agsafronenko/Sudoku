import { useEffect } from "react";
import { playSound } from "../utils/soundUtils";

/**
 * Custom hook for handling keyboard input
 * @param {Object} options - Configuration options
 * @param {Object} options.boardState - Board state from useBoardState
 * @param {Object} options.inputHandler - Input handlers from useInputHandler
 * @param {Function} options.resetBoard - Function to reset the board
 * @param {Function} options.showIncorrectCells - Function to show incorrect cells (optional)
 * @param {Function} options.showHint - Function to show hint (optional)
 *
 * @returns {void}
 */
function useKeyboardInput(options) {
  const { boardState, inputHandler, resetBoard, showIncorrectCells, showHint } = options;

  const { selectedCell, setSelectedCell, originalBoard, board } = boardState;

  const { handleNumberInput, toggleNoteMode } = inputHandler;

  useEffect(() => {
    const keyDownHandler = (e) => {
      // Prevent default action for game control keys
      if ((e.key >= "1" && e.key <= "9") || e.key === "Delete" || e.key === "Backspace" || e.key.toLowerCase() === "n" || ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) || e.key.toLowerCase() === "h" || e.key.toLowerCase() === "c" || e.key.toLowerCase() === "p") {
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
        }
      }
      // Handle p key to toggle pen/pencil mode
      else if (e.key.toLowerCase() === "p" && toggleNoteMode) {
        toggleNoteMode();
      }
      // Handle h key for hint
      else if (e.key.toLowerCase() === "h" && showHint) {
        showHint();
      }
      // Handle c key for checking mistakes
      else if (e.key.toLowerCase() === "c" && showIncorrectCells) {
        showIncorrectCells();
      }
      // Handle n key for new game
      else if (e.key.toLowerCase() === "n" && resetBoard) {
        resetBoard();
      }
      // Handle arrow keys for navigation
      else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        navigateWithArrowKeys(e.key, selectedCell, board, setSelectedCell);
      }
    };

    /**
     * Navigate the board using arrow keys
     */
    const navigateWithArrowKeys = (key, selectedCell, board, setSelectedCell) => {
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

    window.addEventListener("keydown", keyDownHandler);

    // Return a cleanup function
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [selectedCell, originalBoard, handleNumberInput, toggleNoteMode, showHint, showIncorrectCells, resetBoard, board, setSelectedCell]);
}

export default useKeyboardInput;
