'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const COLORS = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
  '#c0dcc0', '#a6caf0', '#fffbf0', '#a0a0a4', '#ff8080', '#80ff80', '#8080ff', '#ff80ff',
];

type Tool = 'pencil' | 'brush' | 'eraser' | 'fill' | 'line' | 'rect' | 'ellipse' | 'text';

export default function PaintContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [startPos, setStartPos] = useState<{x: number, y: number} | null>(null);
  const [canvasData, setCanvasData] = useState<ImageData | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Fill with white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(pos);

    // Save canvas state for shape tools
    if (['line', 'rect', 'ellipse'].includes(tool)) {
      setCanvasData(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }

    if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = tool === 'brush' ? brushSize * 3 : brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    if (tool === 'fill') {
      floodFill(Math.floor(pos.x), Math.floor(pos.y), color);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !startPos) return;

    const pos = getCanvasCoords(e);

    if (tool === 'pencil' || tool === 'brush' || tool === 'eraser') {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    if (['line', 'rect', 'ellipse'].includes(tool) && canvasData) {
      // Restore canvas and draw shape preview
      ctx.putImageData(canvasData, 0, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.beginPath();

      if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === 'ellipse') {
        const centerX = (startPos.x + pos.x) / 2;
        const centerY = (startPos.y + pos.y) / 2;
        const radiusX = Math.abs(pos.x - startPos.x) / 2;
        const radiusY = Math.abs(pos.y - startPos.y) / 2;
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setStartPos(null);
    setCanvasData(null);
  };

  const floodFill = useCallback((startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const targetColor = getPixelColor(data, startX, startY, canvas.width);
    const fill = hexToRgb(fillColor);
    
    if (!fill || colorsMatch(targetColor, fill)) return;

    const stack: [number, number][] = [[startX, startY]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;
      
      if (visited.has(key)) continue;
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      
      const currentColor = getPixelColor(data, x, y, canvas.width);
      if (!colorsMatch(currentColor, targetColor)) continue;
      
      visited.add(key);
      setPixelColor(data, x, y, canvas.width, fill);
      
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  const getPixelColor = (data: Uint8ClampedArray, x: number, y: number, width: number) => {
    const i = (y * width + x) * 4;
    return { r: data[i], g: data[i + 1], b: data[i + 2] };
  };

  const setPixelColor = (data: Uint8ClampedArray, x: number, y: number, width: number, color: {r: number, g: number, b: number}) => {
    const i = (y * width + x) * 4;
    data[i] = color.r;
    data[i + 1] = color.g;
    data[i + 2] = color.b;
    data[i + 3] = 255;
  };

  const colorsMatch = (c1: {r: number, g: number, b: number}, c2: {r: number, g: number, b: number}) => {
    return Math.abs(c1.r - c2.r) < 10 && Math.abs(c1.g - c2.g) < 10 && Math.abs(c1.b - c2.b) < 10;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const ToolButton = ({ t, icon, title }: { t: Tool; icon: string; title: string }) => (
    <button
      onClick={() => setTool(t)}
      title={title}
      style={{
        width: '24px',
        height: '24px',
        border: tool === t ? '2px inset #808080' : '1px solid #808080',
        background: tool === t ? '#c0c0c0' : '#ece9d8',
        cursor: 'pointer',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </button>
  );

  return (
    <div 
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#ece9d8',
        margin: '-8px',
        overflow: 'hidden',
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Menu Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        padding: '2px 4px',
        borderBottom: '1px solid #808080',
        fontSize: '11px'
      }}>
        <span style={{ cursor: 'pointer' }}>File</span>
        <span style={{ cursor: 'pointer' }}>Edit</span>
        <span style={{ cursor: 'pointer' }}>View</span>
        <span style={{ cursor: 'pointer' }} onClick={clearCanvas}>Clear</span>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Tool Panel */}
        <div style={{ 
          width: '50px', 
          background: '#ece9d8',
          borderRight: '1px solid #808080',
          padding: '4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
            <ToolButton t="pencil" icon="✏️" title="Pencil" />
            <ToolButton t="brush" icon="🖌️" title="Brush" />
            <ToolButton t="eraser" icon="🧹" title="Eraser" />
            <ToolButton t="fill" icon="🪣" title="Fill" />
            <ToolButton t="line" icon="📏" title="Line" />
            <ToolButton t="rect" icon="⬜" title="Rectangle" />
            <ToolButton t="ellipse" icon="⭕" title="Ellipse" />
          </div>
          
          {/* Brush size */}
          <div style={{ marginTop: '10px', fontSize: '9px', textAlign: 'center' }}>
            Size: {brushSize}
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          
          {/* Quick size buttons */}
          <div style={{ display: 'flex', gap: '2px', marginTop: '5px' }}>
            {[1, 5, 10, 15].map(size => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                style={{
                  flex: 1,
                  padding: '2px',
                  fontSize: '8px',
                  background: brushSize === size ? '#c0c0c0' : '#ece9d8',
                  border: '1px solid #808080',
                  cursor: 'pointer',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas Area */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          background: '#808080',
          padding: '4px',
        }}>
          <canvas
            ref={canvasRef}
            width={400}
            height={300}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            style={{
              background: 'white',
              cursor: tool === 'fill' ? 'crosshair' : 'crosshair',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* Color Palette */}
      <div style={{ 
        display: 'flex', 
        padding: '4px',
        borderTop: '1px solid #808080',
        gap: '8px',
        alignItems: 'center',
      }}>
        {/* Current colors */}
        <div style={{ position: 'relative', width: '30px', height: '30px' }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '20px',
            height: '20px',
            background: '#ffffff',
            border: '1px solid #808080',
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '20px',
            height: '20px',
            background: color,
            border: '1px solid #808080',
          }} />
        </div>

        {/* Palette */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(12, 1fr)', 
          gap: '1px',
        }}>
          {COLORS.map((c, i) => (
            <div
              key={i}
              onClick={() => setColor(c)}
              style={{
                width: '14px',
                height: '14px',
                background: c,
                border: color === c ? '2px solid #000' : '1px solid #808080',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div style={{ 
        padding: '2px 4px',
        borderTop: '1px solid #808080',
        fontSize: '10px',
        color: '#444',
      }}>
        Tool: {tool.charAt(0).toUpperCase() + tool.slice(1)} | Canvas: 400 x 300
      </div>
    </div>
  );
}
