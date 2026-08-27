'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 15;
const INITIAL_SPEED = 150;

export default function SnakeContent() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  const directionRef = useRef(direction);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Update direction ref
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setIsPaused(true);
    setScore(0);
    setSpeed(INITIAL_SPEED);
  }, [generateFood]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== 'DOWN') {
            setDirection('UP');
            if (isPaused) setIsPaused(false);
          }
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== 'UP') {
            setDirection('DOWN');
            if (isPaused) setIsPaused(false);
          }
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== 'RIGHT') {
            setDirection('LEFT');
            if (isPaused) setIsPaused(false);
          }
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== 'LEFT') {
            setDirection('RIGHT');
            if (isPaused) setIsPaused(false);
          }
          e.preventDefault();
          break;
        case ' ':
          if (!gameOver) {
            setIsPaused(p => !p);
          }
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  // Game loop
  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };
        
        switch (directionRef.current) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
        }

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            if (newScore > highScore) {
              setHighScore(newScore);
            }
            return newScore;
          });
          setFood(generateFood(newSnake));
          // Speed up slightly
          setSpeed(s => Math.max(50, s - 2));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [isPaused, gameOver, food, generateFood, highScore, speed]);

  // Focus container for keyboard input
  useEffect(() => {
    gameContainerRef.current?.focus();
  }, []);

  return (
    <div 
      ref={gameContainerRef}
      tabIndex={0}
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#000',
        margin: '-8px',
        padding: '10px',
        outline: 'none',
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px',
        color: '#0f0',
        fontFamily: 'monospace',
        fontSize: '12px',
      }}>
        <div>Score: {score}</div>
        <div>High Score: {highScore}</div>
        <button 
          onClick={initGame}
          style={{ 
            background: 'linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 100%)',
            border: '1px solid #0f0',
            color: '#0f0',
            padding: '2px 10px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '10px',
          }}
        >
          New Game
        </button>
      </div>

      {/* Game Board */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
      }}>
        <div
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            background: '#111',
            border: '2px solid #0f0',
            position: 'relative',
            boxShadow: '0 0 10px #0f0',
          }}
        >
          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 1,
                height: CELL_SIZE - 1,
                background: index === 0 ? '#0f0' : '#0a0',
                borderRadius: index === 0 ? '3px' : '1px',
                boxShadow: index === 0 ? '0 0 5px #0f0' : 'none',
              }}
            />
          ))}

          {/* Food */}
          <div
            style={{
              position: 'absolute',
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE - 1,
              height: CELL_SIZE - 1,
              background: '#f00',
              borderRadius: '50%',
              boxShadow: '0 0 5px #f00',
            }}
          />

          {/* Game Over / Pause Overlay */}
          {(gameOver || isPaused) && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0f0',
              fontFamily: 'monospace',
            }}>
              {gameOver ? (
                <>
                  <div style={{ fontSize: '20px', marginBottom: '10px' }}>GAME OVER</div>
                  <div style={{ fontSize: '14px', marginBottom: '15px' }}>Score: {score}</div>
                  <button 
                    onClick={initGame}
                    style={{
                      background: 'linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 100%)',
                      border: '2px solid #0f0',
                      color: '#0f0',
                      padding: '8px 20px',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                    }}
                  >
                    Play Again
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '18px', marginBottom: '10px' }}>🐍 SNAKE</div>
                  <div style={{ fontSize: '12px', marginBottom: '5px' }}>Use Arrow Keys or WASD</div>
                  <div style={{ fontSize: '12px', marginBottom: '15px' }}>Press any key to start</div>
                  <div style={{ fontSize: '10px', color: '#080' }}>Space to pause</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Controls hint */}
      <div style={{ 
        textAlign: 'center', 
        color: '#0a0', 
        fontSize: '10px',
        fontFamily: 'monospace',
        marginTop: '10px',
      }}>
        ↑↓←→ or WASD to move | SPACE to pause
      </div>
    </div>
  );
}
