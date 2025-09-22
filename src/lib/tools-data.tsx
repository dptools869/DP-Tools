import { Calculator, FileText, ImageIcon, Merge, Split, Shrink, CaseSensitive, Repeat, Percent, Ruler, FileType, Image, ScanText, Presentation, Copyright, Sheet, Globe } from 'lucide-react';
import React from 'react';

export interface Tool {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export interface ToolCategory {
  title: string;
  description: string;
  tools: Tool[];
}

export const toolsData: Record<string, ToolCategory> = {
  'pdf-tools': {
    title: 'PDF Tools',
    description: 'A comprehensive suite of tools to manage and manipulate your PDF files effortlessly.',
    tools: [
      {
        title: 'Merge PDF',
        description: 'Combine multiple PDF files into a single document.',
        icon: <Merge className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/merge',
      },
      {
        title: 'Split PDF',
        description: 'Extract pages from a PDF file or save each page as a separate PDF.',
        icon: <Split className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/split',
      },
      {
        title: 'Compress PDF',
        description: 'Reduce the file size of your PDF while optimizing for quality.',
        icon: <Shrink className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/compress',
      },
      {
        title: 'PDF to Word',
        description: 'Convert your PDF files to editable Word documents.',
        icon: <FileText className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/to-docx',
      },
      {
        title: 'PDF to PowerPoint',
        description: 'Convert your PDF files to editable PowerPoint presentations.',
        icon: <Presentation className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/to-pptx',
      },
       {
        title: 'HTML to PDF',
        description: 'Convert web pages to high-quality PDF files.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/html-to-pdf',
      },
      {
        title: 'PPTX to PDF',
        description: 'Convert PowerPoint presentations to PDF files.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/pptx-to-pdf',
      },
      {
        title: 'PDF to HTML',
        description: 'Convert PDF files to web-ready HTML documents.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/to-html',
      },
      {
        title: 'Web to PDF',
        description: 'Convert any webpage into a PDF file.',
        icon: <Globe className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/web-to-pdf',
      },
      {
        title: 'PDF to JPG',
        description: 'Convert each page of a PDF into a JPG image.',
        icon: <Image className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/to-jpg',
      },
      {
        title: 'PDF to PNG',
        description: 'Convert each page of a PDF into a PNG image.',
        icon: <Image className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/to-png',
      },
      {
        title: 'PDF OCR',
        description: 'Make a PDF searchable and extract text from scans.',
        icon: <ScanText className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/ocr',
      },
      {
        title: 'PDF to SVG',
        description: 'Convert PDF pages to scalable vector graphics.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/to-svg',
      },
       {
        title: 'PDF to Text',
        description: 'Extract text from your PDF files into a plain text format.',
        icon: <FileText className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/to-text',
      },
      {
        title: 'Watermark PDF',
        description: 'Add a custom text watermark to your PDF files.',
        icon: <Copyright className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/watermark',
      },
      {
        title: 'BMP to PDF',
        description: 'Convert BMP images to a single PDF file.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/image/bmp-to-pdf',
      },
      {
        title: 'DJVU to PDF',
        description: 'Convert DJVU files to PDF documents.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/djvu-to-pdf',
      },
    ],
  },
  'image-tools': {
    title: 'Image Tools',
    description: 'Easily edit, convert, and resize your images for any purpose.',
    tools: [
      {
        title: 'Image Resizer',
        description: 'Change the dimensions of your images quickly.',
        icon: <Ruler className="w-8 h-8 text-primary" />,
        href: '/tools/image/resize',
      },
      {
        title: 'Image Converter',
        description: 'Convert images to different formats like JPG, PNG, WEBP, etc.',
        icon: <Repeat className="w-8 h-8 text-primary" />,
        href: '/tools/image/convert',
      },
      {
        title: 'Image Compressor',
        description: 'Reduce the file size of your images without losing quality.',
        icon: <Shrink className="w-8 h-8 text-primary" />,
        href: '/tools/image/compress',
      },
      {
        title: 'JPG to PNG',
        description: 'Convert JPG images to PNG format with transparency support.',
        icon: <ImageIcon className="w-8 h-8 text-primary" />,
        href: '/tools/image/jpg-to-png',
      },
    ],
  },
  'calculator-tools': {
    title: 'Calculator Tools',
    description: 'A variety of calculators for your financial, health, and everyday needs.',
    tools: [
      {
        title: 'Percentage Calculator',
        description: 'Calculate percentages for various scenarios.',
        icon: <Percent className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/percentage',
      },
      {
        title: 'Word Counter',
        description: 'Count words and characters in your text.',
        icon: <CaseSensitive className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/word-counter',
      },
      {
        title: 'BMI Calculator',
        description: 'Calculate your Body Mass Index (BMI).',
        icon: <Calculator className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/bmi',
      },
      {
        title: 'Loan Calculator',
        description: 'Estimate your loan payments.',
        icon: <Calculator className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/loan',
      },
    ],
  },
};
