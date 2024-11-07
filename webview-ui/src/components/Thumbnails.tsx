import React from 'react';
import { usePdfStore } from '../store/pdfStore';
import * as pdfjsLib from 'pdfjs-dist';

interface ThumbnailProps {
  pageNumber: number;
  isSelected: boolean;
  onClick: () => void;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ pageNumber, isSelected, onClick }) => {
  const { pdfDocument } = usePdfStore();
  const [thumbnail, setThumbnail] = React.useState<string | null>(null);

  React.useEffect(() => {
    const generateThumbnail = async () => {
      if (!pdfDocument) return;

      try {
        const page = await pdfDocument.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 0.2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context!,
          viewport,
        }).promise;

        setThumbnail(canvas.toDataURL());
      } catch (error) {
        console.error(`Error generating thumbnail for page ${pageNumber}:`, error);
      }
    };

    generateThumbnail();
  }, [pdfDocument, pageNumber]);

  return (
    <div
      className={`thumbnail ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {thumbnail ? (
        <img src={thumbnail} alt={`Page ${pageNumber}`} />
      ) : (
        <div className="thumbnail-placeholder">
          Loading...
        </div>
      )}
      <span className="page-number">Page {pageNumber}</span>
    </div>
  );
};

export const Thumbnails: React.FC = () => {
  const { pdfDocument, currentPage, setCurrentPage } = usePdfStore();
  const [numPages, setNumPages] = React.useState(0);

  React.useEffect(() => {
    if (pdfDocument) {
      setNumPages(pdfDocument.numPages);
    }
  }, [pdfDocument]);

  return (
    <div className="thumbnails-container">
      {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
        <Thumbnail
          key={pageNum}
          pageNumber={pageNum}
          isSelected={currentPage === pageNum}
          onClick={() => setCurrentPage(pageNum)}
        />
      ))}
    </div>
  );
};