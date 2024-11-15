import { useState } from 'react';
import { usePdfStore } from '../store/pdfStore';
import { AIService } from '../services/aiService';

export const useAIFeatures = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { pdfDocument, currentPage } = usePdfStore();
  const aiService = new AIService(process.env.OPENAI_API_KEY || '');

  const extractText = async () => {
    if (!pdfDocument) return;

    setIsProcessing(true);
    try {
      const page = await pdfDocument.getPage(currentPage);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      window.vscode.postMessage({
        command: 'showExtractedText',
        text
      });
    } catch (error) {
      console.error('Text extraction failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeContent = async () => {
    if (!pdfDocument) return;

    setIsProcessing(true);
    try {
      const page = await pdfDocument.getPage(currentPage);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      const analysis = await aiService.analyzeContent(text);
      
      window.vscode.postMessage({
        command: 'showAnalysis',
        analysis
      });
    } catch (error) {
      console.error('Content analysis failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const suggestEdits = async () => {
    if (!pdfDocument) return;

    setIsProcessing(true);
    try {
      const page = await pdfDocument.getPage(currentPage);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      const suggestions = await aiService.suggestEdits(text);
      
      window.vscode.postMessage({
        command: 'showSuggestions',
        suggestions
      });
    } catch (error) {
      console.error('Edit suggestions failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const summarize = async () => {
    if (!pdfDocument) return;

    setIsProcessing(true);
    try {
      const page = await pdfDocument.getPage(currentPage);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item: any) => item.str)
        .join(' ');

      const summary = await aiService.summarizeContent(text);
      
      window.vscode.postMessage({
        command: 'showSummary',
        summary
      });
    } catch (error) {
      console.error('Summarization failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    analyzeContent,
    extractText,
    suggestEdits,
    summarize,
    isProcessing
  };
};