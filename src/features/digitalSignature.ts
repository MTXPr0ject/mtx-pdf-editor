import { signer } from 'node-signpdf';
import { PDFDocument } from 'pdf-lib';

export class DigitalSignature {
  async signPDF(pdfBytes: Uint8Array, certificate: ArrayBuffer, reason: string) {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const signedPdf = await signer.sign(pdfBytes, certificate, {
        reason,
        contactInfo: 'MTX PDF Editor',
        location: 'Digital Signature',
      });
      return signedPdf;
    } catch (error) {
      throw new Error(`Signing failed: ${error.message}`);
    }
  }

  async verifySignature(pdfBytes: Uint8Array) {
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      // Implement signature verification logic
      return { isValid: true, signedBy: 'User', date: new Date() };
    } catch (error) {
      throw new Error(`Verification failed: ${error.message}`);
    }
  }
}