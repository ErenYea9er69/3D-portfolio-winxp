'use client';

import { useState, useCallback, useEffect } from 'react';

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Card = {
  suit: Suit;
  value: number;
  faceUp: boolean;
};

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const getSuitSymbol = (suit: Suit) => {
  switch (suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
  }
};

const getSuitColor = (suit: Suit) => {
  return suit === 'hearts' || suit === 'diamonds' ? '#cc0000' : '#000';
};

const getValueDisplay = (value: number) => {
  switch (value) {
    case 1: return 'A';
    case 11: return 'J';
    case 12: return 'Q';
    case 13: return 'K';
    default: return value.toString();
  }
};

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value, faceUp: false });
    }
  }
  return deck;
};

const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface CardComponentProps {
  card: Card | null;
  onClick?: () => void;
  style?: React.CSSProperties;
  isPlaceholder?: boolean;
  small?: boolean;
}

function CardComponent({ card, onClick, style, isPlaceholder, small }: CardComponentProps) {
  const width = small ? 45 : 55;
  const height = small ? 70 : 80;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick();
  };
  
  if (isPlaceholder) {
    return (
      <div
        onClick={handleClick}
        style={{
          width,
          height,
          border: '2px dashed #4a7c4a',
          borderRadius: '4px',
          background: 'rgba(0, 100, 0, 0.1)',
          cursor: onClick ? 'pointer' : 'default',
          ...style,
        }}
      />
    );
  }

  if (!card) return null;

  if (!card.faceUp) {
    return (
      <div
        onClick={handleClick}
        style={{
          width,
          height,
          background: 'linear-gradient(135deg, #1a4a8c 0%, #0d2f5c 100%)',
          border: '1px solid #0a1f3c',
          borderRadius: '4px',
          cursor: onClick ? 'pointer' : 'default',
          boxShadow: '1px 1px 3px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        <div style={{
          width: width - 8,
          height: height - 8,
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '2px',
          background: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 6px)',
        }} />
      </div>
    );
  }

  const color = getSuitColor(card.suit);
  const symbol = getSuitSymbol(card.suit);
  const display = getValueDisplay(card.value);

  return (
    <div
      onClick={handleClick}
      style={{
        width,
        height,
        background: 'white',
        border: '1px solid #888',
        borderRadius: '4px',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '1px 1px 3px rgba(0,0,0,0.3)',
        padding: '3px',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Georgia, serif',
        fontSize: small ? '10px' : '12px',
        color,
        userSelect: 'none',
        ...style,
      }}
    >
      <div style={{ fontWeight: 'bold' }}>{display}{symbol}</div>
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: small ? '18px' : '24px',
      }}>
        {symbol}
      </div>
      <div style={{ fontWeight: 'bold', alignSelf: 'flex-end', transform: 'rotate(180deg)' }}>{display}{symbol}</div>
    </div>
  );
}

