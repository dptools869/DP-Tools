'use server';

/**
 * @fileOverview Converts an uploaded DOT file to a PDF file using ConvertAPI.
 *
 * - dotToPdf - A function that handles the DOT to PDF conversion.
 * - DotToPdfInput - The input type for the dotToPdf function.
 * - DotToPdfOutput - The return type for the dotToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const DotToPdfInputSchema = z.object({
  dotDataUri: z
    .string()
    .describe(
      "The DOT file content as a data URI. Supports .dot and .dotx formats. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original DOT file.'),
});
export type DotToPdfInput = z.infer<typeof DotToPdfInputSchema>;

const DotToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type DotToPdfOutput = z.infer<typeof DotToPdfOutputSchema>;

// ----------- Public function -----------
export async function dotToPdf(input: DotToPdfInput): Promise<DotToPdfOutput> {
  return dotToPdfFlow(input);
}

// ----------- Flow Definition -----------
const dotToPdfFlow = ai.defineFlow(
  {
    name: 'dotToPdfFlow',
    inputSchema: DotToPdfInputSchema,
    outputSchema: DotToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.dotDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid DOT data URI.');
      }

      const dotBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.dot|\.dotx)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([dotBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/dot/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting DOT to PDF:', error);
      throw new Error(
        `Failed to convert DOT to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
