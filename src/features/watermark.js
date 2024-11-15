import { PDFDocument, rgb, degrees } from 'pdf-lib';

export class Watermark {
  async addWatermark(pdfBytes, text, options = {}) {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      
      const {
        color = [0.5, 0.5, 0.5],
        opacity = 0.3,
        rotation = -45,
        fontSize = 50
      } = options;

      for (const page of pages) {
        const { width, height } = page.getSize();
        page.drawText(text, {
          x: width / 2,
          y: height / 2,
          size: fontSize,
          opacity,
          color: rgb(color[0], color[1], color[2]),
          rotate: degrees(rotation),
        });
      }

      return await pdfDoc.save();
    } catch (error) {
      throw new Error(`Watermark failed: ${error.message}`);
    }
  }
}