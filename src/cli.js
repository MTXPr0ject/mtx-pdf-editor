#!/usr/bin/env node
import { Command } from 'commander';
import { showWelcome, showSuccess, showError } from './cli/ui.js';
import { PDFMergeAndSplit } from './features/pdfMerger.ts';
import { Watermark } from './features/watermark.ts';
import { FormHandler } from './features/formHandler.ts';
import { PageManager } from './features/pageManager.ts';
import { SearchReplace } from './features/searchReplace.ts';
import { PDFCompressor } from './features/pdfCompressor.ts';
import { PDFConversion } from './features/pdfConversion.ts';
import { DigitalSignature } from './features/digitalSignature.ts';
import { BookmarkManager } from './features/bookmarkManager.ts';
import { AIService } from './services/aiService.ts';
import { readFile, writeFile } from 'fs/promises';

const program = new Command();

// Initialize features
const merger = new PDFMergeAndSplit();
const watermark = new Watermark();
const formHandler = new FormHandler();
const pageManager = new PageManager();
const searchReplace = new SearchReplace();
const compressor = new PDFCompressor();
const converter = new PDFConversion();
const signature = new DigitalSignature();
const bookmarks = new BookmarkManager();

program
  .name('mtx')
  .description('MTX PDF Editor - Advanced PDF manipulation tool')
  .version('0.0.1');

// Merge PDFs
program
  .command('merge <files...>')
  .description('Merge multiple PDF files')
  .option('-o, --output <file>', 'Output file name', 'merged.pdf')
  .action(async (files, options) => {
    try {
      const pdfFiles = await Promise.all(
        files.map(file => readFile(file))
      );
      const mergedPdf = await merger.mergePDFs(pdfFiles);
      await writeFile(options.output, mergedPdf);
      showSuccess(`PDFs merged successfully to ${options.output}!`);
    } catch (error) {
      showError(`Merge failed: ${error.message}`);
    }
  });

// Add watermark
program
  .command('watermark <file> <text>')
  .description('Add watermark to PDF')
  .option('-c, --color <rgb>', 'Watermark color (comma-separated RGB)', '0.5,0.5,0.5')
  .option('-o, --opacity <number>', 'Watermark opacity', '0.3')
  .option('-r, --rotation <degrees>', 'Watermark rotation', '-45')
  .option('-s, --size <number>', 'Font size', '50')
  .option('-out, --output <file>', 'Output file name')
  .action(async (file, text, options) => {
    try {
      const pdfBytes = await readFile(file);
      const color = options.color.split(',').map(Number);
      const watermarkedPdf = await watermark.addWatermark(pdfBytes, text, {
        color,
        opacity: parseFloat(options.opacity),
        rotation: parseFloat(options.rotation),
        fontSize: parseFloat(options.size)
      });
      const outputFile = options.output || `watermarked-${file}`;
      await writeFile(outputFile, watermarkedPdf);
      showSuccess(`Watermark added successfully to ${outputFile}!`);
    } catch (error) {
      showError(`Watermark failed: ${error.message}`);
    }
  });

// Compress PDF
program
  .command('compress <file>')
  .description('Compress PDF file')
  .option('-q, --quality <number>', 'Image quality (0-1)', '0.8')
  .option('-g, --grayscale', 'Convert to grayscale')
  .option('-d, --dpi <number>', 'DPI for images', '150')
  .option('-o, --output <file>', 'Output file name')
  .action(async (file, options) => {
    try {
      const pdfBytes = await readFile(file);
      const compressedPdf = await compressor.compress(pdfBytes, {
        imageQuality: parseFloat(options.quality),
        grayscale: options.grayscale,
        dpi: parseInt(options.dpi)
      });
      const outputFile = options.output || `compressed-${file}`;
      await writeFile(outputFile, compressedPdf);
      showSuccess(`PDF compressed successfully to ${outputFile}!`);
    } catch (error) {
      showError(`Compression failed: ${error.message}`);
    }
  });

// Convert PDF
program
  .command('convert <file> <format>')
  .description('Convert PDF to other formats (word, images)')
  .option('-o, --output <file>', 'Output file name')
  .action(async (file, format, options) => {
    try {
      const pdfBytes = await readFile(file);
      let result;
      let outputFile = options.output;

      switch (format.toLowerCase()) {
        case 'word':
          result = await converter.pdfToWord(pdfBytes);
          outputFile = outputFile || file.replace('.pdf', '.docx');
          break;
        case 'images':
          result = await converter.pdfToImages(pdfBytes);
          // Images are saved automatically with incrementing numbers
          break;
        default:
          throw new Error('Unsupported format. Use: word, images');
      }

      if (result && outputFile) {
        await writeFile(outputFile, result);
      }
      showSuccess(`PDF converted to ${format} successfully!`);
    } catch (error) {
      showError(`Conversion failed: ${error.message}`);
    }
  });

// AI analysis
program
  .command('analyze <file>')
  .description('Analyze PDF content using AI')
  .requiredOption('-k, --apiKey <key>', 'OpenAI API key')
  .option('-t, --type <type>', 'Analysis type (analyze, summarize, suggest)', 'analyze')
  .action(async (file, options) => {
    try {
      const pdfBytes = await readFile(file);
      const ai = new AIService(options.apiKey);
      let result;

      switch (options.type) {
        case 'analyze':
          result = await ai.analyzeContent(pdfBytes);
          break;
        case 'summarize':
          result = await ai.summarizeContent(pdfBytes);
          break;
        case 'suggest':
          result = await ai.suggestEdits(pdfBytes);
          break;
        default:
          throw new Error('Invalid analysis type');
      }

      console.log('\nAI Analysis Results:');
      console.log('-'.repeat(50));
      console.log(result);
      console.log('-'.repeat(50));
    } catch (error) {
      showError(`AI analysis failed: ${error.message}`);
    }
  });

// Show welcome message on start
if (process.argv.length === 2) {
  showWelcome();
}

program.parse(process.argv);