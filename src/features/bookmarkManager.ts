import { PDFDocument, PDFRef } from 'pdf-lib';

interface Bookmark {
  title: string;
  pageNumber: number;
  children?: Bookmark[];
}

export class BookmarkManager {
  async getBookmarks(pdfBytes: Uint8Array): Promise<Bookmark[]> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const outline = await pdfDoc.getOutline();
    return this.parseOutline(outline);
  }

  async addBookmark(pdfBytes: Uint8Array, bookmark: Bookmark): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const outline = await pdfDoc.getOutline();
    
    const ref = pdfDoc.context.nextRef();
    const bookmarkDict = {
      Title: bookmark.title,
      Parent: PDFRef.of(0),
      Dest: [
        pdfDoc.getPage(bookmark.pageNumber - 1).ref,
        { type: 'name', name: 'XYZ' },
        null,
        null,
        null,
      ],
    };

    pdfDoc.context.assign(ref, bookmarkDict);
    outline.push({ ref, data: bookmarkDict });

    return await pdfDoc.save();
  }

  async removeBookmark(pdfBytes: Uint8Array, title: string): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const outline = await pdfDoc.getOutline();
    
    const filteredOutline = outline.filter(item => 
      item.data.Title !== title
    );

    // Update the outline
    pdfDoc.catalog.set(PDFRef.of(0), filteredOutline);
    
    return await pdfDoc.save();
  }

  private parseOutline(outline: any[]): Bookmark[] {
    return outline.map(item => ({
      title: item.data.Title,
      pageNumber: this.getPageNumber(item),
      children: item.data.Children ? this.parseOutline(item.data.Children) : undefined
    }));
  }

  private getPageNumber(outlineItem: any): number {
    const dest = outlineItem.data.Dest;
    if (Array.isArray(dest) && dest.length > 0) {
      return dest[0].objectNumber;
    }
    return 1;
  }
}