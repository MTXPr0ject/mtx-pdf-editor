import React, { useEffect, useRef } from 'react';
import { usePdfStore } from '../store/pdfStore';

export const PdfViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { pdfDocument, currentPage, zoomLevel, renderPage } = usePdfStore();

  useEffect(() => {
    if (pdfDocument && canvasRef.current) {
      renderPage(currentPage, canvasRef.current);
    }
  }, [pdfDocument, currentPage, zoomLevel]);

  return (
    <div className="pdf-container">
      <canvas ref={canvasRef} className="pdf-canvas" />
    </div>
  );
};