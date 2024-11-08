export async function handleWebviewMessage(message, pdfDoc) {
  switch (message.command) {
    case 'save':
      return await pdfDoc.save();
    
    case 'addText':
      const page = pdfDoc.getPage(message.pageNumber - 1);
      page.drawText(message.text, {
        x: message.x,
        y: message.y,
        size: message.fontSize || 12
      });
      return await pdfDoc.save();
    
    case 'addImage':
      const imageBytes = message.imageData;
      const image = await pdfDoc.embedPng(imageBytes);
      const imagePage = pdfDoc.getPage(message.pageNumber - 1);
      imagePage.drawImage(image, {
        x: message.x,
        y: message.y,
        width: message.width,
        height: message.height
      });
      return await pdfDoc.save();
    
    default:
      throw new Error(`Unknown command: ${message.command}`);
  }
}