import PDFMerger from 'pdf-merger-js';
import { PDFDocument } from 'pdf-lib';

export class PDFMergeAndSplit {
  async mergePDFs(pdfFiles) {
    const merger = new PDFMerger();
    
    try {
      for (const pdfFile of pdfFiles) {
        await merger.add(pdfFile);
      }
      return await merger.saveAsBuffer();
    } catch (error) {
      throw new Error(`Merge failed: ${error.message}`);
    }
  }

  async splitPDF(pdfBytes, pages) {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const newPdf = await PDFDocument.create();
      
      for (const pageNum of pages) {
        const [page] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
        newPdf.addPage(page);
      }
      
      return await newPdf.save();
    } catch (error) {
      throw new Error(`Split failed: ${error.message}`);
    }
  }
}