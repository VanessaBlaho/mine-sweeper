import React from 'react';
import Cell from './Cell';

function Row({ row, onClick }) {
  return (
    <div className="row">
      {row.map((cell, colIndex) => (
        <Cell key={colIndex} cell={cell} onClick={() => onClick(cell.row, cell.col)} />
      ))}
    </div>
  );
}

export default Row;
