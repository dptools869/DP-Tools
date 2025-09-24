'use server';

/**
 * @fileOverview Converts an uploaded PNG file to a PDF file using ConvertAPI.
 *
 * - pngToPdf - A function that handles the PNG to PDF conversion.
 * - PngToPdfInput - The input type for the pngToPdf function.
 * - PngToPdfOutput - The return type for the pngToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const PngToPdfInputSchema = z.object({
  pngDataUri: z
    .string()
    .describe(
      "The PNG file content as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PNG file.'),
});
export type PngToPdfInput = z.infer<typeof PngToPdfInputSchema>;

const PngToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type PngToPdfOutput = z.infer<typeof PngToPdfOutputSchema>;

// ----------- Public function -----------
export async function pngToPdf(input: PngToPdfInput): Promise<PngToPdfOutput> {
  return pngToPdfFlow(input);
}

// ----------- Flow Definition -----------
const pngToPdfFlow = ai.defineFlow(
  {
    name: 'pngToPdfFlow',
    inputSchema: PngToPdfInputSchema,
    outputSchema: PngToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.pngDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid PNG data URI.');
      }

      const pngBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.png)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([pngBuffer], { type: 'image/png' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/png/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting PNG to PDF:', error);
      throw new Error(
        `Failed to convert PNG to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
