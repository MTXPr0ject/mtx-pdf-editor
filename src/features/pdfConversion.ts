import { Document, Packer, Paragraph } from 'docx';
import { pdf2pic } from 'pdf2pic';
import Tesseract from 'tesseract.js';

export class PDFConversion {
  async pdfToWord(pdfBytes: Uint8Array) {
    try {
      const text = await this.extractText(pdfBytes);
      const doc = new Document({
        sections: [{
          properties: {},
          children: [new Paragraph(text)]
        }]
      });
      
      return await Packer.toBuffer(doc);
    } catch (error) {
      throw new Error(`PDF to Word conversion failed: ${error.message}`);
    }
  }

  async pdfToImages(pdfBytes: Uint8Array) {
    try {
      const options = {
        density: 100,
        saveFilename: "page",
        format: "png",
        width: 800
      };
      
      const convert = pdf2pic.fromBuffer(pdfBytes, options);
      return await convert.bulk(-1); // Convert all pages
    } catch (error) {
      throw new Error(`PDF to Image conversion failed: ${error.message}`);
    }
  }

  private async extractText(pdfBytes: Uint8Array) {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    let text = '';
    
    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      const base64 = await this.pageToImage(page);
      const result = await Tesseract.recognize(base64);
      text += result.data.text + '\n';
    }
    
    return text;
  }
}