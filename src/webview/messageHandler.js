const vscode = require('vscode');

async function handleWebviewMessage(message, document, pdfDoc, webviewPanel) {
  switch (message.command) {
    case 'save':
      try {
        const pdfBytes = await pdfDoc.save();
        await vscode.workspace.fs.writeFile(document.uri, Buffer.from(pdfBytes));
        vscode.window.showInformationMessage('PDF saved successfully!');
      } catch (error) {
        vscode.window.showErrorMessage('Failed to save PDF: ' + error.message);
      }
      break;

    case 'export':
      const saveUri = await vscode.window.showSaveDialog({
        filters: {
          'PDF Files': ['pdf']
        },
        saveLabel: 'Export PDF'
      });

      if (saveUri) {
        try {
          const pdfBytes = await pdfDoc.save();
          await vscode.workspace.fs.writeFile(saveUri, Buffer.from(pdfBytes));
          vscode.window.showInformationMessage('PDF exported successfully!');
        } catch (error) {
          vscode.window.showErrorMessage('Failed to export PDF: ' + error.message);
        }
      }
      break;

    case 'addText':
      try {
        const page = pdfDoc.getPage(message.pageNumber);
        page.drawText(message.text, {
          x: message.x,
          y: message.y,
          size: message.fontSize,
          font: await pdfDoc.embedFont('Helvetica')
        });
        
        const pdfBytes = await pdfDoc.save();
        webviewPanel.webview.postMessage({
          type: 'updatePdf',
          data: Array.from(pdfBytes)
        });
      } catch (error) {
        vscode.window.showErrorMessage('Failed to add text: ' + error.message);
      }
      break;

    case 'addImage':
      try {
        const imageBytes = await vscode.workspace.fs.readFile(vscode.Uri.parse(message.imageUri));
        const image = await pdfDoc.embedPng(imageBytes);
        const page = pdfDoc.getPage(message.pageNumber);
        
        page.drawImage(image, {
          x: message.x,
          y: message.y,
          width: message.width,
          height: message.height
        });

        const pdfBytes = await pdfDoc.save();
        webviewPanel.webview.postMessage({
          type: 'updatePdf',
          data: Array.from(pdfBytes)
        });
      } catch (error) {
        vscode.window.showErrorMessage('Failed to add image: ' + error.message);
      }
      break;
  }
}

module.exports = { handleWebviewMessage };