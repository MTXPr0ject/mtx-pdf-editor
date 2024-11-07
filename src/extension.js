const vscode = require('vscode');
const { PdfEditorProvider } = require('./providers/pdfEditorProvider');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Register PDF Editor Provider
  context.subscriptions.push(
    PdfEditorProvider.register(context),
    
    // Register commands
    vscode.commands.registerCommand('mtx-pdf-editor.openPdf', async () => {
      try {
        const pdfUri = await vscode.window.showOpenDialog({
          canSelectMany: false,
          filters: {
            'PDF Files': ['pdf']
          }
        });
        
        if (pdfUri && pdfUri[0]) {
          await vscode.commands.executeCommand('vscode.openWith', pdfUri[0], 'mtx-pdf-editor.pdfEditor');
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to open PDF: ${error.message}`);
      }
    }),

    vscode.commands.registerCommand('mtx-pdf-editor.exportPdf', async () => {
      try {
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
          return vscode.window.showErrorMessage('No active PDF document to export');
        }

        const saveUri = await vscode.window.showSaveDialog({
          filters: {
            'PDF Files': ['pdf']
          },
          saveLabel: 'Export PDF'
        });

        if (saveUri) {
          await vscode.workspace.fs.copy(activeEditor.document.uri, saveUri, { overwrite: true });
          vscode.window.showInformationMessage('PDF exported successfully!');
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to export PDF: ${error.message}`);
      }
    })
  );

  // Show welcome message on first install
  const config = vscode.workspace.getConfiguration('mtx-pdf-editor');
  const isFirstInstall = config.get('firstInstall');
  
  if (isFirstInstall === undefined) {
    vscode.window.showInformationMessage('Thank you for installing MTX PDF Editor! Open any PDF file to get started.');
    config.update('firstInstall', false, true);
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};