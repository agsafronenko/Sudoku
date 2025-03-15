import React, { useState, useEffect } from "react";
import Cell from "./Cell";
import Controls from "./Controls";
import NumberPad from "./NumberPad";
import DifficultySelector from "./DifficultySelector";
import Modal from "./Modal";
import { generatePuzzle } from "../utils/sudokuGenerator";
import { checkSolution, isBoardFilled } from "../utils/gameLogic";
import "./GameBoard.css";

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

  // Initialize new game
  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty]);

  const startNewGame = (difficultyLevel) => {
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
  };

  const handleCellClick = (row, col) => {
    // Can't select cells that were filled initially
    if (originalBoard[row][col] !== 0) return;

    setSelectedCell({ row, col });
  };

  const handleNumberInput = (number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;

    // Only allow input on empty cells from the original board
    if (originalBoard[row][col] !== 0) return;

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
    } else {
      // Regular number placement
      newBoard[row][col] = number === newBoard[row][col] ? 0 : number;

      // Clear notes when a number is placed
      if (number !== 0) {
        const newNotes = [...notes];
        newNotes[row][col] = [];
        setNotes(newNotes);
      }

      setBoard(newBoard);

      // Check if board is filled
      if (isBoardFilled(newBoard)) {
        const correct = checkSolution(newBoard, solution);
        setGameComplete(true);
        setIsCorrect(correct);
        setShowModal(true);
        setModalMessage(correct ? "Congratulations! You've solved the puzzle correctly!" : "Oops! There are some mistakes in your solution.");
      }
    }
  };

  const toggleNoteMode = () => {
    setIsNoteMode(!isNoteMode);
  };

  const showIncorrectCells = () => {
    if (incorrectChecksRemaining <= 0) {
      setModalMessage("No incorrect checks remaining!");
      setShowModal(true);
      return;
    }

    setShowIncorrect(true);
    setTimeout(() => setShowIncorrect(false), 2000);
    setIncorrectChecksRemaining(incorrectChecksRemaining - 1);
  };

  const useHint = () => {
    if (hintsRemaining <= 0) {
      return;
    }

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

    setBoard(newBoard);
    setNotes(newNotes);
    setHintsRemaining(hintsRemaining - 1);

    // Check if board is filled after hint
    if (isBoardFilled(newBoard)) {
      const correct = checkSolution(newBoard, solution);
      setGameComplete(true);
      setIsCorrect(correct);
      setShowModal(true);
      setModalMessage(correct ? "Congratulations! You've solved the puzzle correctly!" : "Oops! There are some mistakes in your solution.");
    }
  };

  const clearIncorrectCells = () => {
    const newBoard = [...board];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (newBoard[i][j] !== 0 && newBoard[i][j] !== solution[i][j]) {
          newBoard[i][j] = 0;
        }
      }
    }

    setBoard(newBoard);
    setGameComplete(false);
  };

  return (
    <div className="game-container">
      <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />

      <div className="board-container">
        <div className={`sudoku-board ${gameComplete ? (isCorrect ? "correct" : "incorrect") : ""}`}>
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

      <Controls isNoteMode={isNoteMode} toggleNoteMode={toggleNoteMode} hintsRemaining={hintsRemaining} incorrectChecksRemaining={incorrectChecksRemaining} useHint={useHint} showIncorrectCells={showIncorrectCells} startNewGame={() => startNewGame(difficulty)} />

      <NumberPad onNumberSelect={handleNumberInput} />

      {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} onAction={!isCorrect ? clearIncorrectCells : null} actionText={!isCorrect ? "Clear Incorrect" : null} />}
    </div>
  );
}

export default GameBoard;
