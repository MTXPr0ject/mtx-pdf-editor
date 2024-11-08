import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { PDFDocument } from 'pdf-lib';
import { PdfEditorProvider } from './providers/pdfEditorProvider.js';

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
    // Implement PDF loading logic
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

// Start server
app.listen(port, () => {
  console.log(`PDF Editor server running at http://localhost:${port}`);
});