'use server';

/**
 * @fileOverview Converts an uploaded PS (PostScript) file to a PDF file using ConvertAPI.
 *
 * - psToPdf - A function that handles the PS to PDF conversion.
 * - PsToPdfInput - The input type for the psToPdf function.
 * - PsToPdfOutput - The return type for the psToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const PsToPdfInputSchema = z.object({
  psDataUri: z
    .string()
    .describe(
      "The PS file content as a data URI. Expected format: 'data:application/postscript;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PS file.'),
});
export type PsToPdfInput = z.infer<typeof PsToPdfInputSchema>;

const PsToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type PsToPdfOutput = z.infer<typeof PsToPdfOutputSchema>;

// ----------- Public function -----------
export async function psToPdf(input: PsToPdfInput): Promise<PsToPdfOutput> {
  return psToPdfFlow(input);
}

// ----------- Flow Definition -----------
const psToPdfFlow = ai.defineFlow(
  {
    name: 'psToPdfFlow',
    inputSchema: PsToPdfInputSchema,
    outputSchema: PsToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.psDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid PS data URI.');
      }

      const psBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.ps)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([psBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/ps/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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

      const convertedFile = convertResult.Files[0];
      
      const pdfResponse = await fetch(convertedFile.Url);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to download converted PDF file from ${convertedFile.Url}`);
      }

      const pdfArrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfArrayBuffer).toString('base64');
      const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;

      return {
        pdfDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting PS to PDF:', error);
      throw new Error(
        `Failed to convert PS to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
