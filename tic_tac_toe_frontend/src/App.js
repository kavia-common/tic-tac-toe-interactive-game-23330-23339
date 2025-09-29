import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App renders the Tic Tac Toe game with Ocean Professional theme.
 * Features:
 * - Play vs Player or vs Computer
 * - Shows next turn, win, or draw status
 * - Reset game
 * - Modern, clean layout with smooth transitions
 */
function App() {
  // Theme variables applied via CSS in App.css
  const [mode, setMode] = useState('pvp'); // 'pvp' | 'pvc'
  const [board, setBoard] = useState(Array(9).fill(null)); // 0..8 cells
  const [xIsNext, setXIsNext] = useState(true);
  const [started, setStarted] = useState(false);

  const winnerInfo = useMemo(() => calculateWinner(board), [board]);
  const isDraw = useMemo(() => !winnerInfo && board.every(Boolean), [board, winnerInfo]);
  const nextPlayer = xIsNext ? 'X' : 'O';

  const canPlay = !winnerInfo && !isDraw;

  // PUBLIC_INTERFACE
  function startNewGame(selectedMode) {
    setMode(selectedMode);
    resetBoard();
    setStarted(true);
  }

  // PUBLIC_INTERFACE
  function resetBoard() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  function handleCellClick(index) {
    if (!canPlay) return;
    if (board[index]) return;

    const updated = board.slice();
    updated[index] = nextPlayer;
    setBoard(updated);
    setXIsNext(!xIsNext);

    // If playing vs computer and after human move, trigger computer
    const willBeWinner = calculateWinner(updated);
    const willBeDraw = !willBeWinner && updated.every(Boolean);

    if (mode === 'pvc' && !willBeWinner && !willBeDraw) {
      // If the move we just placed was X and mode is pvc, let's choose that X is human by default.
      // Human is X, Computer is O.
      const isComputerTurn = !xIsNext === false; // after setXIsNext(!xIsNext) above; but state not yet updated here
      // More robust: derive from symbol to move next using updated array:
      const symbolNext = getNextSymbol(updated);
      if (symbolNext === 'O') {
        // Computer makes a move using a simple AI
        setTimeout(() => {
          computerMove(updated);
        }, 250); // small delay for nicer UX
      }
    }
  }

  function computerMove(currentBoard) {
    if (!currentBoard) return;
    if (calculateWinner(currentBoard) || currentBoard.every(Boolean)) return;

    const moveIndex = chooseBestMove(currentBoard, 'O', 'X');
    if (moveIndex == null) return;

    const newBoard = currentBoard.slice();
    newBoard[moveIndex] = 'O';
    setBoard(newBoard);
    setXIsNext(true);
  }

  // Compute status text
  const statusText = (() => {
    if (winnerInfo) {
      return `Winner: ${winnerInfo.winner}`;
    }
    if (isDraw) {
      return `It's a draw`;
    }
    return `Next Turn: ${nextPlayer}`;
  })();

  return (
    <div className="ocean-app">
      <div className="ocean-gradient" />
      <header className="ocean-header">
        <h1 className="ocean-title">Tic Tac Toe</h1>
        <p className="ocean-subtitle">Ocean Professional</p>
      </header>

      <main className="ocean-main">
        <section className="game-card" aria-label="Tic Tac Toe game">
          <div className="game-header">
            <div className={`status-badge ${winnerInfo ? 'win' : isDraw ? 'draw' : 'next'}`}>
              {statusIcon(winnerInfo, isDraw)}
              <span>{statusText}</span>
            </div>

            <div className="mode-selector" role="group" aria-label="Game mode">
              <button
                className={`btn-chip ${mode === 'pvp' ? 'active' : ''}`}
                onClick={() => setMode('pvp')}
                aria-pressed={mode === 'pvp'}
              >
                👥 Player vs Player
              </button>
              <button
                className={`btn-chip ${mode === 'pvc' ? 'active' : ''}`}
                onClick={() => setMode('pvc')}
                aria-pressed={mode === 'pvc'}
              >
                🤖 Player vs Computer
              </button>
            </div>
          </div>

          <Board
            cells={board}
            onCellClick={handleCellClick}
            winningLine={winnerInfo?.line}
          />

          <div className="controls">
            {!started ? (
              <div className="start-actions">
                <button className="btn primary" onClick={() => startNewGame(mode)}>
                  Start Game
                </button>
              </div>
            ) : (
              <div className="in-game-actions">
                <button className="btn surface" onClick={resetBoard}>
                  Reset Board
                </button>
                <button
                  className="btn outline"
                  onClick={() => {
                    resetBoard();
                    setStarted(false);
                  }}
                >
                  End Game
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="ocean-footer">
        <p>
          Built with <span className="accent">React</span>. Theme: Ocean Professional.
        </p>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Board renders the 3x3 grid and handles click inputs via props.
 */
function Board({ cells, onCellClick, winningLine }) {
  return (
    <div className="board" role="grid" aria-label="Game board">
      {cells.map((val, i) => {
        const isWin = winningLine?.includes(i);
        return (
          <button
            key={i}
            className={`cell ${isWin ? 'win' : ''}`}
            onClick={() => onCellClick(i)}
            role="gridcell"
            aria-label={`Cell ${i + 1}, ${val || 'empty'}`}
          >
            <span className={`mark ${val === 'X' ? 'x' : val === 'O' ? 'o' : ''}`}>
              {val}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Helper: Calculate winner */
function calculateWinner(sq) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6], // diagonals
  ];
  for (const [a,b,c] of lines) {
    if (sq[a] && sq[a] === sq[b] && sq[a] === sq[c]) {
      return { winner: sq[a], line: [a,b,c] };
    }
  }
  return null;
}

/** Helper: derive next symbol from board count */
function getNextSymbol(sq) {
  const xCount = sq.filter(v => v === 'X').length;
  const oCount = sq.filter(v => v === 'O').length;
  return xCount === oCount ? 'X' : 'O';
}

/**
 * Very simple AI:
 * 1. Win if possible
 * 2. Block opponent's winning move
 * 3. Take center if available
 * 4. Take a corner
 * 5. Take any side
 */
function chooseBestMove(sq, ai = 'O', human = 'X') {
  const emptyIndices = sq.map((v, i) => (v ? null : i)).filter(i => i !== null);

  // Try to win
  for (const idx of emptyIndices) {
    const test = sq.slice();
    test[idx] = ai;
    if (calculateWinner(test)?.winner === ai) return idx;
  }

  // Block human
  for (const idx of emptyIndices) {
    const test = sq.slice();
    test[idx] = human;
    if (calculateWinner(test)?.winner === human) return idx;
  }

  // Center
  if (emptyIndices.includes(4)) return 4;

  // Corners
  const corners = [0, 2, 6, 8];
  const openCorner = corners.find(c => emptyIndices.includes(c));
  if (openCorner !== undefined) return openCorner;

  // Sides
  return emptyIndices[0] ?? null;
}

/** Status icon component helper */
function statusIcon(winnerInfo, isDraw) {
  if (winnerInfo) {
    return <span className="dot win-dot" aria-hidden>🏆</span>;
  }
  if (isDraw) {
    return <span className="dot draw-dot" aria-hidden>🤝</span>;
  }
  return <span className="dot next-dot" aria-hidden>⏱️</span>;
}

export default App;
