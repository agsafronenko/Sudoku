import React from 'react';
import './NumberPad.css';

function NumberPad({ onNumberSelect }) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  return (
    <div className="number-pad">
      {numbers.map(num => (
        <button 
          key={num} 
          className="number-button"
          onClick={() => onNumberSelect(num)}
        >
          {num}
        </button>
      ))}
      <button 
        className="number-button erase"
        onClick={() => onNumberSelect(0)}
      >
        <span className="icon">✕</span>
      </button>
    </div>
  );
}

export default NumberPad;
