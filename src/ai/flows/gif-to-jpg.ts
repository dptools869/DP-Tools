
'use server';

/**
 * @fileOverview Converts an uploaded GIF file to a JPG file using ConvertAPI.
 *
 * - gifToJpg - A function that handles the GIF to JPG conversion.
 * - GifToJpgInput - The input type for the gifToJpg function.
 * - GifToJpgOutput - The return type for the gifToJpg function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const GifToJpgInputSchema = z.object({
  gifDataUri: z
    .string()
    .describe(
      "The GIF file content as a data URI. Expected format: 'data:image/gif;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original GIF file.'),
});
export type GifToJpgInput = z.infer<typeof GifToJpgInputSchema>;

const GifToJpgOutputSchema = z.object({
  jpgDataUri: z.string().describe('The converted JPG file as a data URI.'),
  fileName: z.string().describe('The name of the output JPG file.'),
});
export type GifToJpgOutput = z.infer<typeof GifToJpgOutputSchema>;

// ----------- Public function -----------
export async function gifToJpg(input: GifToJpgInput): Promise<GifToJpgOutput> {
  return gifToJpgFlow(input);
}

// ----------- Flow Definition -----------
const gifToJpgFlow = ai.defineFlow(
  {
    name: 'gifToJpgFlow',
    inputSchema: GifToJpgInputSchema,
    outputSchema: GifToJpgOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.gif)$/i, '.jpg');

      const formData = new FormData();
      formData.append('File', new Blob([gifBuffer], { type: 'image/gif' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/gif/to/jpg?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting GIF to JPG:', error);
      throw new Error(
        `Failed to convert GIF to JPG. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
