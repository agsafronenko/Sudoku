import React from 'react';
import './Cell.css';

function Cell({ 
  value, 
  notes, 
  isSelected, 
  isOriginal, 
  isIncorrect, 
  onClick,
  highlightValue
}) {
  const renderNotes = () => {
    const noteElements = [];
    
    for (let i = 1; i <= 9; i++) {
      noteElements.push(
        <div 
          key={i} 
          className={`note-item note-${i} ${notes.includes(i) ? 'visible' : ''}`}
        >
          {notes.includes(i) ? i : ''}
        </div>
      );
    }
    
    return <div className="notes-container">{noteElements}</div>;
  };
  
  const classes = [
    'cell',
    isSelected ? 'selected' : '',
    isOriginal ? 'original' : '',
    isIncorrect ? 'incorrect' : '',
    value === highlightValue && value !== 0 ? 'highlighted' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={classes}
      onClick={onClick}
    >
      {value === 0 ? (
        notes.length > 0 ? renderNotes() : <span className="empty"></span>
      ) : (
        <span className="value">{value}</span>
      )}
    </div>
  );
}

export default Cell;
