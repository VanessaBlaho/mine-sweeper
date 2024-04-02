import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [board, setBoard] = useState([]);
  const [flagMode, setFlagMode] = useState(false); // Flag mode toggle
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initBoard();
  }, []);

  function initBoard() {
    const newBoard = [];
    for (let i = 0; i < 5; i++) {
      const row = [];
      for (let j = 0; j < 5; j++) {
        row.push({
          row: i,
          col: j,
          isMine: false,
          isOpen: false,
          isFlagged: false,
          count: 0,
        });
      }
      newBoard.push(row);
    }
    setBoard(newBoard);
    generateMines(newBoard);
    calculateAdjacentMines(newBoard);
    setGameOver(false);
  }

  function generateMines(newBoard) {
    const totalMines = 3; // Total number of mines you want on the board

    // Generate unique random positions for mines
    const minePositions = [];
    while (minePositions.length < totalMines) {
      const row = Math.floor(Math.random() * 5); // Random row index (0 to 4)
      const col = Math.floor(Math.random() * 5); // Random column index (0 to 4)
      const position = `${row},${col}`;

      // Check if the position is not already a mine
      if (!minePositions.includes(position)) {
        minePositions.push(position);
        newBoard[row][col].isMine = true;
      }
    }
  }

  function calculateAdjacentMines(newBoard) {
    for (let i = 0; i < newBoard.length; i++) {
      for (let j = 0; j < newBoard[0].length; j++) {
        let count = 0;
  
        // Define offsets for adjacent cells
        const offsets = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],           [0, 1],
          [1, -1],  [1, 0],  [1, 1]
        ];
  
        // Iterate over adjacent cells
        offsets.forEach(([rowOffset, colOffset]) => {
          const newRow = i + rowOffset;
          const newCol = j + colOffset;
  
          // Check if the adjacent cell is within the board boundaries and is a mine
          if (isValidCell(newRow, newCol) && newBoard[newRow][newCol].isMine) {
            count++;
          }
        });
  
        // Update the count property of the current cell
        newBoard[i][j].count = count;
      }
    }
  }

  function handleClick(row, col) {
    if (gameOver) return; // If game is over, do nothing

    if (flagMode) {
      // If in flag mode, toggle flag on the cell
      const newBoard = [...board];
      newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
      setBoard(newBoard);
    } else {
      // If not in flag mode, handle cell click
      const newBoard = [...board];

      // If the cell is already open or flagged, do nothing
      if (newBoard[row][col].isOpen || newBoard[row][col].isFlagged) {
        return;
      }

      // Mark the cell as open
      newBoard[row][col].isOpen = true;

      // Check if it's a mine, if yes, end the game
      if (newBoard[row][col].isMine) {
        setGameOver(true); // Set game over state
      } else {
        // If it's not a mine, reveal adjacent cells if count is 0
        if (newBoard[row][col].count === 0) {
          revealAdjacentCells(newBoard, row, col);
        }
      }

      // Update the state with the new board
      setBoard(newBoard);
    }
  }

  function revealAdjacentCells(board, row, col) {
    // Define offsets for adjacent cells
    const offsets = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    // Iterate over adjacent cells
    offsets.forEach(([rowOffset, colOffset]) => {
      const newRow = row + rowOffset;
      const newCol = col + colOffset;

      // Check if the adjacent cell is within the board boundaries
      if (isValidCell(newRow, newCol) && !board[newRow][newCol].isOpen) {
        // Mark the adjacent cell as open
        board[newRow][newCol].isOpen = true;

        // If the adjacent cell count is 0, recursively reveal its adjacent cells
        if (board[newRow][newCol].count === 0) {
          revealAdjacentCells(board, newRow, newCol);
        }
      }
    });
  }

  function isValidCell(row, col) {
    // Check if the cell coordinates are within the board boundaries
    return row >= 0 && row < 5 && col >= 0 && col < 5;
  }

  const toggleFlagMode = () => {
    setFlagMode(!flagMode);
  };
  const restartGame = () => {
    initBoard();
  };
  const renderBoard = () => {
    return (
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`cell ${cell.isOpen ? 'open' : ''} ${cell.isFlagged ? 'flagged' : ''}`}
                onClick={() => handleClick(cell.row, cell.col)}
              >
                {cell.isOpen && !cell.isMine && cell.count > 0 && <span>{cell.count}</span>}
                {cell.isOpen && cell.isMine && <span>💣</span>}
                {cell.isFlagged && !cell.isOpen && <span>🚩</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Shark Avoidance Adventure</h1>
      {renderBoard()}
      {gameOver && (
        <div>
          <p>Game Over! You clicked on a mine.</p>
          <button onClick={restartGame}>Restart Game</button>
        </div>
      )}
      <div className="flag-toggle">
        <button onClick={toggleFlagMode}>{flagMode ? 'Select Mode' : 'Flag Mode'}</button>
      </div>
    </div>
  );
}

export default App;