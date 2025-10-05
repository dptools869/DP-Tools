
'use server';

/**
 * @fileOverview This flow is deprecated. PDF to JPG conversion is now handled on the client-side.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PdfToJpgInputSchema = z.object({
  pdfDataUri: z.string(),
  fileName: z.string(),
});

const PdfToJpgOutputSchema = z.object({
  zipDataUri: z.string(),
  fileName: z.string(),
  imageCount: z.number()
});

export async function pdfToJpg(input: z.infer<typeof PdfToJpgInputSchema>): Promise<z.infer<typeof PdfToJpgOutputSchema>> {
    console.warn("The `pdfToJpg` flow is deprecated and should not be used. PDF to JPG conversion is handled on the client.");
    throw new Error("This function is deprecated.");
}
