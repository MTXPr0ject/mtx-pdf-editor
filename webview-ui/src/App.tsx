import React from 'react';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { PdfViewer } from './components/PdfViewer';
import { usePdfStore } from './store/pdfStore';

export const App: React.FC = () => {
  const { pdfDocument } = usePdfStore();

  return (
    <div className="app">
      <Sidebar />
      <main className="main-content">
        <Toolbar />
        <PdfViewer />
      </main>
    </div>
  );
};