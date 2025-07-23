import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Color Theme (from container_details):
 * primary:   #228be6
 * secondary: #495057
 * accent:    #fa5252
 */

// PUBLIC_INTERFACE
function App() {
  // State: game board, next player, winner, winningCells, score
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState({ winner: null, line: null });
  const [scoreboard, setScoreboard] = useState({ X: 0, O: 0, draws: 0 });

  // PUBLIC_INTERFACE
  // Reset only board, not scoreboard
  function resetBoard() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinnerInfo({ winner: null, line: null });
  }

  // PUBLIC_INTERFACE
  // Full reset, including scoreboard
  function resetAll() {
    resetBoard();
    setScoreboard({ X: 0, O: 0, draws: 0 });
  }

  // Check for win/draw after every move
  useEffect(() => {
    const info = calculateWinner(board);
    if (info.winner || info.isDraw) {
      setWinnerInfo({ winner: info.winner, line: info.line });
      if (info.winner) {
        setScoreboard(prev => ({ ...prev, [info.winner]: prev[info.winner] + 1 }));
      } else if (info.isDraw) {
        setScoreboard(prev => ({ ...prev, draws: prev.draws + 1 }));
      }
    }
  }, [board]);

  // PUBLIC_INTERFACE
  // Handle square click
  function handleClick(idx) {
    if (board[idx] || winnerInfo.winner || (winnerInfo.line && winnerInfo.line.length > 0)) return;
    const updated = [...board];
    updated[idx] = xIsNext ? 'X' : 'O';
    setBoard(updated);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  // Helper - get status string
  function getStatus() {
    if (winnerInfo.winner) {
      return `Winner: Player ${winnerInfo.winner}`;
    } else if (calculateWinner(board).isDraw) {
      return `Game is a draw`;
    }
    return `Next: Player ${xIsNext ? 'X' : 'O'}`;
  }

  // THEME SUPPORT (retaining template functionality)
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Render
  return (
    <div className="App">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <main className="ttt-main">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status">{getStatus()}</div>
        <Board
          board={board}
          onCellClick={handleClick}
          winLine={winnerInfo.line}
        />
        <div className="ttt-scoreboard-reset">
          <Scoreboard {...scoreboard} />
          <button className="ttt-reset-btn" onClick={resetBoard}>Reset Board</button>
          <button className="ttt-reset-btn ttt-reset-all" onClick={resetAll}>Reset All</button>
        </div>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ board, onCellClick, winLine }) {
  function renderCell(idx) {
    let className = "ttt-cell";
    if (winLine && winLine.includes(idx)) className += " ttt-cell-winline";
    return (
      <button
        className={className}
        key={idx}
        onClick={() => onCellClick(idx)}
        aria-label={`Cell ${idx + 1}`}
        disabled={!!board[idx] || (winLine && winLine.length > 0)}
      >
        {board[idx]}
      </button>
    );
  }

  let rows = [];
  for (let r = 0; r < 3; r++) {
    rows.push(
      <div className="ttt-row" key={r}>
        {renderCell(r * 3 + 0)}
        {renderCell(r * 3 + 1)}
        {renderCell(r * 3 + 2)}
      </div>
    );
  }
  return <div className="ttt-board">{rows}</div>;
}

// PUBLIC_INTERFACE
function Scoreboard({ X, O, draws }) {
  return (
    <div className="ttt-scoreboard" aria-label="Scoreboard">
      <span className="ttt-score ttt-score-x">X: {X}</span>
      <span className="ttt-score ttt-score-o">O: {O}</span>
      <span className="ttt-score ttt-score-draw">Draws: {draws}</span>
    </div>
  );
}

// PUBLIC_INTERFACE
function calculateWinner(cells) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a], line, isDraw: false };
    }
  }
  if (cells.every(Boolean)) {
    return { winner: null, line: null, isDraw: true };
  }
  return { winner: null, line: null, isDraw: false };
}

export default App;
