import React from 'react';
import Row from './Row';

function Board({ board, onClick }) {
  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <Row key={rowIndex} row={row} onClick={onClick} />
      ))}
    </div>
  );
}

export default Board;
