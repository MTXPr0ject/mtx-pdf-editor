import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import Tesseract from 'tesseract.js';

export class SearchReplace {
  async searchText(pdfBytes: Uint8Array, searchTerm: string): Promise<Array<{
    pageNumber: number;
    matches: Array<{
      text: string;
      x: number;
      y: number;
    }>;
  }>> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const results = [];

    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const page = pdfDoc.getPage(i);
      const textContent = await this.extractPageText(page);
      const matches = this.findMatches(textContent, searchTerm);
      
      if (matches.length > 0) {
        results.push({
          pageNumber: i + 1,
          matches
        });
      }
    }

    return results;
  }

  async replaceText(pdfBytes: Uint8Array, searchTerm: string, replacement: string): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const searchResults = await this.searchText(pdfBytes, searchTerm);

    for (const result of searchResults) {
      const page = pdfDoc.getPage(result.pageNumber - 1);
      
      // Create new content stream with replaced text
      for (const match of result.matches) {
        await this.replaceTextInPage(page, match, replacement);
      }
    }

    return await pdfDoc.save();
  }

  async highlightText(pdfBytes: Uint8Array, searchTerm: string, color: [number, number, number] = [1, 1, 0]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const searchResults = await this.searchText(pdfBytes, searchTerm);

    for (const result of searchResults) {
      const page = pdfDoc.getPage(result.pageNumber - 1);
      
      for (const match of result.matches) {
        page.drawRectangle({
          x: match.x,
          y: match.y,
          width: this.calculateTextWidth(match.text),
          height: 14,
          color: rgb(color[0], color[1], color[2]),
          opacity: 0.3
        });
      }
    }

    return await pdfDoc.save();
  }

  private async extractPageText(page: PDFPage): Promise<string> {
    // Convert page to image for OCR
    const { width, height } = page.getSize();
    const base64 = await this.pageToImage(page);
    const result = await Tesseract.recognize(base64);
    return result.data.text;
  }

  private findMatches(text: string, searchTerm: string): Array<{
    text: string;
    x: number;
    y: number;
  }> {
    const matches = [];
    let match;
    const regex = new RegExp(searchTerm, 'gi');
    
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        text: match[0],
        x: 0, // Calculate actual coordinates based on match position
        y: 0
      });
    }
    
    return matches;
  }

  private async replaceTextInPage(page: PDFPage, match: { x: number; y: number; text: string }, replacement: string): Promise<void> {
    // Remove old text
    const { width, height } = page.getSize();
    page.drawRectangle({
      x: match.x,
      y: match.y,
      width: this.calculateTextWidth(match.text),
      height: 14,
      color: rgb(1, 1, 1)
    });

    // Add new text
    page.drawText(replacement, {
      x: match.x,
      y: match.y,
      size: 12
    });
  }

  private calculateTextWidth(text: string): number {
    // Simple estimation - replace with actual font metrics
    return text.length * 6;
  }

  private async pageToImage(page: PDFPage): Promise<string> {
    // Implementation to convert PDF page to image for OCR
    return '';
  }
}