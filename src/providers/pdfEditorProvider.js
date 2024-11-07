const vscode = require('vscode');
const { PDFDocument } = require('pdf-lib');
const { getWebviewContent } = require('../webview/webviewContent');
const { handleWebviewMessage } = require('../webview/messageHandler');

class PdfEditorProvider {
  static register(context) {
    const provider = new PdfEditorProvider(context);
    return vscode.window.registerCustomEditorProvider('mtx-pdf-editor.pdfEditor', provider, {
      webviewOptions: { 
        retainContextWhenHidden: true,
        enableFindWidget: true
      },
      supportsMultipleEditorsPerDocument: false
    });
  }

  constructor(context) {
    this.context = context;
  }

  async resolveCustomEditor(document, webviewPanel, _token) {
    try {
      // Set up error handling
      webviewPanel.webview.onDidReceiveMessage(message => {
        if (message.type === 'error') {
          vscode.window.showErrorMessage(`PDF Editor Error: ${message.message}`);
        }
      });

      // Configure webview
      webviewPanel.webview.options = {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(this.context.extensionUri, 'media'),
          vscode.Uri.joinPath(this.context.extensionUri, 'node_modules'),
          vscode.Uri.joinPath(this.context.extensionUri, 'dist')
        ]
      };

      // Load PDF document
      const pdfData = await vscode.workspace.fs.readFile(document.uri);
      const pdfDoc = await PDFDocument.load(pdfData);

      // Set up webview content
      webviewPanel.webview.html = getWebviewContent(webviewPanel.webview, this.context.extensionUri);

      // Handle messages from webview
      webviewPanel.webview.onDidReceiveMessage(async message => {
        try {
          await handleWebviewMessage(message, document, pdfDoc, webviewPanel);
        } catch (error) {
          vscode.window.showErrorMessage(`Failed to handle PDF operation: ${error.message}`);
        }
      });

      // Send initial PDF data to webview
      const pdfBytes = await pdfDoc.save();
      webviewPanel.webview.postMessage({
        type: 'loadPdf',
        data: Array.from(pdfBytes)
      });

    } catch (error) {
      webviewPanel.webview.html = this.getErrorHtml(error.message);
      vscode.window.showErrorMessage(`Failed to load PDF: ${error.message}`);
    }
  }

  getErrorHtml(errorMessage) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              font-family: var(--vscode-font-family);
              color: var(--vscode-editor-foreground);
              background: var(--vscode-editor-background);
            }
            .error-container {
              text-align: center;
              padding: 2rem;
              border: 1px solid var(--vscode-inputValidation-errorBorder);
              border-radius: 4px;
              background: var(--vscode-inputValidation-errorBackground);
            }
            button {
              margin-top: 1rem;
              padding: 0.5rem 1rem;
              background: var(--vscode-button-background);
              color: var(--vscode-button-foreground);
              border: none;
              border-radius: 2px;
              cursor: pointer;
            }
            button:hover {
              background: var(--vscode-button-hoverBackground);
            }
          </style>
        </head>
        <body>
          <div class="error-container">
            <h2>Error Loading PDF</h2>
            <p>${errorMessage}</p>
            <button onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>
    `;
  }
}

module.exports = { PdfEditorProvider };