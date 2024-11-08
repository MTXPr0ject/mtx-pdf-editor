import { PDFDocument } from 'pdf-lib';
import { getWebviewContent } from '../webview/webviewContent.js';
import { handleWebviewMessage } from '../webview/messageHandler.js';

export class PdfEditorProvider {
  constructor() {
    this.documents = new Map();
  }

  async loadDocument(documentId) {
    try {
      const pdfDoc = await PDFDocument.create();
      this.documents.set(documentId, pdfDoc);
      return pdfDoc;
    } catch (error) {
      throw new Error(`Failed to load document: ${error.message}`);
    }
  }

  async saveDocument(documentId, pdfBytes) {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      this.documents.set(documentId, pdfDoc);
      return await pdfDoc.save();
    } catch (error) {
      throw new Error(`Failed to save document: ${error.message}`);
    }
  }

  getDocument(documentId) {
    return this.documents.get(documentId);
  }

  async createWebviewContent() {
    return getWebviewContent();
  }

  async handleMessage(message, documentId) {
    const pdfDoc = this.getDocument(documentId);
    if (!pdfDoc) {
      throw new Error('Document not found');
    }
    return handleWebviewMessage(message, pdfDoc);
  }
}