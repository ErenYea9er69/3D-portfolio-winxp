'use client';

import { useState } from 'react';

export default function CalculatorContent() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState<number>(0);
  const [hasMemory, setHasMemory] = useState(false);

  // Memory functions
  const memoryClear = () => {
    setMemory(0);
    setHasMemory(false);
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  };

  const memoryStore = () => {
    setMemory(parseFloat(display));
    setHasMemory(true);
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
    setHasMemory(true);
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue;
      let newValue: number;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '*':
          newValue = currentValue * inputValue;
          break;
        case '/':
          newValue = currentValue / inputValue;
          break;
        default:
          newValue = inputValue;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    if (!operation || previousValue === null) return;

    const inputValue = parseFloat(display);
    let newValue: number;

    switch (operation) {
      case '+':
        newValue = previousValue + inputValue;
        break;
      case '-':
        newValue = previousValue - inputValue;
        break;
      case '*':
        newValue = previousValue * inputValue;
        break;
      case '/':
        newValue = previousValue / inputValue;
        break;
      default:
        newValue = inputValue;
    }

    setDisplay(String(newValue));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const CalcButton = ({ label, onClick, color }: { label: string; onClick: () => void; color?: string }) => (
    <button
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        flex: 1,
        minWidth: '36px',
        height: '36px',
        background: color || 'linear-gradient(180deg, #ece9d8 0%, #d4d0c8 100%)',
        border: '1px solid',
        borderColor: '#fff #848284 #848284 #fff',
        borderRadius: '0',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: color ? 'bold' : 'normal',
        color: color === '#ff6666' ? 'darkred' : '#000',
        fontFamily: 'Tahoma, sans-serif',
      }}
    >
      {label}
    </button>
  );

  return (
    <div 
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '10px',
        background: '#ece9d8',
        boxSizing: 'border-box',
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Display */}
      <div style={{ position: 'relative', marginBottom: '10px' }}>
        {hasMemory && (
          <div style={{
            position: 'absolute',
            left: '6px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#666',
          }}>
            M
          </div>
        )}
        <input
          type="text"
          value={display}
          readOnly
          style={{
            width: '100%',
            height: '40px',
            textAlign: 'right',
            padding: '4px 10px',
            paddingLeft: hasMemory ? '20px' : '10px',
            fontSize: '20px',
            fontFamily: 'Tahoma, sans-serif',
            background: 'white',
            border: '2px solid',
            borderColor: '#848284 #fff #fff #848284',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {/* Row 1 */}
        <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
          <CalcButton label="MC" onClick={memoryClear} />
          <CalcButton label="7" onClick={() => inputDigit('7')} />
          <CalcButton label="8" onClick={() => inputDigit('8')} />
          <CalcButton label="9" onClick={() => inputDigit('9')} />
          <CalcButton label="/" onClick={() => performOperation('/')} color="#d4d0ff" />
          <CalcButton label="C" onClick={clear} color="#ff6666" />
        </div>
        {/* Row 2 */}
        <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
          <CalcButton label="MR" onClick={memoryRecall} />
          <CalcButton label="4" onClick={() => inputDigit('4')} />
          <CalcButton label="5" onClick={() => inputDigit('5')} />
          <CalcButton label="6" onClick={() => inputDigit('6')} />
          <CalcButton label="*" onClick={() => performOperation('*')} color="#d4d0ff" />
          <CalcButton label="±" onClick={() => setDisplay(String(-parseFloat(display)))} />
        </div>
        {/* Row 3 */}
        <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
          <CalcButton label="MS" onClick={memoryStore} />
          <CalcButton label="1" onClick={() => inputDigit('1')} />
          <CalcButton label="2" onClick={() => inputDigit('2')} />
          <CalcButton label="3" onClick={() => inputDigit('3')} />
          <CalcButton label="-" onClick={() => performOperation('-')} color="#d4d0ff" />
          <CalcButton label="√" onClick={() => setDisplay(String(Math.sqrt(parseFloat(display))))} />
        </div>
        {/* Row 4 */}
        <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
          <CalcButton label="M+" onClick={memoryAdd} />
          <CalcButton label="0" onClick={() => inputDigit('0')} />
          <CalcButton label="." onClick={inputDecimal} />
          <CalcButton label="%" onClick={() => setDisplay(String(parseFloat(display) / 100))} />
          <CalcButton label="+" onClick={() => performOperation('+')} color="#d4d0ff" />
          <CalcButton label="=" onClick={calculate} color="#d4d0ff" />
        </div>
      </div>
    </div>
  );
}
