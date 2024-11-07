import create from 'zustand';
import * as pdfjsLib from 'pdfjs-dist';

interface HistoryState {
  pdfBytes: Uint8Array;
  currentPage: number;
  zoomLevel: number;
}

interface PdfStore {
  pdfDocument: pdfjsLib.PDFDocumentProxy | null;
  currentPage: number;
  zoomLevel: number;
  metadata: any;
  history: HistoryState[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  setPdfDocument: (doc: pdfjsLib.PDFDocumentProxy) => void;
  setCurrentPage: (page: number) => void;
  setZoomLevel: (zoom: number) => void;
  setMetadata: (metadata: any) => void;
  save: () => Promise<void>;
  undo: () => void;
  redo: () => void;
  addToHistory: (state: HistoryState) => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

export const usePdfStore = create<PdfStore>((set, get) => ({
  pdfDocument: null,
  currentPage: 1,
  zoomLevel: 1,
  metadata: null,
  history: [],
  historyIndex: -1,
  canUndo: false,
  canRedo: false,

  setPdfDocument: (doc) => set({ pdfDocument: doc }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
  setMetadata: (metadata) => set({ metadata }),

  save: async () => {
    const { pdfDocument } = get();
    if (!pdfDocument) return;

    try {
      const pdfBytes = await pdfDocument.save();
      window.vscode.postMessage({
        command: 'save',
        content: pdfBytes
      });
    } catch (error) {
      console.error('Failed to save PDF:', error);
    }
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    const previousState = history[newIndex];
    
    set({
      historyIndex: newIndex,
      currentPage: previousState.currentPage,
      zoomLevel: previousState.zoomLevel,
      canUndo: newIndex > 0,
      canRedo: true
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    const nextState = history[newIndex];
    
    set({
      historyIndex: newIndex,
      currentPage: nextState.currentPage,
      zoomLevel: nextState.zoomLevel,
      canUndo: true,
      canRedo: newIndex < history.length - 1
    });
  },

  addToHistory: (state) => {
    const { history, historyIndex } = get();
    const newHistory = [...history.slice(0, historyIndex + 1), state];
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      canUndo: newHistory.length > 1,
      canRedo: false
    });
  },

  zoomIn: () => {
    const { zoomLevel } = get();
    const newZoom = Math.min(zoomLevel * 1.2, 5);
    set({ zoomLevel: newZoom });
  },

  zoomOut: () => {
    const { zoomLevel } = get();
    const newZoom = Math.max(zoomLevel / 1.2, 0.2);
    set({ zoomLevel: newZoom });
  }
}));