export default function SolitaireContent() {
  const [stock, setStock] = useState<Card[]>([]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [tableau, setTableau] = useState<Card[][]>([[], [], [], [], [], [], []]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [selectedCard, setSelectedCard] = useState<{source: string, index: number, cardIndex?: number} | null>(null);

  const initGame = useCallback(() => {
    const deck = shuffleDeck(createDeck());
    
    // Deal to tableau
    const newTableau: Card[][] = [[], [], [], [], [], [], []];
    let cardIndex = 0;
    for (let i = 0; i < 7; i++) {
      for (let j = i; j < 7; j++) {
        const card = { ...deck[cardIndex], faceUp: j === i };
        newTableau[j].push(card);
        cardIndex++;
      }
    }
    
    // Remaining cards go to stock
    const newStock = deck.slice(cardIndex).map(c => ({ ...c, faceUp: false }));
    
    setTableau(newTableau);
    setStock(newStock);
    setWaste([]);
    setFoundations([[], [], [], []]);
    setMoves(0);
    setGameWon(false);
    setSelectedCard(null);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Check for win
  useEffect(() => {
    const totalInFoundations = foundations.reduce((sum, f) => sum + f.length, 0);
    if (totalInFoundations === 52) {
      setGameWon(true);
    }
  }, [foundations]);

  const drawFromStock = () => {
    if (stock.length === 0) {
      // Reset stock from waste
      setStock(waste.map(c => ({ ...c, faceUp: false })).reverse());
      setWaste([]);
    } else {
      const card = { ...stock[stock.length - 1], faceUp: true };
      setStock(stock.slice(0, -1));
      setWaste([...waste, card]);
    }
    setMoves(m => m + 1);
    setSelectedCard(null);
  };

  const canPlaceOnFoundation = (card: Card, foundationIndex: number) => {
    const foundation = foundations[foundationIndex];
    if (foundation.length === 0) {
      return card.value === 1; // Only Ace can start
    }
    const topCard = foundation[foundation.length - 1];
    return card.suit === topCard.suit && card.value === topCard.value + 1;
  };

  const canPlaceOnTableau = (card: Card, pileIndex: number) => {
    const pile = tableau[pileIndex];
    if (pile.length === 0) {
      return card.value === 13; // Only King can go on empty
    }
    const topCard = pile[pile.length - 1];
    const isOppositeColor = 
      (card.suit === 'hearts' || card.suit === 'diamonds') !== 
      (topCard.suit === 'hearts' || topCard.suit === 'diamonds');
    return isOppositeColor && card.value === topCard.value - 1;
  };

  const handleCardClick = (source: string, index: number, cardIndex?: number) => {
    if (gameWon) return;

    // If clicking on the same selection, deselect
    if (selectedCard && selectedCard.source === source && selectedCard.index === index && selectedCard.cardIndex === cardIndex) {
      setSelectedCard(null);
      return;
    }

    // If we have a selection, try to move
    if (selectedCard) {
      let cardToMove: Card | null = null;
      let cardsToMove: Card[] = [];
      
      // Get the card(s) to move
      if (selectedCard.source === 'waste') {
        cardToMove = waste[waste.length - 1];
        cardsToMove = [cardToMove];
      } else if (selectedCard.source === 'foundation') {
        cardToMove = foundations[selectedCard.index][foundations[selectedCard.index].length - 1];
        cardsToMove = [cardToMove];
      } else if (selectedCard.source === 'tableau') {
        const pile = tableau[selectedCard.index];
        const startIdx = selectedCard.cardIndex ?? pile.length - 1;
        cardsToMove = pile.slice(startIdx);
        cardToMove = cardsToMove[0];
      }

      if (!cardToMove) {
        setSelectedCard(null);
        return;
      }

      // Try to place on foundation
      if (source === 'foundation' && cardsToMove.length === 1) {
        if (canPlaceOnFoundation(cardToMove, index)) {
          const newFoundations = [...foundations];
          newFoundations[index] = [...newFoundations[index], cardToMove];
          setFoundations(newFoundations);
          
          // Remove from source
          if (selectedCard.source === 'waste') {
            setWaste(waste.slice(0, -1));
          } else if (selectedCard.source === 'tableau') {
            const newTableau = [...tableau];
            newTableau[selectedCard.index] = newTableau[selectedCard.index].slice(0, selectedCard.cardIndex);
            // Flip the new top card
            if (newTableau[selectedCard.index].length > 0) {
              const lastIdx = newTableau[selectedCard.index].length - 1;
              newTableau[selectedCard.index][lastIdx] = { ...newTableau[selectedCard.index][lastIdx], faceUp: true };
            }
            setTableau(newTableau);
          }
          
          setMoves(m => m + 1);
          setSelectedCard(null);
          return;
        }
      }

      // Try to place on tableau
      if (source === 'tableau') {
        if (canPlaceOnTableau(cardToMove, index)) {
          const newTableau = [...tableau];
          newTableau[index] = [...newTableau[index], ...cardsToMove];
          
          // Remove from source
          if (selectedCard.source === 'waste') {
            setWaste(waste.slice(0, -1));
          } else if (selectedCard.source === 'foundation') {
            const newFoundations = [...foundations];
            newFoundations[selectedCard.index] = newFoundations[selectedCard.index].slice(0, -1);
            setFoundations(newFoundations);
          } else if (selectedCard.source === 'tableau') {
            newTableau[selectedCard.index] = newTableau[selectedCard.index].slice(0, selectedCard.cardIndex);
            // Flip the new top card
            if (newTableau[selectedCard.index].length > 0) {
              const lastIdx = newTableau[selectedCard.index].length - 1;
              newTableau[selectedCard.index][lastIdx] = { ...newTableau[selectedCard.index][lastIdx], faceUp: true };
            }
          }
          
          setTableau(newTableau);
          setMoves(m => m + 1);
          setSelectedCard(null);
          return;
        }
      }

      // Invalid move, select new card instead
      setSelectedCard(null);
    }

    // Select this card
    if (source === 'waste' && waste.length > 0) {
      setSelectedCard({ source: 'waste', index: 0 });
    } else if (source === 'foundation' && foundations[index].length > 0) {
      setSelectedCard({ source: 'foundation', index });
    } else if (source === 'tableau' && cardIndex !== undefined) {
      const card = tableau[index][cardIndex];
      if (card && card.faceUp) {
        setSelectedCard({ source: 'tableau', index, cardIndex });
      }
    }
  };

  const autoMoveToFoundation = () => {
    // Try to auto-move cards to foundations
    // Check waste
    if (waste.length > 0) {
      const card = waste[waste.length - 1];
      for (let i = 0; i < 4; i++) {
        if (canPlaceOnFoundation(card, i)) {
          const newFoundations = [...foundations];
          newFoundations[i] = [...newFoundations[i], card];
          setFoundations(newFoundations);
          setWaste(waste.slice(0, -1));
          setMoves(m => m + 1);
          return;
        }
      }
    }
    
    // Check tableau
    for (let t = 0; t < 7; t++) {
      if (tableau[t].length > 0) {
        const card = tableau[t][tableau[t].length - 1];
        if (card.faceUp) {
          for (let i = 0; i < 4; i++) {
            if (canPlaceOnFoundation(card, i)) {
              const newFoundations = [...foundations];
              newFoundations[i] = [...newFoundations[i], card];
              setFoundations(newFoundations);
              
              const newTableau = [...tableau];
              newTableau[t] = newTableau[t].slice(0, -1);
              if (newTableau[t].length > 0) {
                const lastIdx = newTableau[t].length - 1;
                newTableau[t][lastIdx] = { ...newTableau[t][lastIdx], faceUp: true };
              }
              setTableau(newTableau);
              setMoves(m => m + 1);
              return;
            }
          }
        }
      }
    }
  };

  return (
    <div 
      style={{ 
        height: '100%',
        background: '#008000',
        margin: '-8px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minHeight: '400px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="xp-button" 
            onClick={initGame}
            style={{ fontSize: '10px', padding: '2px 8px', minWidth: 'auto', minHeight: 'auto' }}
          >
            New Game
          </button>
          <button 
            className="xp-button" 
            onClick={autoMoveToFoundation}
            style={{ fontSize: '10px', padding: '2px 8px', minWidth: 'auto', minHeight: 'auto' }}
          >
            Auto Move
          </button>
        </div>
        <div style={{ color: 'white', fontSize: '11px', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
          Moves: {moves}
        </div>
      </div>

      {/* Top row: Stock, Waste, Foundations */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Stock and Waste */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Stock */}
          {stock.length > 0 ? (
            <CardComponent card={stock[stock.length - 1]} onClick={drawFromStock} small />
          ) : (
            <CardComponent card={null} isPlaceholder onClick={drawFromStock} small />
          )}
          
          {/* Waste */}
          {waste.length > 0 ? (
            <CardComponent 
              card={waste[waste.length - 1]} 
              onClick={() => handleCardClick('waste', 0)}
              small
              style={{ 
                outline: selectedCard?.source === 'waste' ? '3px solid yellow' : 'none',
              }}
            />
          ) : (
            <CardComponent card={null} isPlaceholder small />
          )}
        </div>

        {/* Foundations */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {foundations.map((foundation, i) => (
            foundation.length > 0 ? (
              <CardComponent 
                key={i}
                card={foundation[foundation.length - 1]} 
                onClick={() => handleCardClick('foundation', i)}
                small
                style={{
                  outline: selectedCard?.source === 'foundation' && selectedCard?.index === i ? '3px solid yellow' : 'none',
                }}
              />
            ) : (
              <CardComponent key={i} card={null} isPlaceholder onClick={() => handleCardClick('foundation', i)} small />
            )
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
        {tableau.map((pile, pileIndex) => (
          <div 
            key={pileIndex} 
            style={{ flex: 1, position: 'relative', minHeight: '100px' }}
          >
            {pile.length === 0 ? (
              <CardComponent 
                card={null} 
                isPlaceholder 
                onClick={() => handleCardClick('tableau', pileIndex, 0)}
                small 
              />
            ) : (
              pile.map((card, cardIndex) => (
                <div
                  key={cardIndex}
                  style={{
                    position: 'absolute',
                    top: cardIndex * (card.faceUp ? 18 : 8),
                    left: 0,
                  }}
                >
                  <CardComponent 
                    card={card}
                    onClick={() => handleCardClick('tableau', pileIndex, cardIndex)}
                    small
                    style={{
                      outline: selectedCard?.source === 'tableau' && 
                               selectedCard?.index === pileIndex && 
                               selectedCard?.cardIndex !== undefined &&
                               cardIndex >= selectedCard.cardIndex ? '3px solid yellow' : 'none',
                    }}
                  />
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      {/* Win message */}
      {gameWon && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '15px',
        }}>
          <div style={{ color: 'gold', fontSize: '24px', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            🎉 You Win! 🎉
          </div>
          <div style={{ color: 'white', fontSize: '14px' }}>
            Completed in {moves} moves
          </div>
          <button className="xp-button" onClick={initGame}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
