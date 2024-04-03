import React from 'react';

function Cell({ cell, onClick }) {
  return (
    <div
      className={`cell ${cell.isOpen ? 'open' : ''} ${cell.isFlagged ? 'flagged' : ''}`}
      onClick={onClick}
    >
      {cell.isOpen && !cell.isMine && cell.count > 0 && <span>{cell.count}</span>}
      {cell.isOpen && cell.isMine && <img src="/dolbiteFish.png" alt="shark" className="cell__image" />}
      {cell.isFlagged && !cell.isOpen && <span>🚩</span>}
    </div>
  );
}

export default Cell;
