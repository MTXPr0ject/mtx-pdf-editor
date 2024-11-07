const vscode = require('vscode');

function getWebviewContent(webview, extensionUri) {
  const pdfJsDistUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, 'node_modules', 'pdfjs-dist')
  );

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PDF Editor</title>
        <script src="${pdfJsDistUri}/build/pdf.min.js"></script>
        <style>
          :root {
            --toolbar-height: 40px;
            --sidebar-width: 250px;
          }

          body {
            margin: 0;
            padding: 0;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            display: flex;
            height: 100vh;
            font-family: var(--vscode-font-family);
          }

          .sidebar {
            width: var(--sidebar-width);
            background: var(--vscode-sideBar-background);
            border-right: 1px solid var(--vscode-panel-border);
            display: flex;
            flex-direction: column;
          }

          .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .toolbar {
            height: var(--toolbar-height);
            background: var(--vscode-editor-background);
            border-bottom: 1px solid var(--vscode-panel-border);
            display: flex;
            align-items: center;
            padding: 0 10px;
            gap: 10px;
          }

          .toolbar-group {
            display: flex;
            gap: 5px;
            padding: 0 10px;
            border-right: 1px solid var(--vscode-panel-border);
          }

          .toolbar-group:last-child {
            border-right: none;
          }

          button {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 4px 8px;
            border-radius: 3px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          button:hover {
            background: var(--vscode-button-hoverBackground);
          }

          button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .pdf-container {
            flex: 1;
            overflow: auto;
            padding: 20px;
            display: flex;
            justify-content: center;
            background: var(--vscode-editor-background);
          }

          #pdfViewer {
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            background: white;
          }

          .thumbnail {
            padding: 10px;
            cursor: pointer;
            border-bottom: 1px solid var(--vscode-panel-border);
          }

          .thumbnail:hover {
            background: var(--vscode-list-hoverBackground);
          }

          .thumbnail.selected {
            background: var(--vscode-list-activeSelectionBackground);
            color: var(--vscode-list-activeSelectionForeground);
          }

          .properties-panel {
            padding: 10px;
          }

          .properties-panel label {
            display: block;
            margin-bottom: 5px;
          }

          .properties-panel input,
          .properties-panel select {
            width: 100%;
            margin-bottom: 10px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            padding: 4px;
          }
        </style>
      </head>
      <body>
        <div class="sidebar">
          <div class="toolbar">
            <button id="thumbnailsBtn" title="Toggle Thumbnails">
              <span class="codicon codicon-preview"></span>
            </button>
            <button id="propertiesBtn" title="Toggle Properties">
              <span class="codicon codicon-settings-gear"></span>
            </button>
          </div>
          <div id="thumbnailsPanel"></div>
          <div id="propertiesPanel" class="properties-panel" style="display: none;">
            <label>Page Size</label>
            <select id="pageSize">
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="Letter">Letter</option>
            </select>

            <label>Page Orientation</label>
            <select id="pageOrientation">
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
        </div>

        <div class="main-content">
          <div class="toolbar">
            <div class="toolbar-group">
              <button id="saveBtn" title="Save">
                <span class="codicon codicon-save"></span> Save
              </button>
              <button id="exportBtn" title="Export">
                <span class="codicon codicon-export"></span> Export
              </button>
            </div>
            
            <div class="toolbar-group">
              <button id="addTextBtn" title="Add Text">
                <span class="codicon codicon-text-size"></span> Text
              </button>
              <button id="addImageBtn" title="Add Image">
                <span class="codicon codicon-file-media"></span> Image
              </button>
              <button id="addShapeBtn" title="Add Shape">
                <span class="codicon codicon-symbol-class"></span> Shape
              </button>
            </div>

            <div class="toolbar-group">
              <button id="undoBtn" title="Undo" disabled>
                <span class="codicon codicon-discard"></span>
              </button>
              <button id="redoBtn" title="Redo" disabled>
                <span class="codicon codicon-redo"></span>
              </button>
            </div>

            <div class="toolbar-group">
              <button id="zoomOutBtn" title="Zoom Out">
                <span class="codicon codicon-zoom-out"></span>
              </button>
              <span id="zoomLevel">100%</span>
              <button id="zoomInBtn" title="Zoom In">
                <span class="codicon codicon-zoom-in"></span>
              </button>
            </div>
          </div>

          <div class="pdf-container">
            <canvas id="pdfViewer"></canvas>
          </div>
        </div>

        <script>
          const vscode = acquireVsCodeApi();
          let pdfDoc = null;
          let pageNum = 1;
          let zoomLevel = 1;
          let undoStack = [];
          let redoStack = [];

          // Initialize PDF.js
          pdfjsLib.GlobalWorkerOptions.workerSrc = '${pdfJsDistUri}/build/pdf.worker.min.js';

          // Handle messages from extension
          window.addEventListener('message', async event => {
            const message = event.data;
            
            switch (message.type) {
              case 'loadPdf':
                const pdfData = new Uint8Array(message.data);
                await loadPdf(pdfData);
                break;
            }
          });

          async function loadPdf(pdfData) {
            try {
              pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
              const page = await pdfDoc.getPage(1);
              renderPage(page);
              updateThumbnails();
            } catch (error) {
              console.error('Error loading PDF:', error);
            }
          }

          async function renderPage(page) {
            const canvas = document.getElementById('pdfViewer');
            const context = canvas.getContext('2d');
            
            const viewport = page.getViewport({ scale: zoomLevel });
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise;
          }

          async function updateThumbnails() {
            const thumbnailsPanel = document.getElementById('thumbnailsPanel');
            thumbnailsPanel.innerHTML = '';

            for (let i = 1; i <= pdfDoc.numPages; i++) {
              const thumbnail = document.createElement('div');
              thumbnail.className = 'thumbnail';
              thumbnail.textContent = \`Page \${i}\`;
              thumbnail.onclick = () => goToPage(i);
              thumbnailsPanel.appendChild(thumbnail);
            }
          }

          // Event Listeners
          document.getElementById('saveBtn').addEventListener('click', () => {
            vscode.postMessage({ command: 'save' });
          });

          document.getElementById('exportBtn').addEventListener('click', () => {
            vscode.postMessage({ command: 'export' });
          });

          document.getElementById('zoomInBtn').addEventListener('click', () => {
            zoomLevel *= 1.2;
            document.getElementById('zoomLevel').textContent = \`\${Math.round(zoomLevel * 100)}%\`;
            if (pdfDoc) {
              pdfDoc.getPage(pageNum).then(renderPage);
            }
          });

          document.getElementById('zoomOutBtn').addEventListener('click', () => {
            zoomLevel /= 1.2;
            document.getElementById('zoomLevel').textContent = \`\${Math.round(zoomLevel * 100)}%\`;
            if (pdfDoc) {
              pdfDoc.getPage(pageNum).then(renderPage);
            }
          });

          // Initialize UI
          document.getElementById('thumbnailsBtn').addEventListener('click', () => {
            const panel = document.getElementById('thumbnailsPanel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
          });

          document.getElementById('propertiesBtn').addEventListener('click', () => {
            const panel = document.getElementById('propertiesPanel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
          });
        </script>
      </body>
    </html>
  `;
}

module.exports = { getWebviewContent };