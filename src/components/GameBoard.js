import React, { useState, useEffect, useRef, useCallback } from "react";

import Cell from "./Cell";
import Controls from "./Controls";
import NumberPad from "./NumberPad";
import DifficultySelector from "./DifficultySelector";
import Modal from "./Modal";
import MuteButton from "./MuteButton";
import { PlayPageKeyInfo } from "./KeyboardShortcutsInfo";

import { generatePuzzle } from "../utils/sudokuGenerator";
import { playSound } from "../utils/soundUtils";

import { useAnimations } from "../hooks/useAnimations";
import useBoardState from "../hooks/useBoardState";
import useInputHandler from "../hooks/useInputHandler";
import useKeyboardInput from "../hooks/useKeyboardInput";
import useModal from "../hooks/useModal";

import "./GameBoard.css";

function GameBoard() {
  const [difficulty, setDifficulty] = useState("medium");
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [incorrectChecksRemaining, setIncorrectChecksRemaining] = useState(2);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Get animation functions from custom hook
  const { setBoardRef, animateNewGame, animateWin, animateLose, animateCellSelect, animateNumberInput, animateHint } = useAnimations();

  // Board ref for direct DOM manipulations
  const boardElementRef = useRef(null);

  // Set up the board ref when the component mounts
  useEffect(() => {
    if (boardElementRef.current) {
      setBoardRef(boardElementRef.current);
    }
  }, [setBoardRef, boardElementRef]);

  // Board state management
  const boardState = useBoardState({
    isGameMode: true,
    generateInitialBoard: generatePuzzle,
  });

  const { board, originalBoard, selectedCell, gameComplete, isCorrect, resetBoard, getIncorrectCells } = boardState;

  // Modal management
  const { showSuccessModal, showErrorModal, modalProps } = useModal();
  const { onClose: hideModal } = modalProps;

  const showIncorrectCells = useCallback(() => {
    if (incorrectChecksRemaining <= 0) {
      return;
    }

    const incorrectCells = getIncorrectCells();
    if (incorrectCells.length > 0) {
      playSound("failed");
      animateLose();
    } else {
      playSound("hint");
    }

    setShowIncorrect(true);
    setTimeout(() => setShowIncorrect(false), 2000);
    setIncorrectChecksRemaining(incorrectChecksRemaining - 1);
  }, [animateLose, incorrectChecksRemaining, getIncorrectCells]);

  const clearIncorrectCells = useCallback(() => {
    playSound("clear");

    const newBoard = [...board];
    const solution = boardState.solution;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (newBoard[i][j] !== 0 && newBoard[i][j] !== solution[i][j]) {
          newBoard[i][j] = 0;
        }
      }
    }

    boardState.setBoard(newBoard);
  }, [board, boardState]);

  // Handle game completion
  const handleCompletionCheck = useCallback(
    (correct) => {
      setTimeout(() => {
        if (correct) {
          animateWin();
          showSuccessModal("Congratulations! You've solved the puzzle correctly!");
        } else {
          animateLose();
          showErrorModal("Oops! There are some mistakes in your solution.", clearIncorrectCells, "Clear Incorrect");
        }
      }, 300);
    },
    [animateWin, animateLose, showSuccessModal, showErrorModal, clearIncorrectCells]
  );

  // Input handling
  const inputHandler = useInputHandler({
    boardState,
    onCompletionCheck: handleCompletionCheck,
    animateCellSelect,
    animateNumberInput,
    animateHint,
  });

  const { isNoteMode, toggleNoteMode, handleCellClick, handleNumberInput, showHint: showHintHandler } = inputHandler;

  // Keyboard input handling
  useKeyboardInput({
    boardState,
    inputHandler,
    resetBoard: () => startNewGame(difficulty),
    showIncorrectCells,
  });

  const startNewGame = useCallback(
    (difficultyLevel) => {
      setIsAnimating(true);
      playSound("new");

      // Add delay before starting new game for animation
      setTimeout(() => {
        resetBoard(difficultyLevel);

        // Set hints based on difficulty
        const hintCounts = {
          "very-easy": 5,
          easy: 4,
          medium: 3,
          hard: 2,
          expert: 1,
        };
        setHintsRemaining(hintCounts[difficultyLevel]);

        // Set incorrect checks based on difficulty
        const incorrectCheckCounts = {
          "very-easy": 3,
          easy: 3,
          medium: 2,
          hard: 1,
          expert: 0,
        };
        setIncorrectChecksRemaining(incorrectCheckCounts[difficultyLevel]);
        setIsAnimating(false);
        hideModal();
        setTimeout(() => {
          animateNewGame();
        }, 50);
      }, 300);
    },
    [animateNewGame, resetBoard, hideModal]
  );

  // Initialize new game
  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty, startNewGame]);

  const showHint = useCallback(() => {
    if (hintsRemaining <= 0) {
      return;
    }

    const hintUsed = showHintHandler();
    if (hintUsed) {
      const hintsCounter = hintsRemaining - 1;
      setHintsRemaining(hintsCounter);
    }
  }, [hintsRemaining, showHintHandler]);

  return (
    <div className={`game-container ${isAnimating ? "animating" : ""} ${gameComplete ? (isCorrect ? "completed-correct" : "completed-incorrect") : ""}`}>
      <MuteButton />
      <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />

      <div className="board-container">
        <div className={`sudoku-board ${gameComplete ? (isCorrect ? "correct" : "incorrect") : ""}`} ref={boardElementRef}>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  value={cell}
                  notes={boardState.notes[rowIndex][colIndex]}
                  isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                  isOriginal={originalBoard[rowIndex][colIndex] !== 0}
                  isIncorrect={showIncorrect && cell !== 0 && cell !== boardState.solution[rowIndex][colIndex]}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  highlightValue={selectedCell && board[selectedCell.row][selectedCell.col] !== 0 ? board[selectedCell.row][selectedCell.col] : null}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <Controls isNoteMode={isNoteMode} toggleNoteMode={toggleNoteMode} hintsRemaining={hintsRemaining} incorrectChecksRemaining={incorrectChecksRemaining} showHint={showHint} showIncorrectCells={showIncorrectCells} startNewGame={() => startNewGame(difficulty)} />

      <NumberPad onNumberSelect={handleNumberInput} />

      <PlayPageKeyInfo />

      {modalProps.showModal && <Modal {...modalProps} />}
    </div>
  );
}

export default GameBoard;
