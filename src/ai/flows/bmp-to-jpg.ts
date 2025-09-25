
'use server';

/**
 * @fileOverview Converts an uploaded BMP file to a JPG file using ConvertAPI.
 *
 * - bmpToJpg - A function that handles the BMP to JPG conversion.
 * - BmpToJpgInput - The input type for the bmpToJpg function.
 * - BmpToJpgOutput - The return type for the bmpToJpg function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const BmpToJpgInputSchema = z.object({
  bmpDataUri: z
    .string()
    .describe(
      "The BMP file content as a data URI. Expected format: 'data:image/bmp;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original BMP file.'),
});
export type BmpToJpgInput = z.infer<typeof BmpToJpgInputSchema>;

const BmpToJpgOutputSchema = z.object({
  jpgDataUri: z.string().describe('The converted JPG file as a data URI.'),
  fileName: z.string().describe('The name of the output JPG file.'),
});
export type BmpToJpgOutput = z.infer<typeof BmpToJpgOutputSchema>;

// ----------- Public function -----------
export async function bmpToJpg(input: BmpToJpgInput): Promise<BmpToJpgOutput> {
  return bmpToJpgFlow(input);
}

// ----------- Flow Definition -----------
const bmpToJpgFlow = ai.defineFlow(
  {
    name: 'bmpToJpgFlow',
    inputSchema: BmpToJpgInputSchema,
    outputSchema: BmpToJpgOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.bmp)$/i, '.jpg');

      const formData = new FormData();
      formData.append('File', new Blob([bmpBuffer], { type: 'image/bmp' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/bmp/to/jpg?Secret=${process.env.CONVERT_API_SECRET}`,
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
      
      const jpgResponse = await fetch(convertedFile.Url);
      if (!jpgResponse.ok) {
        throw new Error(`Failed to download converted JPG file from ${convertedFile.Url}`);
      }

      const jpgArrayBuffer = await jpgResponse.arrayBuffer();
      const jpgBase64 = Buffer.from(jpgArrayBuffer).toString('base64');
      const jpgDataUri = `data:image/jpeg;base64,${jpgBase64}`;

      return {
        jpgDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting BMP to JPG:', error);
      throw new Error(
        `Failed to convert BMP to JPG. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
