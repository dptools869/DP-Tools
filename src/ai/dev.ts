import { config } from 'dotenv';
config();

import '@/ai/flows/recommend-relevant-youtube-videos.ts';
import '@/ai/flows/html-to-pdf.ts';
import '@/ai/flows/compress-pdf.ts';
import '@/ai/flows/pdf-to-docx.ts';
import '@/ai/flows/pdf-to-html.ts';
import '@/ai/flows/pdf-to-jpg.ts';
import '@/ai/flows/merge-pdf.ts';
import '@/ai/flows/pdf-ocr.ts';
