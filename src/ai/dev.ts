import { config } from 'dotenv';
config();

import '@/ai/flows/recommend-relevant-youtube-videos.ts';
import '@/ai/flows/html-to-pdf.ts';
import '@/ai/flows/compress-pdf.ts';
import '@/ai/flows/pdf-to-docx.ts';
import '@/ai/flows/pdf-to-html.ts';
