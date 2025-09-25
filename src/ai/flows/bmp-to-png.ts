
'use server';

/**
 * @fileOverview Converts an uploaded BMP file to a PNG file using ConvertAPI.
 *
 * - bmpToPng - A function that handles the BMP to PNG conversion.
 * - BmpToPngInput - The input type for the bmpToPng function.
 * - BmpToPngOutput - The return type for the bmpToPng function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const BmpToPngInputSchema = z.object({
  bmpDataUri: z
    .string()
    .describe(
      "The BMP file content as a data URI. Expected format: 'data:image/bmp;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original BMP file.'),
});
export type BmpToPngInput = z.infer<typeof BmpToPngInputSchema>;

const BmpToPngOutputSchema = z.object({
  pngDataUri: z.string().describe('The converted PNG file as a data URI.'),
  fileName: z.string().describe('The name of the output PNG file.'),
});
export type BmpToPngOutput = z.infer<typeof BmpToPngOutputSchema>;

// ----------- Public function -----------
export async function bmpToPng(input: BmpToPngInput): Promise<BmpToPngOutput> {
  return bmpToPngFlow(input);
}

// ----------- Flow Definition -----------
const bmpToPngFlow = ai.defineFlow(
  {
    name: 'bmpToPngFlow',
    inputSchema: BmpToPngInputSchema,
    outputSchema: BmpToPngOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.bmpDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid BMP data URI.');
      }

      const bmpBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.bmp)$/i, '.png');

      const formData = new FormData();
      formData.append('File', new Blob([bmpBuffer], { type: 'image/bmp' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/bmp/to/png?Secret=${process.env.CONVERT_API_SECRET}`,
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
      
      const pngResponse = await fetch(convertedFile.Url);
      if (!pngResponse.ok) {
        throw new Error(`Failed to download converted PNG file from ${convertedFile.Url}`);
      }

      const pngArrayBuffer = await pngResponse.arrayBuffer();
      const pngBase64 = Buffer.from(pngArrayBuffer).toString('base64');
      const pngDataUri = `data:image/png;base64,${pngBase64}`;

      return {
        pngDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting BMP to PNG:', error);
      throw new Error(
        `Failed to convert BMP to PNG. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
