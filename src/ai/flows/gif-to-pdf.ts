
'use server';

/**
 * @fileOverview Converts an uploaded GIF file to a PDF file using ConvertAPI.
 *
 * - gifToPdf - A function that handles the GIF to PDF conversion.
 * - GifToPdfInput - The input type for the gifToPdf function.
 * - GifToPdfOutput - The return type for the gifToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const GifToPdfInputSchema = z.object({
  gifDataUri: z
    .string()
    .describe(
      "The GIF file content as a data URI. Expected format: 'data:image/gif;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original GIF file.'),
});
export type GifToPdfInput = z.infer<typeof GifToPdfInputSchema>;

const GifToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type GifToPdfOutput = z.infer<typeof GifToPdfOutputSchema>;

// ----------- Public function -----------
export async function gifToPdf(input: GifToPdfInput): Promise<GifToPdfOutput> {
  return gifToPdfFlow(input);
}

// ----------- Flow Definition -----------
const gifToPdfFlow = ai.defineFlow(
  {
    name: 'gifToPdfFlow',
    inputSchema: GifToPdfInputSchema,
    outputSchema: GifToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.gifDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid GIF data URI.');
      }

      const gifBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.gif)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([gifBuffer], { type: 'image/gif' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/gif/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting GIF to PDF:', error);
      throw new Error(
        `Failed to convert GIF to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
