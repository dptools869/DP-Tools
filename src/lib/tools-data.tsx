import { Calculator, FileText, ImageIcon, Merge, Split, Shrink, CaseSensitive, Repeat, Percent, Ruler, FileType } from 'lucide-react';
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
        title: 'HTML to PDF',
        description: 'Convert web pages to high-quality PDF files.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/html-to-pdf',
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
