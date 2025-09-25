
'use server';

/**
 * @fileOverview Converts an uploaded BMP file to a PNM file using ConvertAPI.
 *
 * - bmpToPnm - A function that handles the BMP to PNM conversion.
 * - BmpToPnmInput - The input type for the bmpToPnm function.
 * - BmpToPnmOutput - The return type for the bmpToPnm function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const BmpToPnmInputSchema = z.object({
  bmpDataUri: z
    .string()
    .describe(
      "The BMP file content as a data URI. Expected format: 'data:image/bmp;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original BMP file.'),
});
export type BmpToPnmInput = z.infer<typeof BmpToPnmInputSchema>;

const BmpToPnmOutputSchema = z.object({
  pnmDataUri: z.string().describe('The converted PNM file as a data URI.'),
  fileName: z.string().describe('The name of the output PNM file.'),
});
export type BmpToPnmOutput = z.infer<typeof BmpToPnmOutputSchema>;

// ----------- Public function -----------
export async function bmpToPnm(input: BmpToPnmInput): Promise<BmpToPnmOutput> {
  return bmpToPnmFlow(input);
}

// ----------- Flow Definition -----------
const bmpToPnmFlow = ai.defineFlow(
  {
    name: 'bmpToPnmFlow',
    inputSchema: BmpToPnmInputSchema,
    outputSchema: BmpToPnmOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.bmp)$/i, '.pnm');

      const formData = new FormData();
      formData.append('File', new Blob([bmpBuffer], { type: 'image/bmp' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/bmp/to/pnm?Secret=${process.env.CONVERT_API_SECRET}`,
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
      
      const pnmResponse = await fetch(convertedFile.Url);
      if (!pnmResponse.ok) {
        throw new Error(`Failed to download converted PNM file from ${convertedFile.Url}`);
      }

      const pnmArrayBuffer = await pnmResponse.arrayBuffer();
      const pnmBase64 = Buffer.from(pnmArrayBuffer).toString('base64');
      const pnmDataUri = `data:image/x-portable-anymap;base64,${pnmBase64}`;

      return {
        pnmDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting BMP to PNM:', error);
      throw new Error(
        `Failed to convert BMP to PNM. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
