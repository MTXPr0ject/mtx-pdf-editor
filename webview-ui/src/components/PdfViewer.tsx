import React, { useEffect, useRef, useState } from 'react';
import { usePdfStore } from '../store/pdfStore';

export const PdfViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { pdfDocument, currentPage, zoomLevel, renderPage } = usePdfStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pdfDocument && canvasRef.current) {
      setIsLoading(true);
      setError(null);
      
      renderPage(currentPage, canvasRef.current)
        .catch(err => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [pdfDocument, currentPage, zoomLevel]);

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
          case '=':
          case '+':
            e.preventDefault();
            usePdfStore.getState().zoomIn();
            break;
          case '-':
            e.preventDefault();
            usePdfStore.getState().zoomOut();
            break;
          case 's':
            e.preventDefault();
            usePdfStore.getState().save();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);

  if (error) {
    return (
      <div className="pdf-error">
        <p>Error loading PDF: {error}</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  return (
    <div className="pdf-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading page {currentPage}...</p>
        </div>
      )}
      <canvas ref={canvasRef} className="pdf-canvas" />
    </div>
  );
};