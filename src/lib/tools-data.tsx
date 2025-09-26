

import { Calculator, FileText, ImageIcon, Merge, Split, Shrink, CaseSensitive, Repeat, Percent, Ruler, FileType, Image, ScanText, Presentation, Copyright, Sheet, Globe, Lock, Info, BrainCircuit, FileMinus, Mail, Landmark, HandCoins, Activity, Timer, Baby, Scale, GraduationCap, Zap, Calendar as CalendarIcon, Fuel, Thermometer, Paintbrush, Leaf, Soup, Coffee } from 'lucide-react';
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

const YarnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M15.5 15.5c-2-2-5-2.5-7.5-1.5"/>
        <path d="M20 10c-.5-5-4.5-9-9.5-9"/>
        <path d="M4 14c.5 5 4.5 9 9.5 9"/>
        <path d="M16 4.5c-3 3-6 4-8.5 3.5"/>
        <path d="M8 19.5c3-3 6-4 8.5-3.5"/>
    </svg>
)

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
        title: 'Office to PDF',
        description: 'Convert Word, Excel, and PowerPoint files to PDF.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/office-to-pdf',
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
        title: 'PDF OCR',
        description: 'Make a PDF searchable and extract text from scans.',
        icon: <ScanText className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/ocr',
      },
       {
        title: 'PDF to Text',
        description: 'Extract text from your PDF files into a plain text format.',
        icon: <FileText className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/to-text',
      },
      {
        title: 'Watermark PDF',
        description: 'Add a custom text watermark with dynamic variables.',
        icon: <Copyright className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/watermark',
      },
      {
        title: 'Rotate PDF',
        description: 'Rotate all pages in a PDF document by 90, 180, or 270 degrees.',
        icon: <Repeat className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/rotate',
      },
      {
        title: 'Protect PDF',
        description: 'Add a password to your PDF file to protect it from unauthorized access.',
        icon: <Lock className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/protect',
      },
      {
        title: 'Delete PDF Pages',
        description: 'Remove one or more pages from your PDF document.',
        icon: <FileMinus className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/delete-pages',
      },
      {
        title: 'DJVU to PDF',
        description: 'Convert DJVU files to PDF documents.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/djvu-to-pdf',
      },
      {
        title: 'EPS to PDF',
        description: 'Convert EPS vector graphics to PDF documents.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/eps-to-pdf',
      },
      {
        title: 'PUB to PDF',
        description: 'Convert Microsoft Publisher files to PDF.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/pub-to-pdf',
      },
      {
        title: 'JPG/JPEG to PDF',
        description: 'Convert JPG images to a single PDF file.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/jpg-to-pdf',
      },
      {
        title: 'PNG to PDF',
        description: 'Convert PNG images to PDF documents.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/png-to-pdf',
      },
      {
        title: 'WEBP to PDF',
        description: 'Convert WEBP images to PDF documents.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/webp-to-pdf',
      },
      {
        title: 'Text to PDF',
        description: 'Convert plain text files to PDF documents.',
        icon: <FileText className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/text-to-pdf',
      },
      {
        title: 'TIFF to PDF',
        description: 'Convert TIFF images to PDF documents.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/tiff-to-pdf',
      },
      {
        title: 'MOBI to PDF',
        description: 'Convert MOBI e-books to PDF.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/mobi-to-pdf',
      },
      {
        title: 'MSG to PDF',
        description: 'Convert MSG & EML email files to PDF.',
        icon: <Mail className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/msg-to-pdf',
      },
       {
        title: 'GIF to PDF',
        description: 'Convert GIF images to PDF documents.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/gif-to-pdf',
      },
      {
        title: 'HEIC/HEIF to PDF',
        description: 'Convert HEIC/HEIF images to PDF documents.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/heic-to-pdf',
      },
      {
        title: 'ICO to PDF',
        description: 'Convert ICO icon files to PDF documents.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/ico-to-pdf',
      },
      {
        title: 'EPUB to PDF',
        description: 'Convert EPUB e-books to PDF documents.',
        icon: <FileType className="w-8 h-8 text-primary" />,
        href: '/tools/pdf/epub-to-pdf',
      },
    ],
  },
  'image-tools': {
    title: 'Image Tools',
    description: 'Easily edit, convert, and resize your images for any purpose.',
    tools: [
      {
        title: 'PDF to JPG',
        description: 'Convert each page of a PDF into a JPG image.',
        icon: <Image className="w-8 h-8 text-primary" />,
        href: '/tools/image/pdf-to-jpg',
      },
       {
        title: 'PDF to PNG',
        description: 'Convert each page of a PDF into a PNG image.',
        icon: <Image className="w-8 h-8 text-primary" />,
        href: '/tools/image/pdf-to-png',
      },
      {
        title: 'PDF to SVG',
        description: 'Convert PDF pages to scalable vector graphics.',
        icon: <Image className="w-8 h-8 text-primary" />,
        href: '/tools/image/pdf-to-svg',
      },
      {
        title: 'BMP to JPG',
        description: 'Convert BMP images to JPG format.',
        icon: <ImageIcon className="w-8 h-8 text-primary" />,
        href: '/tools/image/bmp-to-jpg',
      },
      {
        title: 'BMP to PNG',
        description: 'Convert BMP images to PNG format.',
        icon: <ImageIcon className="w-8 h-8 text-primary" />,
        href: '/tools/image/bmp-to-png',
      },
      {
        title: 'BMP to PNM',
        description: 'Convert BMP images to PNM format.',
        icon: <ImageIcon className="w-8 h-8 text-primary" />,
        href: '/tools/image/bmp-to-pnm',
      },
      {
        title: 'BMP to SVG',
        description: 'Convert BMP images to SVG format.',
        icon: <ImageIcon className="w-8 h-8 text-primary" />,
        href: '/tools/image/bmp-to-svg',
      },
      {
        title: 'BMP to WEBP',
        description: 'Convert BMP images to WEBP format.',
        icon: <ImageIcon className="w-8 h-8 text-primary" />,
        href: '/tools/image/bmp-to-webp',
      },
       {
        title: 'DJVU to JPG',
        description: 'Convert DJVU e-books to JPG images.',
        icon: <Image className="w-8 h-8 text-primary" />,
        href: '/tools/image/djvu-to-jpg',
      },
      {
        title: 'DOC to PNG',
        description: 'Convert Word documents to PNG images.',
        icon: <Image className="w-8 h-8 text-primary" />,
        href: '/tools/image/doc-to-png',
      },
       {
        title: 'DOC to JPG',
        description: 'Convert Word documents to JPG images.',
        icon: <Image className="w-8 h-8 text-primary" />,
        href: '/tools/image/doc-to-jpg',
      },
      {
        title: 'DWF to SVG',
        description: 'Convert AutoCAD files (DWF, DWG) to SVG.',
        icon: <ImageIcon className="w-8 h-8 text-primary" />,
        href: '/tools/image/dwf-to-svg',
      },
      {
        title: 'DWF to WEBP',
        description: 'Convert AutoCAD files (DWF, DWG) to WEBP.',
        icon: <ImageIcon className="w-8 h-8 text-primary" />,
        href: '/tools/image/dwf-to-webp',
      },
      {
        title: 'DWG to JPG',
        description: 'Convert AutoCAD drawings to JPG images.',
        icon: <ImageIcon className="w-8 h-8 text-primary" />,
        href: '/tools/image/dwg-to-jpg',
      },
      {
        title: 'DWG to PNG',
        description: 'Convert AutoCAD drawings to PNG images.',
        icon: <ImageIcon className="w-8 h-8 text-primary" />,
        href: '/tools/image/dwg-to-png',
      },
      {
        title: 'EPUB to JPG',
        description: 'Convert EPUB e-books to JPG images.',
        icon: <Image className="w-8 h-8 text-primary" />,
        href: '/tools/image/epub-to-jpg',
      },
      {
        title: 'GIF to JPG',
        description: 'Convert animated GIFs to static JPG images.',
        icon: <ImageIcon className="w-8 h-8 text-primary" />,
        href: '/tools/image/gif-to-jpg',
      },
      {
        title: 'HEIC to JPG',
        description: 'Convert HEIC/HEIF images to JPG format.',
        icon: <ImageIcon className="w-8 h-8 text-primary" />,
        href: '/tools/image/heic-to-jpg',
      },
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
    title: 'Calculator & Unit Converter Tools',
    description: 'A variety of calculators and unit converters for your financial, health, and everyday needs.',
    tools: [
       {
        title: 'Age Calculator',
        description: 'Find out your exact age in years, months, and days.',
        icon: <CalendarIcon className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/age',
      },
      {
        title: 'Date Calculator',
        description: 'Calculate the duration between two dates or add/subtract time.',
        icon: <CalendarIcon className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/date',
      },
      {
        title: 'GPA Calculator',
        description: 'Calculate your Grade Point Average (GPA).',
        icon: <GraduationCap className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/gpa',
      },
       {
        title: 'Fuel Cost Calculator',
        description: 'Estimate the fuel cost for a trip.',
        icon: <Fuel className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/fuel-cost',
      },
      {
        title: 'Percentage Calculator',
        description: 'Calculate percentages for various scenarios.',
        icon: <Percent className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/percentage',
      },
      {
        title: "Ohm's Law Calculator",
        description: 'Calculate Voltage, Current, or Resistance.',
        icon: <Zap className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/ohms-law',
      },
      {
        title: 'Interest Calculator',
        description: 'Calculate simple and compound interest.',
        icon: <Landmark className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/interest',
      },
      {
        title: 'Loan Calculator',
        description: 'Estimate your loan payments.',
        icon: <Calculator className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/loan',
      },
       {
        title: 'Tip Calculator',
        description: 'Calculate tips and split the bill.',
        icon: <HandCoins className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/tip',
      },
      {
        title: 'Sales Tax Calculator',
        description: 'Calculate sales tax for a given price and rate.',
        icon: <Percent className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/sales-tax',
      },
      {
        title: 'Discount Calculator',
        description: 'Calculate final price after a discount.',
        icon: <Percent className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/discount',
      },
       {
        title: 'Hourly to Salary Converter',
        description: 'Convert your hourly wage to weekly, monthly, and annual salary.',
        icon: <Landmark className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/hourly-to-salary',
      },
      {
        title: 'Word Counter',
        description: 'Count words and characters in your text.',
        icon: <CaseSensitive className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/word-counter',
      },
       {
        title: 'Reading Speed Calculator (WPM)',
        description: 'Measure your reading speed in Words Per Minute.',
        icon: <Timer className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/reading-speed',
      },
      {
        title: 'Stitch Counter',
        description: 'A simple counter for knitting and crochet projects.',
        icon: <YarnIcon />,
        href: '/tools/calculator/stitch-counter',
      },
      {
        title: 'BMI Calculator',
        description: 'Calculate your Body Mass Index (BMI).',
        icon: <Calculator className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/bmi',
      },
      {
        title: 'BMR Calculator',
        description: 'Estimate your Basal Metabolic Rate (BMR).',
        icon: <BrainCircuit className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/bmr',
      },
      {
        title: 'Calorie Calculator',
        description: 'Estimate your daily calorie needs for maintenance, loss, or gain.',
        icon: <Activity className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/calorie',
      },
      {
        title: 'Pace Calculator',
        description: 'Calculate your running pace, time, or distance.',
        icon: <Timer className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/pace',
      },
      {
        title: 'Due Date Calculator',
        description: 'Estimate your pregnancy due date.',
        icon: <Baby className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/due-date',
      },
       {
        title: 'Paint Calculator',
        description: 'Estimate how much paint you need for your project.',
        icon: <Paintbrush className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/paint',
      },
      {
        title: 'Flooring Calculator',
        description: 'Estimate the flooring needed for a room.',
        icon: <Ruler className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/flooring',
      },
      {
        title: 'Concrete Calculator',
        description: 'Estimate the concrete needed for a slab.',
        icon: <Calculator className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/concrete',
      },
      {
        title: 'Garden Soil Calculator',
        description: 'Estimate the soil needed for your garden bed.',
        icon: <Leaf className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/garden-soil',
      },
      {
        title: 'Recipe Scaler',
        description: 'Scale recipe ingredients up or down for your needs.',
        icon: <Soup className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/recipe-scaler',
      },
      {
        title: 'Coffee to Water Ratio Calculator',
        description: 'Calculate the perfect coffee to water ratio for your brew.',
        icon: <Coffee className="w-8 h-8 text-primary" />,
        href: '/tools/calculator/coffee-ratio',
      },
      {
        title: 'Length Converter',
        description: 'Convert between meters, feet, inches, and other units of length.',
        icon: <Scale className="w-8 h-8 text-primary" />,
        href: '/tools/unit-converter/length',
      },
      {
        title: 'Weight Converter',
        description: 'Convert between kilograms, pounds, ounces, and more.',
        icon: <Scale className="w-8 h-8 text-primary" />,
        href: '/tools/unit-converter/weight',
      },
      {
        title: 'Temperature Converter',
        description: 'Convert between Celsius, Fahrenheit, and Kelvin.',
        icon: <Thermometer className="w-8 h-8 text-primary" />,
        href: '/tools/unit-converter/temperature',
      },
      {
        title: 'Cooking Measurement Converter',
        description: 'Convert between cups, tablespoons, ml, grams, and more.',
        icon: <Scale className="w-8 h-8 text-primary" />,
        href: '/tools/unit-converter/cooking',
      }
    ],
  },
};
