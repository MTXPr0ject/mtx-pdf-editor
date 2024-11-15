import { PDFDocument, PDFImage } from 'pdf-lib';
import { Image } from 'image-js';

export class PDFCompressor {
  async compress(pdfBytes: Uint8Array, options: {
    imageQuality?: number;
    grayscale?: boolean;
    dpi?: number;
  } = {}): Promise<Uint8Array> {
    const {
      imageQuality = 0.8,
      grayscale = false,
      dpi = 150
    } = options;

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const images = await this.extractImages(page);
      
      for (const image of images) {
        const compressedImage = await this.compressImage(image, {
          quality: imageQuality,
          grayscale,
          dpi
        });
        
        await this.replaceImage(page, image, compressedImage);
      }
    }

    return await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      preserveObjectIds: true
    });
  }

  private async extractImages(page: any): Promise<PDFImage[]> {
    const operators = await page.getOperators();
    const images: PDFImage[] = [];

    for (const op of operators) {
      if (op.name === 'Do' && op.args[0]?.type === 'image') {
        images.push(op.args[0]);
      }
    }

    return images;
  }

  private async compressImage(image: PDFImage, options: {
    quality: number;
    grayscale: boolean;
    dpi: number;
  }): Promise<ArrayBuffer> {
    const img = await Image.load(await image.getData());
    
    let processed = img;
    if (options.grayscale) {
      processed = processed.grey();
    }
    
    processed = processed.resize({
      width: Math.round(processed.width * (options.dpi / 300))
    });

    return processed.toBuffer({ format: 'jpeg', quality: options.quality });
  }

  private async replaceImage(page: any, oldImage: PDFImage, newImageData: ArrayBuffer): Promise<void> {
    const pdfDoc = page.doc;
    const newImage = await pdfDoc.embedJpg(newImageData);
    
    // Replace old image reference with new one
    const operators = await page.getOperators();
    for (const op of operators) {
      if (op.name === 'Do' && op.args[0] === oldImage) {
        op.args[0] = newImage;
      }
    }
  }
}