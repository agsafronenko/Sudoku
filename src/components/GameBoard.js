import React, { useState, useEffect, useRef } from "react";
import Cell from "./Cell";
import Controls from "./Controls";
import NumberPad from "./NumberPad";
import DifficultySelector from "./DifficultySelector";
import Modal from "./Modal";
import MuteButton from "./MuteButton";
import { generatePuzzle } from "../utils/sudokuGenerator";
import { checkSolution, isBoardFilled, findIncorrectCells } from "../utils/gameLogic";
import { playSound } from "../utils/soundUtils";
import { setupKeyboardListeners } from "../utils/keyboardHandler";
import { useAnimations } from "../hooks/useAnimations";
import "./GameBoard.css";
import { PlayPageKeyInfo } from "./KeyboardShortcutsInfo";

function GameBoard() {
  const [difficulty, setDifficulty] = useState("medium");
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [originalBoard, setOriginalBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [notes, setNotes] = useState(
    Array(9)
      .fill()
      .map(() =>
        Array(9)
          .fill()
          .map(() => [])
      )
  );
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState(0);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [incorrectChecksRemaining, setIncorrectChecksRemaining] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
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
  }, [boardElementRef.current]);

  // Initialize new game
  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty]);

  // Add keyboard event listener using the utility
  useEffect(() => {
    const cleanup = setupKeyboardListeners({
      selectedCell,
      originalBoard,
      handleNumberInput,
      toggleNoteMode,
      notes,
      setNotes,
      setSelectedCell,
      showHint,
      showIncorrectCells,
      startNewGame: () => startNewGame(difficulty),
    });
    return cleanup;
  }, [selectedCell, originalBoard, difficulty]);

  const startNewGame = (difficultyLevel) => {
    setIsAnimating(true);
    playSound("new");

    // Add delay before starting new game for animation
    setTimeout(() => {
      const { puzzle, solution: fullSolution } = generatePuzzle(difficultyLevel);
      setBoard(JSON.parse(JSON.stringify(puzzle)));
      setSolution(fullSolution);
      setOriginalBoard(JSON.parse(JSON.stringify(puzzle)));
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
      setShowIncorrect(false);

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
      setShowModal(false);

      setTimeout(() => {
        animateNewGame();
      }, 50);
    }, 300);
  };

  const handleCellClick = (row, col) => {
    // Can't select cells that were filled initially
    if (originalBoard[row][col] !== 0) return;

    playSound("clickCell");
    setSelectedCell({ row, col });
    animateCellSelect(row, col);
  };

  const handleNumberInput = (number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    // Only allow input on empty cells from the original board
    if (originalBoard[row][col] !== 0) return;

    if (number === 0) {
      playSound("clear");
    } else {
      playSound("clickButton");
    }
    const newBoard = [...board];

    if (isNoteMode) {
      // Handle notes mode
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

      // Animate the notes change
      animateNumberInput(row, col, true);
    } else {
      // Regular number placement
      const isChanging = newBoard[row][col] !== number;
      const isClearingCell = number === 0;

      newBoard[row][col] = number === newBoard[row][col] ? 0 : number;

      // Clear notes when a number is placed
      if (number !== 0) {
        const newNotes = [...notes];
        newNotes[row][col] = [];
        setNotes(newNotes);
      }

      setBoard(newBoard);

      // Animate the number input
      if (isChanging && !isClearingCell) {
        animateNumberInput(row, col, false);
      }

      // Check if board is filled
      if (isBoardFilled(newBoard)) {
        const correct = checkSolution(newBoard, solution);
        setGameComplete(true);
        setIsCorrect(correct);

        setTimeout(() => {
          // Show win or lose animation
          if (correct) {
            animateWin();
            playSound("congratulations");
          } else {
            animateLose();
            playSound("failed");
          }

          // Show modal after animation
          setTimeout(() => {
            setShowModal(true);
            if (correct) {
              setModalMessage("Congratulations! You've solved the puzzle correctly!");
            } else {
              setModalMessage("Oops! There are some mistakes in your solution.");
            }
          }, 1000);
        }, 300);
      }
    }
  };

  const toggleNoteMode = () => {
    playSound("clickButton");
    setIsNoteMode(!isNoteMode);
    setSelectedCell(null);
  };

  const showIncorrectCells = () => {
    if (incorrectChecksRemaining <= 0) {
      return;
    }

    const incorrectCells = findIncorrectCells(board, solution);
    if (incorrectCells.length > 0) {
      playSound("failed");
      animateLose();
    } else {
      playSound("hint");
    }

    setShowIncorrect(true);
    setTimeout(() => setShowIncorrect(false), 2000);
    setIncorrectChecksRemaining(incorrectChecksRemaining - 1);
  };

  const showHint = () => {
    if (hintsRemaining <= 0) {
      return;
    }

    playSound("hint");

    // Find an empty cell
    const emptyCells = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) return;

    // Select a random empty cell
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const { row, col } = randomCell;

    // Fill with correct value
    const newBoard = [...board];
    newBoard[row][col] = solution[row][col];

    // Clear notes for this cell
    const newNotes = [...notes];
    newNotes[row][col] = [];

    // Highlight the hint cell
    setSelectedCell({ row, col });

    setTimeout(() => {
      animateHint(row, col);
    }, 50);

    setBoard(newBoard);
    setNotes(newNotes);
    setHintsRemaining(hintsRemaining - 1);

    // Check if board is filled after hint
    if (isBoardFilled(newBoard)) {
      const correct = checkSolution(newBoard, solution);
      setGameComplete(true);
      setIsCorrect(correct);

      setTimeout(() => {
        if (correct) {
          animateWin();
          playSound("congratulations");
        } else {
          animateLose();
          playSound("failed");
        }

        setTimeout(() => {
          setShowModal(true);
          if (correct) {
            setModalMessage("Congratulations! You've solved the puzzle correctly!");
          } else {
            setModalMessage("Oops! There are some mistakes in your solution.");
          }
        }, 1000);
      }, 300);
    }
  };

  const clearIncorrectCells = () => {
    playSound("clear");

    const newBoard = [...board];
    const incorrectCells = [];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (newBoard[i][j] !== 0 && newBoard[i][j] !== solution[i][j]) {
          incorrectCells.push({ row: i, col: j });
          newBoard[i][j] = 0;
        }
      }
    }

    setBoard(newBoard);
    setGameComplete(false);
    setShowModal(false);
  };

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
                  notes={notes[rowIndex][colIndex]}
                  isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                  isOriginal={originalBoard[rowIndex][colIndex] !== 0}
                  isIncorrect={showIncorrect && cell !== 0 && cell !== solution[rowIndex][colIndex]}
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

      {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} onAction={!isCorrect ? clearIncorrectCells : null} actionText={!isCorrect ? "Clear Incorrect" : null} />}
    </div>
  );
}

export default GameBoard;
