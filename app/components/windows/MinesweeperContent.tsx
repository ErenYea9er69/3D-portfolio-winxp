'use client';

import { useState, useCallback } from 'react';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

function createBoard(): Cell[][] {
  // Create empty board
  const board: Cell[][] = Array(ROWS).fill(null).map(() =>
    Array(COLS).fill(null).map(() => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
    }))
  );

  // Place mines randomly
  let minesPlaced = 0;
  while (minesPlaced < MINES) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighbor mines
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!board[r][c].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].isMine) {
              count++;
            }
          }
        }
        board[r][c].neighborMines = count;
      }
    }
  }

  return board;
}

export default function MinesweeperContent() {
  const [board, setBoard] = useState<Cell[][]>(createBoard);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(MINES);

  const resetGame = useCallback(() => {
    setBoard(createBoard());
    setGameOver(false);
    setGameWon(false);
    setFlagsLeft(MINES);
  }, []);

  const revealCell = (row: number, col: number) => {
    if (gameOver || gameWon || board[row][col].isRevealed || board[row][col].isFlagged) return;

    const newBoard = board.map(r => r.map(c => ({ ...c })));

    if (newBoard[row][col].isMine) {
      // Game over - reveal all mines
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].isRevealed = true;
          }
        }
      }
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    // Flood fill reveal
    const reveal = (r: number, c: number) => {
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
      if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged || newBoard[r][c].isMine) return;

      newBoard[r][c].isRevealed = true;

      if (newBoard[r][c].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(r + dr, c + dc);
          }
        }
      }
    };

    reveal(row, col);
    setBoard(newBoard);

    // Check win condition
    let unrevealedSafe = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newBoard[r][c].isRevealed && !newBoard[r][c].isMine) {
          unrevealedSafe++;
        }
      }
    }
    if (unrevealedSafe === 0) {
      setGameWon(true);
    }
  };

  const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameOver || gameWon || board[row][col].isRevealed) return;

    const newBoard = board.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
    setFlagsLeft(prev => newBoard[row][col].isFlagged ? prev - 1 : prev + 1);
  };

  const getNumberColor = (num: number) => {
    const colors = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000', '#808080'];
    return colors[num] || '#000';
  };

  return (
    <div style={{ 
      padding: '8px',
      background: '#c0c0c0',
      margin: '-8px',
      height: 'calc(100% + 16px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: '8px',
        padding: '4px 8px',
        background: '#c0c0c0',
        border: '2px solid',
        borderColor: '#808080 #fff #fff #808080',
      }}>
        <div style={{
          background: '#000',
          color: '#ff0000',
          padding: '2px 6px',
          fontFamily: 'monospace',
          fontSize: '18px',
          fontWeight: 'bold',
        }}>
          {String(flagsLeft).padStart(3, '0')}
        </div>
        <button
          onClick={resetGame}
          style={{
            width: '28px',
            height: '28px',
            fontSize: '16px',
            cursor: 'pointer',
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#fff #808080 #808080 #fff',
          }}
        >
          {gameOver ? '😵' : gameWon ? '😎' : '🙂'}
        </button>
        <div style={{
          background: '#000',
          color: '#ff0000',
          padding: '2px 6px',
          fontFamily: 'monospace',
          fontSize: '18px',
          fontWeight: 'bold',
        }}>
          000
        </div>
      </div>

      {/* Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 18px)`,
        gap: '0px',
        border: '3px solid',
        borderColor: '#808080 #fff #fff #808080',
        background: '#c0c0c0',
      }}>
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => revealCell(r, c)}
              onContextMenu={(e) => toggleFlag(e, r, c)}
              style={{
                width: '18px',
                height: '18px',
                padding: 0,
                border: cell.isRevealed ? '1px solid #808080' : '2px solid',
                borderColor: cell.isRevealed ? undefined : '#fff #808080 #808080 #fff',
                background: cell.isRevealed ? '#c0c0c0' : '#c0c0c0',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                color: getNumberColor(cell.neighborMines),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {cell.isRevealed
                ? cell.isMine
                  ? '💣'
                  : cell.neighborMines > 0
                    ? cell.neighborMines
                    : ''
                : cell.isFlagged
                  ? '🚩'
                  : ''}
            </button>
          ))
        )}
      </div>

      {/* Game status */}
      {(gameOver || gameWon) && (
        <div style={{
          marginTop: '10px',
          padding: '4px 12px',
          background: gameWon ? '#90EE90' : '#ffcccc',
          border: '1px solid',
          borderColor: gameWon ? '#008000' : '#ff0000',
          fontSize: '12px',
          fontWeight: 'bold',
        }}>
          {gameWon ? '🎉 You Win!' : '💥 Game Over!'}
        </div>
      )}

      <div style={{ marginTop: '8px', fontSize: '9px', color: '#666' }}>
        Left-click to reveal • Right-click to flag
      </div>
    </div>
  );
}
