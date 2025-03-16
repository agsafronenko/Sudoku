import React from "react";
import "./Controls.css";

function Controls({ isNoteMode, toggleNoteMode, hintsRemaining, incorrectChecksRemaining, showHint, showIncorrectCells, startNewGame }) {
  const handleStartNewGame = () => {
    startNewGame();
  };

  return (
    <div className="controls-container">
      <button className={`control-button ${isNoteMode ? "active" : ""}`} onClick={toggleNoteMode}>
        {isNoteMode ? "Pencil Mode" : "Pen Mode"}
      </button>

      <button className="control-button hint" onClick={showHint} disabled={hintsRemaining <= 0}>
        Hint {hintsRemaining > 0 && `(${hintsRemaining})`}
      </button>

      <button className="control-button check" onClick={showIncorrectCells} disabled={incorrectChecksRemaining <= 0}>
        Check Mistakes {incorrectChecksRemaining > 0 && `(${incorrectChecksRemaining})`}
      </button>

      <button className="control-button new-game" onClick={handleStartNewGame}>
        New Game
      </button>
    </div>
  );
}

export default Controls;
