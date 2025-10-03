
'use server';

/**
 * @fileOverview Converts an uploaded HEIC file to a PDF file using ConvertAPI.
 *
 * - heicToPdf - A function that handles the HEIC to PDF conversion.
 * - HeicToPdfInput - The input type for the heicToPdf function.
 * - HeicToPdfOutput - The return type for the heicToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const HeicToPdfInputSchema = z.object({
  heicDataUri: z
    .string()
    .describe(
      "The HEIC file content as a data URI. Supports .heic and .heif formats. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original HEIC file.'),
});
export type HeicToPdfInput = z.infer<typeof HeicToPdfInputSchema>;

const HeicToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type HeicToPdfOutput = z.infer<typeof HeicToPdfOutputSchema>;

// ----------- Public function -----------
export async function heicToPdf(input: HeicToPdfInput): Promise<HeicToPdfOutput> {
  return heicToPdfFlow(input);
}

// ----------- Flow Definition -----------
const heicToPdfFlow = ai.defineFlow(
  {
    name: 'heicToPdfFlow',
    inputSchema: HeicToPdfInputSchema,
    outputSchema: HeicToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.heicDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid HEIC data URI.');
      }

      const heicBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.heic|\.heif)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([heicBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/heic/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting HEIC to PDF:', error);
      throw new Error(
        `Failed to convert HEIC to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
