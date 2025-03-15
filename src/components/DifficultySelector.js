import React, { useState } from "react";
import "./DifficultySelector.css";

function DifficultySelector({ difficulty, setDifficulty }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const difficulties = [
    {
      id: "very-easy",
      label: "Very Easy",
      description: "40-45 empty cells. 5 hints and 3 mistake checks available.",
      emptyCells: "40-45",
      hints: 5,
      checks: 3,
    },
    {
      id: "easy",
      label: "Easy",
      description: "46-49 empty cells. 4 hints and 3 mistake checks available.",
      emptyCells: "46-49",
      hints: 4,
      checks: 3,
    },
    {
      id: "medium",
      label: "Medium",
      description: "50-54 empty cells. 3 hints and 2 mistake checks available.",
      emptyCells: "50-54",
      hints: 3,
      checks: 2,
    },
    {
      id: "hard",
      label: "Hard",
      description: "55-59 empty cells. 2 hints and 1 mistake check available.",
      emptyCells: "55-59",
      hints: 2,
      checks: 1,
    },
    {
      id: "expert",
      label: "Expert",
      description: "60-65 empty cells. 1 hint and 0 mistake checks available.",
      emptyCells: "60-65",
      hints: 1,
      checks: 0,
    },
  ];

  return (
    <div className="difficulty-container">
      <div className="difficulty-label">
        Difficulty:
        <div className="info-icon" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
          ℹ️
          {showTooltip && (
            <div className="tooltip-content">
              {difficulties.map((diff) => (
                <div key={diff.id} className="tooltip-item">
                  <strong>{diff.label}:</strong> {diff.description}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="difficulty-options">
        {difficulties.map((diff) => (
          <button key={diff.id} className={`difficulty-button ${difficulty === diff.id ? "active" : ""}`} onClick={() => setDifficulty(diff.id)}>
            {diff.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DifficultySelector;
