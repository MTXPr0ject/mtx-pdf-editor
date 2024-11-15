import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PDFDocument } from 'pdf-lib';
import { PdfEditorProvider } from './providers/pdfEditorProvider.js';
import chalk from 'chalk';
import gradient from 'gradient-string';
import figlet from 'figlet';
import boxen from 'boxen';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Serve static files from webview-ui/dist
app.use(express.static(join(__dirname, '../webview-ui/dist')));

// Initialize PDF editor provider
const pdfEditor = new PdfEditorProvider();

// API endpoints
app.post('/api/pdf/save', express.json(), async (req, res) => {
  try {
    const { pdfData } = req.body;
    const pdfDoc = await PDFDocument.load(pdfData);
    const pdfBytes = await pdfDoc.save();
    res.json({ success: true, data: pdfBytes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/pdf/load/:id', async (req, res) => {
  try {
    res.json({ success: true, message: 'PDF loading endpoint' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal Server Error' });
});

// Start server with fancy console output
app.listen(port, () => {
  console.clear();
  
  // Display ASCII art title
  console.log('\n' + gradient(['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF']).multiline(
    figlet.textSync('MTX PDF', {
      font: 'ANSI Shadow',
      horizontalLayout: 'fitted'
    })
  ));

  console.log(gradient.pastel.multiline(
    figlet.textSync('EDITOR', {
      font: 'Small',
      horizontalLayout: 'fitted'
    })
  ));

  // Display server info
  console.log('\n' + boxen(
    chalk.bold('🚀 Server Status') + '\n\n' +
    chalk.blue('Status: ') + chalk.green('Running') + '\n' +
    chalk.blue('Port: ') + chalk.green(port) + '\n' +
    chalk.blue('URL: ') + chalk.green(`http://localhost:${port}`) + '\n' +
    chalk.blue('Mode: ') + chalk.green('Development'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      float: 'center'
    }
  ));

  // Display available endpoints
  console.log(boxen(
    chalk.yellow.bold('Available Endpoints:') + '\n\n' +
    chalk.green('✓ ') + chalk.white('POST /api/pdf/save') + chalk.gray(' - Save PDF modifications\n') +
    chalk.green('✓ ') + chalk.white('GET /api/pdf/load/:id') + chalk.gray(' - Load PDF document'),
    {
      padding: 1,
      margin: { top: 0, bottom: 1, left: 1, right: 1 },
      borderStyle: 'single',
      borderColor: 'yellow'
    }
  ));

  // Display ready message
  console.log(boxen(
    chalk.green.bold('✨ PDF Editor is ready to rock!'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'green',
      float: 'center'
    }
  ));
});