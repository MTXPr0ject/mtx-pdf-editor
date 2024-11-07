const vscode = require('vscode');
const { PDFDocument } = require('pdf-lib');

class PdfEditorProvider {
  static register(context) {
    const provider = new PdfEditorProvider(context);
    return vscode.window.registerCustomEditorProvider('pdf-editor.pdfEditor', provider);
  }

  constructor(context) {
    this.context = context;
  }

  async resolveCustomEditor(document, webviewPanel) {
    webviewPanel.webview.options = {
      enableScripts: true
    };

    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    webviewPanel.webview.onDidReceiveMessage(async message => {
      switch (message.command) {
        case 'save':
          try {
            const pdfDoc = await PDFDocument.load(message.content);
            const pdfBytes = await pdfDoc.save();
            await vscode.workspace.fs.writeFile(document.uri, Buffer.from(pdfBytes));
          } catch (error) {
            vscode.window.showErrorMessage('Failed to save PDF: ' + error.message);
          }
          break;
      }
    });
  }

  getHtmlForWebview(webview) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>PDF Editor</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              background: var(--vscode-editor-background);
              color: var(--vscode-editor-foreground);
            }
            .pdf-container {
              width: 100%;
              height: 100vh;
              display: flex;
              flex-direction: column;
            }
            #pdfViewer {
              flex: 1;
              border: 1px solid var(--vscode-panel-border);
              margin-top: 10px;
            }
            .toolbar {
              display: flex;
              gap: 10px;
              margin-bottom: 10px;
            }
            button {
              background: var(--vscode-button-background);
              color: var(--vscode-button-foreground);
              border: none;
              padding: 6px 12px;
              cursor: pointer;
            }
            button:hover {
              background: var(--vscode-button-hoverBackground);
            }
          </style>
        </head>
        <body>
          <div class="pdf-container">
            <div class="toolbar">
              <button id="saveBtn">Save</button>
              <button id="addTextBtn">Add Text</button>
              <button id="addImageBtn">Add Image</button>
            </div>
            <div id="pdfViewer"></div>
          </div>
          <script>
            const vscode = acquireVsCodeApi();
            
            document.getElementById('saveBtn').addEventListener('click', () => {
              // Implement save functionality
              vscode.postMessage({
                command: 'save',
                content: /* PDF content */
              });
            });

            document.getElementById('addTextBtn').addEventListener('click', () => {
              // Implement text addition
            });

            document.getElementById('addImageBtn').addEventListener('click', () => {
              // Implement image addition
            });
          </script>
        </body>
      </html>
    `;
  }
}

function activate(context) {
  context.subscriptions.push(
    PdfEditorProvider.register(context),
    
    vscode.commands.registerCommand('pdf-editor.openPdf', async () => {
      const pdfUri = await vscode.window.showOpenDialog({
        canSelectMany: false,
        filters: {
          'PDF Files': ['pdf']
        }
      });
      
      if (pdfUri && pdfUri[0]) {
        const document = await vscode.workspace.openTextDocument(pdfUri[0]);
        await vscode.window.showTextDocument(document);
      }
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
}