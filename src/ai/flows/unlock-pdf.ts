
'use server';

/**
 * @fileOverview Unlocks a password-protected PDF file using ConvertAPI.
 *
 * - unlockPdf - A function that handles the PDF unlocking process.
 * - UnlockPdfInput - The input type for the unlockPdf function.
 * - UnlockPdfOutput - The return type for the unlockPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const UnlockPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
  password: z.string().describe('The password to unlock the PDF.'),
});
export type UnlockPdfInput = z.infer<typeof UnlockPdfInputSchema>;

const UnlockPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The unlocked PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type UnlockPdfOutput = z.infer<typeof UnlockPdfOutputSchema>;


// ----------- Public function -----------
export async function unlockPdf(input: UnlockPdfInput): Promise<UnlockPdfOutput> {
  return unlockPdfFlow(input);
}

// ----------- Flow Definition -----------
const unlockPdfFlow = ai.defineFlow(
  {
    name: 'unlockPdfFlow',
    inputSchema: UnlockPdfInputSchema,
    outputSchema: UnlockPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.pdfDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid PDF data URI.');
      }
      const pdfBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.pdf)$/i, '-unlocked.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([pdfBuffer], { type: 'application/pdf' }), input.fileName);
      formData.append('Password', input.password);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/unprotect?Secret=${process.env.CONVERT_API_SECRET}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!convertResponse.ok) {
        const errorText = await convertResponse.text();
        throw new Error(`ConvertAPI Error: ${convertResponse.status} ${errorText}`);
      }

      const convertResult = await convertResponse.json();

      if (!convertResult.Files || convertResult.Files.length === 0) {
        throw new Error('Conversion result did not contain any files.');
      }

      const unlockedFile = convertResult.Files[0];

      // Download PDF from URL
      const pdfResponse = await fetch(unlockedFile.Url);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to download unlocked PDF file from ${unlockedFile.Url}`);
      }

      const pdfArrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfArrayBuffer).toString('base64');
      const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;

      return {
        pdfDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error unlocking PDF:', error);
      throw new Error(
        `Failed to unlock PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
