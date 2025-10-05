
'use server';

/**
 * @fileOverview This flow is deprecated. Splitting is now handled client-side.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SplitPdfInputSchema = z.object({
  pdfDataUri: z.string(),
  fileName: z.string(),
});

const SplitPdfOutputSchema = z.object({
  files: z.array(z.object({
    fileName: z.string(),
    pdfDataUri: z.string(),
  })),
  fileCount: z.number(),
});

export async function splitPdf(input: z.infer<typeof SplitPdfInputSchema>): Promise<z.infer<typeof SplitPdfOutputSchema>> {
    console.warn("The `splitPdf` flow is deprecated and should not be used. PDF splitting is handled on the client.");
    throw new Error("This function is deprecated.");
}
