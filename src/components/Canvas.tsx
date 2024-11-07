import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { usePdfStore } from '../store/pdfStore';

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const { currentPage, zoomLevel } = usePdfStore();

  useEffect(() => {
    if (canvasRef.current && !fabricRef.current) {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: false,
        selection: true
      });

      // Initialize drawing tools
      initializeDrawingTools();

      // Handle keyboard events
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        fabricRef.current?.dispose();
      };
    }
  }, []);

  const initializeDrawingTools = () => {
    if (!fabricRef.current) return;

    // Free drawing brush
    fabricRef.current.freeDrawingBrush = new fabric.PencilBrush(fabricRef.current);
    fabricRef.current.freeDrawingBrush.width = 2;
    fabricRef.current.freeDrawingBrush.color = '#000000';
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!fabricRef.current) return;

    // Delete selected objects
    if (e.key === 'Delete') {
      const activeObjects = fabricRef.current.getActiveObjects();
      activeObjects.forEach(obj => fabricRef.current?.remove(obj));
      fabricRef.current.requestRenderAll();
    }

    // Copy/Paste functionality
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'c':
          copySelectedObjects();
          break;
        case 'v':
          pasteObjects();
          break;
        case 'z':
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
      }
    }
  };

  const copySelectedObjects = () => {
    if (!fabricRef.current) return;
    
    fabricRef.current.getActiveObjects().forEach(obj => {
      obj.clone((cloned: fabric.Object) => {
        localStorage.setItem('clipboard', JSON.stringify(cloned.toObject()));
      });
    });
  };

  const pasteObjects = () => {
    if (!fabricRef.current) return;

    const clipboard = localStorage.getItem('clipboard');
    if (clipboard) {
      fabric.util.enlivenObjects([JSON.parse(clipboard)], (objects: fabric.Object[]) => {
        objects.forEach(obj => {
          obj.set({
            left: obj.left! + 10,
            top: obj.top! + 10
          });
          fabricRef.current?.add(obj);
        });
        fabricRef.current?.requestRenderAll();
      });
    }
  };

  const undo = () => {
    // Implement undo functionality
  };

  const redo = () => {
    // Implement redo functionality
  };

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
};