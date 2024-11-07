import React from 'react';
import * as RadixToolbar from '@radix-ui/react-toolbar';
import { useAIFeatures } from '../hooks/useAIFeatures';

interface AIFeatures {
  analyzeContent: () => void;
  extractText: () => void;
  suggestEdits: () => void;
  summarize: () => void;
  isProcessing: boolean;
}

export const AIToolbar: React.FC = () => {
  const {
    analyzeContent,
    extractText,
    suggestEdits,
    summarize,
    isProcessing
  }: AIFeatures = useAIFeatures();

  return (
    <RadixToolbar.Root className="ai-toolbar">
      <RadixToolbar.Group>
        <RadixToolbar.Button 
          onClick={analyzeContent} 
          disabled={isProcessing}
        >
          <span className="codicon codicon-search"></span>
          Analyze Content
        </RadixToolbar.Button>

        <RadixToolbar.Button 
          onClick={extractText} 
          disabled={isProcessing}
        >
          <span className="codicon codicon-symbol-text"></span>
          Extract Text
        </RadixToolbar.Button>

        <RadixToolbar.Button 
          onClick={suggestEdits} 
          disabled={isProcessing}
        >
          <span className="codicon codicon-edit"></span>
          Suggest Edits
        </RadixToolbar.Button>

        <RadixToolbar.Button 
          onClick={summarize} 
          disabled={isProcessing}
        >
          <span className="codicon codicon-list-flat"></span>
          Summarize
        </RadixToolbar.Button>
      </RadixToolbar.Group>

      {isProcessing && (
        <div className="processing-indicator">
          <span className="codicon codicon-loading spin"></span>
          Processing...
        </div>
      )}
    </RadixToolbar.Root>
  );
};