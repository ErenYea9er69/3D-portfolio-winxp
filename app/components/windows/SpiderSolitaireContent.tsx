'use client';

import { useState, useCallback, useRef } from 'react';


// ─── Card Data ──────────────────────────────────────────────────────
const SUITS = ['♠'] as const; // 1-suit mode for playability
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;

interface Card {
  suit: string;
  value: string;
  faceUp: boolean;
  rank: number; // 1-13
}

function createDeck(): Card[] {
  const deck: Card[] = [];
  // 8 decks for spider solitaire (8 suits of spades)
  for (let d = 0; d < 8; d++) {
    for (let v = 0; v < VALUES.length; v++) {
      deck.push({ suit: SUITS[0], value: VALUES[v], faceUp: false, rank: v + 1 });
    }
  }
  return deck;
}

function shuffle(arr: Card[]): Card[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function canStackOn(moving: Card, target: Card): boolean {
  return target.rank === moving.rank + 1;
}

function isSequenceDescending(cards: Card[]): boolean {
  for (let i = 1; i < cards.length; i++) {
    if (cards[i].rank !== cards[i - 1].rank - 1) return false;
    if (!cards[i].faceUp) return false;
  }
  return true;
}

// ─── Component ──────────────────────────────────────────────────────
export default function SpiderSolitaireContent() {
  const initGame = useCallback(() => {
    const deck = shuffle(createDeck());
    const cols: Card[][] = Array.from({ length: 10 }, () => []);
    let idx = 0;
    // Deal: 6 cards to first 4 columns, 5 to remaining 6
    for (let c = 0; c < 10; c++) {
      const count = c < 4 ? 6 : 5;
      for (let r = 0; r < count; r++) {
        const card = deck[idx++];
        card.faceUp = r === count - 1;
        cols[c].push(card);
      }
    }
    const stock = deck.slice(idx);
    return { columns: cols, stock, completed: 0, moves: 0 };
  }, []);

  const [columns, setColumns] = useState<Card[][]>(() => initGame().columns);
  const [stock, setStock] = useState<Card[]>(() => {
    const deck = shuffle(createDeck());
    return deck.slice(54);
  });
  const [completed, setCompleted] = useState(0);
  const [moves, setMoves] = useState(0);
  const [dragState, setDragState] = useState<{
    colIdx: number;
    cardIdx: number;
    cards: Card[];
  } | null>(null);
  const [won, setWon] = useState(false);
  const [hintCol, setHintCol] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const newGame = useCallback(() => {
    const g = initGame();
    setColumns(g.columns);
    setStock(g.stock);
    setCompleted(0);
    setMoves(0);
    setWon(false);
    setDragState(null);
    setHintCol(null);
  }, [initGame]);

  // Initialize properly on first render
  const initialized = useRef(false);
  if (!initialized.current) {
    initialized.current = true;
    const g = initGame();
    // We already set initial state via useState initializers, but let's ensure stock is correct
    if (stock.length === 0 && columns.every(c => c.length === 0)) {
      // Re-init if state is empty
      const g2 = initGame();
      setColumns(g2.columns);
      setStock(g2.stock);
    }
    void g; // suppress unused warning
  }

  const dealRow = useCallback(() => {
    if (stock.length === 0) return;
    // Must have at least 1 card in each column to deal
    if (columns.some(col => col.length === 0)) {
      return; // Can't deal with empty columns
    }
    const newStock = [...stock];
    const newCols = columns.map(col => [...col]);
    for (let i = 0; i < 10 && newStock.length > 0; i++) {
      const card = newStock.pop()!;
      card.faceUp = true;
      newCols[i].push(card);
    }
    setStock(newStock);
    setColumns(newCols);
    setMoves(prev => prev + 1);
  }, [stock, columns]);

  const checkCompleteSequence = useCallback((cols: Card[][]): Card[][] => {
    const newCols = cols.map(col => [...col]);
    let found = false;
    for (let c = 0; c < newCols.length; c++) {
      const col = newCols[c];
      if (col.length >= 13) {
        const last13 = col.slice(-13);
        if (last13[0].rank === 13 && last13[12].rank === 1 && isSequenceDescending(last13)) {
          newCols[c] = col.slice(0, col.length - 13);
          // Flip new top card
          if (newCols[c].length > 0) {
            newCols[c][newCols[c].length - 1].faceUp = true;
          }
          found = true;
          setCompleted(prev => {
            const next = prev + 1;
            if (next >= 8) setWon(true);
            return next;
          });
        }
      }
    }
    return found ? checkCompleteSequence(newCols) : newCols;
  }, []);

  const tryDrop = useCallback((targetCol: number) => {
    if (!dragState) return;
    const targetColumn = columns[targetCol];
    const movingCards = dragState.cards;

    // Can place on empty column or on a card whose rank is one higher
    if (targetColumn.length === 0 || canStackOn(movingCards[0], targetColumn[targetColumn.length - 1])) {
      const newCols = columns.map((col, i) => {
        if (i === dragState.colIdx) {
          const remaining = col.slice(0, dragState.cardIdx);
          // Flip top card
          if (remaining.length > 0 && !remaining[remaining.length - 1].faceUp) {
            remaining[remaining.length - 1].faceUp = true;
          }
          return remaining;
        }
        if (i === targetCol) return [...col, ...movingCards];
        return [...col];
      });

      const checked = checkCompleteSequence(newCols);
      setColumns(checked);
      setMoves(prev => prev + 1);
    }
    setDragState(null);
  }, [dragState, columns, checkCompleteSequence]);

  const handleCardClick = useCallback((colIdx: number, cardIdx: number) => {
    const col = columns[colIdx];
    const card = col[cardIdx];
    if (!card.faceUp) return;

    // Check if it's a valid sequence from cardIdx to end
    const seq = col.slice(cardIdx);
    if (!isSequenceDescending(seq)) return;

    if (dragState === null) {
      // Pick up
      setDragState({ colIdx, cardIdx, cards: seq });
      setHintCol(null);
    } else {
      // Try to drop
      if (dragState.colIdx === colIdx) {
        // Cancel
        setDragState(null);
        return;
      }
      tryDrop(colIdx);
    }
  }, [columns, dragState, tryDrop]);

  const handleColumnClick = useCallback((colIdx: number) => {
    if (dragState && columns[colIdx].length === 0) {
      tryDrop(colIdx);
    }
  }, [dragState, columns, tryDrop]);


  const CARD_W = 50;
  const CARD_H = 70;
  const CARD_OFFSET_FACE = 20;
  const CARD_OFFSET_HIDDEN = 6;

  const getCardColor = (card: Card) => card.suit === '♥' || card.suit === '♦' ? '#cc1111' : '#111';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'linear-gradient(180deg, #1a5c2a 0%, #0d3f18 50%, #0a3012 100%)',
      fontFamily: 'Tahoma, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Menu bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '2px 8px',
        background: '#f0efe4',
        borderBottom: '1px solid #aca899',
        fontSize: '11px',
        gap: '12px',
      }}>
        <span style={{ cursor: 'pointer' }} onClick={newGame}>Game</span>
        <span style={{ color: '#888' }}>Help</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: '#555' }}>Moves: {moves}</span>
        <span style={{ color: '#555' }}>|</span>
        <span style={{ color: '#555' }}>Score: {completed * 100}</span>
      </div>

      {/* Table */}
      <div
        ref={tableRef}
        style={{
          flex: 1,
          padding: '8px 4px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Completed stacks + Stock */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px',
          padding: '0 4px',
        }}>
          <div style={{ display: 'flex', gap: '3px' }}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} style={{
                width: 28,
                height: 38,
                border: i < completed ? '1px solid #4a8a4a' : '1px dashed rgba(255,255,255,0.15)',
                borderRadius: '3px',
                background: i < completed
                  ? 'linear-gradient(135deg, #2a6a3a, #1a4a2a)'
                  : 'rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                color: i < completed ? '#aaddaa' : 'rgba(255,255,255,0.1)',
              }}>
                {i < completed ? '♠' : ''}
              </div>
            ))}
          </div>
          <div
            onClick={dealRow}
            style={{
              display: 'flex',
              gap: '2px',
              cursor: stock.length > 0 ? 'pointer' : 'default',
              opacity: stock.length > 0 ? 1 : 0.3,
            }}
            title={stock.length > 0 ? `Deal row (${Math.ceil(stock.length / 10)} deals left)` : 'No cards left'}
          >
            {Array.from({ length: Math.min(5, Math.ceil(stock.length / 10)) }, (_, i) => (
              <div key={i} style={{
                width: 28,
                height: 38,
                background: 'linear-gradient(135deg, #1a3a8a, #0a2060)',
                border: '1px solid #3366aa',
                borderRadius: '3px',
                marginLeft: i > 0 ? '-20px' : '0',
                boxShadow: '1px 1px 3px rgba(0,0,0,0.3)',
              }} />
            ))}
          </div>
        </div>

        {/* Columns */}
        <div style={{
          flex: 1,
          display: 'flex',
          gap: '3px',
          overflow: 'hidden',
        }}>
          {columns.map((col, colIdx) => (
            <div
              key={colIdx}
              onClick={() => handleColumnClick(colIdx)}
              style={{
                flex: 1,
                minWidth: 0,
                position: 'relative',
                borderRadius: '4px',
                border: dragState && col.length === 0 ? '1px dashed rgba(255,255,255,0.3)' : '1px solid transparent',
                background: col.length === 0 ? 'rgba(0,0,0,0.1)' : 'transparent',
                cursor: dragState ? 'pointer' : 'default',
              }}
            >
              {col.map((card, cardIdx) => {
                const yOffset = col.slice(0, cardIdx).reduce((sum, c) =>
                  sum + (c.faceUp ? CARD_OFFSET_FACE : CARD_OFFSET_HIDDEN), 0);
                const isDragging = dragState?.colIdx === colIdx && cardIdx >= dragState.cardIdx;
                const isHighlight = hintCol === colIdx && cardIdx === col.length - 1;

                return (
                  <div
                    key={cardIdx}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(colIdx, cardIdx);
                    }}
                    style={{
                      position: 'absolute',
                      top: yOffset,
                      left: '50%',
                      transform: `translateX(-50%) ${isDragging ? 'scale(1.05)' : ''}`,
                      width: Math.min(CARD_W, 50),
                      height: CARD_H,
                      borderRadius: '4px',
                      border: isHighlight
                        ? '2px solid #ffcc00'
                        : isDragging
                        ? '2px solid #6699ff'
                        : '1px solid rgba(0,0,0,0.3)',
                      boxShadow: isDragging
                        ? '0 4px 12px rgba(0,0,0,0.5)'
                        : '0 1px 2px rgba(0,0,0,0.2)',
                      cursor: card.faceUp ? 'pointer' : 'default',
                      transition: 'transform 0.1s, box-shadow 0.1s',
                      zIndex: isDragging ? 100 + cardIdx : cardIdx,
                      opacity: isDragging ? 0.85 : 1,
                      ...(card.faceUp
                        ? {
                            background: 'linear-gradient(180deg, #fff 0%, #f5f0e0 100%)',
                          }
                        : {
                            background: 'linear-gradient(135deg, #1a3a8a 0%, #0a2060 100%)',
                          }),
                    }}
                  >
                    {card.faceUp ? (
                      <div style={{ padding: '2px 3px', userSelect: 'none' }}>
                        <div style={{
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: getCardColor(card),
                          lineHeight: 1,
                        }}>
                          {card.value}
                        </div>
                        <div style={{
                          fontSize: '9px',
                          color: getCardColor(card),
                          lineHeight: 1,
                        }}>
                          {card.suit}
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '3px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: getCardColor(card),
                          transform: 'rotate(180deg)',
                          lineHeight: 1,
                        }}>
                          {card.value}
                        </div>
                        {/* Center suit */}
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          fontSize: '18px',
                          color: getCardColor(card),
                          opacity: 0.4,
                        }}>
                          {card.suit}
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '3px',
                        background: `
                          repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 3px,
                            rgba(255,255,255,0.08) 3px,
                            rgba(255,255,255,0.08) 6px
                          )
                        `,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <div style={{
                          width: '60%',
                          height: '75%',
                          border: '1px solid rgba(100,150,255,0.3)',
                          borderRadius: '2px',
                        }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        padding: '3px 8px',
        background: '#f0efe4',
        borderTop: '1px solid #aca899',
        fontSize: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        color: '#555',
      }}>
        <span>Spider Solitaire - 1 Suit</span>
        <span>Stock: {stock.length} cards ({Math.ceil(stock.length / 10)} deals)</span>
      </div>

      {/* Win overlay */}
      {won && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
        }}>
          <div style={{
            background: 'linear-gradient(180deg, #2a6a3a, #1a4a2a)',
            border: '2px solid #4a8a5a',
            borderRadius: '12px',
            padding: '30px 40px',
            textAlign: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎉</div>
            <div style={{ color: '#aaddaa', fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              Congratulations!
            </div>
            <div style={{ color: '#88bb88', fontSize: '12px', marginBottom: '16px' }}>
              You won in {moves} moves!
            </div>
            <button className="xp-button" onClick={newGame} style={{ padding: '4px 20px' }}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
