import React, { useRef, useEffect, useState } from "react";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";

const Canvas = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
  }, [color, lineWidth]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const getTouchPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const startDraw = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);

    setHistory((prev) => [
      ...prev,
      ctx.getImageData(0, 0, canvas.width, canvas.height),
    ]);
    setRedoStack([]);
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getMousePos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => setDrawing(false);

  // Touch Handlers
  const handleTouchStart = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getTouchPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);

    setHistory((prev) => [
      ...prev,
      ctx.getImageData(0, 0, canvas.width, canvas.height),
    ]);
    setRedoStack([]);
  };

  const handleTouchMove = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getTouchPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleTouchEnd = () => setDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setRedoStack([]);
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.fillStyle = "#ffffff";
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    const image = tempCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "geodraw-drawing.png";
    link.click();

    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  const undo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    setRedoStack((prev) => [
      ...prev,
      ctx.getImageData(0, 0, canvas.width, canvas.height),
    ]);

    const newHistory = [...history];
    const last = newHistory.pop();
    ctx.putImageData(last, 0, 0);
    setHistory(newHistory);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    setHistory((prev) => [
      ...prev,
      ctx.getImageData(0, 0, canvas.width, canvas.height),
    ]);

    const newRedoStack = [...redoStack];
    const redoState = newRedoStack.pop();
    ctx.putImageData(redoState, 0, 0);
    setRedoStack(newRedoStack);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-[95%] mx-auto mt-10">
      <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
        Draw Something with Canvas!
      </h2>

      <div className="flex flex-wrap gap-6 justify-center items-center mb-6">
        <div className="flex items-center gap-2">
          <PaintBrushIcon className="h-6 w-6 text-gray-700" />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="font-medium">Brush:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
          />
          <span>{lineWidth}px</span>
        </div>

        <div className="flex gap-4">
          <button onClick={undo} title="Undo">
            <ArrowUturnLeftIcon className="h-6 w-6 text-yellow-500 hover:scale-110 transition" />
          </button>
          <button onClick={redo} title="Redo">
            <ArrowUturnRightIcon className="h-6 w-6 text-indigo-500 hover:scale-110 transition" />
          </button>
          <button onClick={clearCanvas} title="Clear">
            <TrashIcon className="h-6 w-6 text-red-500 hover:scale-110 transition" />
          </button>
          <button onClick={saveCanvas} title="Save">
            <ArrowDownTrayIcon className="h-6 w-6 text-green-500 hover:scale-110 transition" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="border-2 border-gray-300 rounded-lg bg-gray-100 w-full max-w-[1000px] h-[500px] cursor-crosshair touch-none"
        />
      </div>

      {toast && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded shadow-lg border border-green-300">
            Drawing saved successfully!
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
