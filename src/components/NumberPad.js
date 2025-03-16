import React from "react";
import "./NumberPad.css";

function NumberPad({ onNumberSelect }) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div className="number-pad">
      {numbers.map((num) => (
        <button key={num} className={`number-button ${num === 0 ? "erase" : ""}`} onClick={() => onNumberSelect(num)}>
          {num === 0 ? <span className="icon">✕</span> : num}
        </button>
      ))}
    </div>
  );
}

export default NumberPad;
