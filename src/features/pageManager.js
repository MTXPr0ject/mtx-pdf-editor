import { PDFDocument, degrees } from 'pdf-lib';

export class PageManager {
  async rotatePage(pdfBytes: Uint8Array, pageNumber: number, angle: number): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPage(pageNumber - 1);
    page.setRotation(degrees(angle));
    return await pdfDoc.save();
  }

  async reorderPages(pdfBytes: Uint8Array, newOrder: number[]): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();
    
    for (const pageNum of newOrder) {
      const [page] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
      newPdf.addPage(page);
    }
    
    return await newPdf.save();
  }

  async deletePage(pdfBytes: Uint8Array, pageNumber: number): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.removePage(pageNumber - 1);
    return await pdfDoc.save();
  }

  async insertBlankPage(pdfBytes: Uint8Array, afterPageNumber: number): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.insertPage(afterPageNumber);
    return await pdfDoc.save();
  }

  async extractPage(pdfBytes: Uint8Array, pageNumber: number): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const newPdf = await PDFDocument.create();
    const [page] = await newPdf.copyPages(pdfDoc, [pageNumber - 1]);
    newPdf.addPage(page);
    return await newPdf.save();
  }
}