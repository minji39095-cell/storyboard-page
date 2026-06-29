import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Undo, Redo, Check, Trash } from 'lucide-react';

export default function DrawingCanvas({ initialImage, onSave, onCancel }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  
  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'Gray', hex: '#6b7280' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Green', hex: '#10b981' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    
    // Set display size based on the 16:9 ratio of container
    const width = canvas.parentElement.clientWidth;
    const height = width * (9 / 16);
    
    canvas.width = width * 2; // high res
    canvas.height = height * 2;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    contextRef.current = context;

    // Fill background with white
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);

    // Load initial image if exists
    if (initialImage) {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0, width, height);
        // Save initial state to history
        saveState();
      };
      img.src = initialImage;
    } else {
      saveState();
    }
  }, []);

  // Update canvas color and brush size when they change
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(dataUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const startDrawing = ({ nativeEvent }) => {
    let clientX, clientY;
    if (nativeEvent.touches) {
      clientX = nativeEvent.touches[0].clientX;
      clientY = nativeEvent.touches[0].clientY;
    } else {
      clientX = nativeEvent.clientX;
      clientY = nativeEvent.clientY;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    
    let clientX, clientY;
    if (nativeEvent.touches) {
      clientX = nativeEvent.touches[0].clientX;
      clientY = nativeEvent.touches[0].clientY;
    } else {
      clientX = nativeEvent.clientX;
      clientY = nativeEvent.clientY;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      contextRef.current.closePath();
      setIsDrawing(false);
      saveState();
    }
  };

  const undo = (e) => {
    e.stopPropagation();
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      restoreState(history[prevIndex]);
    }
  };

  const redo = (e) => {
    e.stopPropagation();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      restoreState(history[nextIndex]);
    }
  };

  const restoreState = (dataUrl) => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    const img = new Image();
    img.onload = () => {
      context.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
      context.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
    };
    img.src = dataUrl;
  };

  const clearCanvas = (e) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
    saveState();
  };

  const handleSave = (e) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    onSave(canvas.toDataURL());
  };

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, backgroundColor: '#ffffff' }}>
      <canvas
        ref={canvasRef}
        className="canvas-element"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      
      <div className="canvas-controls">
        <div className="canvas-tools-group">
          {colors.map((c) => (
            <div
              key={c.hex}
              className={`color-dot ${color === c.hex ? 'active' : ''}`}
              style={{ backgroundColor: c.hex }}
              onClick={(e) => { e.stopPropagation(); setColor(c.hex); }}
              title={c.name}
            />
          ))}
          <div className="brush-slider-container">
            <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>SZ</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="brush-slider"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <div className="canvas-tools-group">
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={undo} 
            disabled={historyIndex <= 0}
            title="실행 취소 (Undo)"
          >
            <Undo size={14} />
          </button>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={redo} 
            disabled={historyIndex >= history.length - 1}
            title="다시 실행 (Redo)"
          >
            <Redo size={14} />
          </button>
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={clearCanvas}
            title="초기화"
          >
            <Trash size={14} />
          </button>
          <button 
            type="button" 
            className="btn btn-primary btn-sm" 
            onClick={handleSave}
            title="저장"
          >
            <Check size={14} /> 완료
          </button>
        </div>
      </div>
    </div>
  );
}
