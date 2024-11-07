import React from 'react';
import * as RadixToolbar from '@radix-ui/react-toolbar';
import { usePdfStore } from '../store/pdfStore';

export const Toolbar: React.FC = () => {
  const { save, addText, addImage, undo, redo, canUndo, canRedo, zoomIn, zoomOut, zoomLevel } = usePdfStore();

  return (
    <RadixToolbar.Root className="toolbar">
      <RadixToolbar.Group>
        <RadixToolbar.Button onClick={save}>
          <span className="codicon codicon-save"></span>
          Save
        </RadixToolbar.Button>
        <RadixToolbar.Button onClick={() => window.vscode.postMessage({ command: 'export' })}>
          <span className="codicon codicon-export"></span>
          Export
        </RadixToolbar.Button>
      </RadixToolbar.Group>

      <RadixToolbar.Separator />

      <RadixToolbar.Group>
        <RadixToolbar.Button onClick={addText}>
          <span className="codicon codicon-text-size"></span>
          Add Text
        </RadixToolbar.Button>
        <RadixToolbar.Button onClick={addImage}>
          <span className="codicon codicon-file-media"></span>
          Add Image
        </RadixToolbar.Button>
      </RadixToolbar.Group>

      <RadixToolbar.Separator />

      <RadixToolbar.Group>
        <RadixToolbar.Button onClick={undo} disabled={!canUndo}>
          <span className="codicon codicon-discard"></span>
        </RadixToolbar.Button>
        <RadixToolbar.Button onClick={redo} disabled={!canRedo}>
          <span className="codicon codicon-redo"></span>
        </RadixToolbar.Button>
      </RadixToolbar.Group>

      <RadixToolbar.Group>
        <RadixToolbar.Button onClick={zoomOut}>
          <span className="codicon codicon-zoom-out"></span>
        </RadixToolbar.Button>
        <span>{Math.round(zoomLevel * 100)}%</span>
        <RadixToolbar.Button onClick={zoomIn}>
          <span className="codicon codicon-zoom-in"></span>
        </RadixToolbar.Button>
      </RadixToolbar.Group>
    </RadixToolbar.Root>
  );
};