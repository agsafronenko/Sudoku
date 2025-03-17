import React from "react";
import "./KeyboardShortcutsInfo.css";

export function PlayPageKeyInfo({ isVisible = true }) {
  // export function PlayBoardKeyInfo({ isVisible = true }) {
  if (!isVisible) return null;

  return (
    <div className="keyboard-controls-info">
      <p>Keyboard shortcuts:</p>
      <div>
        <span className="keyboard-shortcut">1-9</span> Enter numbers
        <span className="keyboard-shortcut">Backspace/Del</span> Clear cell
      </div>
      <div>
        <span className="keyboard-shortcut">P</span> Toggle Pen/Pencil mode
        <span className="keyboard-shortcut">H</span> Use hint
      </div>
      <div>
        <span className="keyboard-shortcut">C</span> Check mistakes
        <span className="keyboard-shortcut">N</span> New game
      </div>
      <div>
        <span className="keyboard-shortcut">↑↓←→</span> Navigate board
      </div>
    </div>
  );
}

export function SolvePageKeyInfo({ isVisible = true }) {
  if (!isVisible) return null;

  return (
    <div className="keyboard-controls-info">
      <p>Keyboard shortcuts:</p>
      <div>
        <span className="keyboard-shortcut">1-9</span> Enter numbers
        <span className="keyboard-shortcut">Backspace/Del</span> Clear cell
      </div>
      <div>
        <span className="keyboard-shortcut">↑↓←→</span> Navigate board
      </div>
    </div>
  );
}
