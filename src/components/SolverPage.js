import React, { useEffect, useRef } from "react";

import Cell from "./Cell";
import NumberPad from "./NumberPad";
import Modal from "./Modal";
import MuteButton from "./MuteButton";
import { SolvePageKeyInfo } from "./KeyboardShortcutsInfo";

import { solveSudoku } from "../utils/sudokuSolver";
import { playSound } from "../utils/soundUtils";

import { useAnimations } from "../hooks/useAnimations";
import useBoardState from "../hooks/useBoardState";
import useInputHandler from "../hooks/useInputHandler";
import useKeyboardInput from "../hooks/useKeyboardInput";
import useModal from "../hooks/useModal";

import "./SolverPage.css";

function SolverPage() {
  // Get animation functions from custom hook
  const { setBoardRef, animateNewGame, animateWin, animateCellSelect, animateNumberInput } = useAnimations();

  // Board ref for direct DOM manipulations
  const boardElementRef = useRef(null);

  // Set up the board ref when the component mounts
  useEffect(() => {
    if (boardElementRef.current) {
      setBoardRef(boardElementRef.current);
    }
  }, [setBoardRef, boardElementRef]);

  // Board state management (solver mode)
  const boardState = useBoardState({
    isGameMode: false,
  });

  const { board, selectedCell, resetBoard, setSolution } = boardState;

  // Modal management
  const { showSuccessModal, showErrorModal, modalProps } = useModal();

  // Input handling
  const inputHandler = useInputHandler({
    boardState,
    animateCellSelect,
    animateNumberInput,
  });

  const { handleCellClick, handleNumberInput } = inputHandler;

  const clearBoard = () => {
    playSound("clear");
    modalProps.onClose();
    resetBoard();

    // Apply the new game animation
    setTimeout(() => {
      animateNewGame();
    }, 100);
  };

  // Keyboard input handling
  useKeyboardInput({
    boardState,
    inputHandler,
    resetBoard: clearBoard,
    allowNoteMode: false,
  });

  const solvePuzzle = () => {
    playSound("clickButton");
    const boardCopy = JSON.parse(JSON.stringify(board));

    const result = solveSudoku(boardCopy);

    if (result.solved) {
      setSolution(result.board);
      showSuccessModal("Puzzle solved!");

      // Apply win animation after solution is displayed
      setTimeout(() => {
        animateWin();
      }, 100);
    } else {
      showErrorModal("This puzzle cannot be solved. Please check your input.");
    }
  };

  useEffect(() => {
    playSound("new");

    // Apply new game animation on initial load
    setTimeout(() => {
      animateNewGame();
    }, 300);
  }, [animateNewGame]);

  return (
    <div className="solver-container">
      <MuteButton />
      <h2 className="solver-title">Sudoku Solver</h2>
      <p className="solver-instructions">Enter the numbers you want to solve, then click "Solve". Use keyboard numbers 1-9 to input values, or Delete/Backspace to clear cells.</p>

      <div className="board-container">
        <div className="sudoku-board" ref={boardElementRef}>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <Cell key={`${rowIndex}-${colIndex}`} value={cell} notes={[]} isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex} isOriginal={boardState.solution ? true : false} isIncorrect={false} onClick={() => handleCellClick(rowIndex, colIndex)} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="solver-controls">
        <button className="solver-button solve" onClick={solvePuzzle} disabled={!!boardState.solution}>
          Solve
        </button>
        <button className="solver-button clear" onClick={clearBoard}>
          Clear Board
        </button>
      </div>

      {!boardState.solution && <NumberPad onNumberSelect={handleNumberInput} />}

      <SolvePageKeyInfo />

      {modalProps.showModal && <Modal {...modalProps} />}
    </div>
  );
}

export default SolverPage;
