
'use server';

/**
 * @fileOverview This flow is deprecated. PDF to PNG conversion is now handled on the client-side.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PdfToPngInputSchema = z.object({
  pdfDataUri: z.string(),
  fileName: z.string(),
});

const PdfToPngOutputSchema = z.object({
  zipDataUri: z.string(),
  fileName: z.string(),
  imageCount: z.number()
});

export async function pdfToPng(input: z.infer<typeof PdfToPngInputSchema>): Promise<z.infer<typeof PdfToPngOutputSchema>> {
    console.warn("The `pdfToPng` flow is deprecated and should not be used. PDF to PNG conversion is handled on the client.");
    throw new Error("This function is deprecated.");
}
