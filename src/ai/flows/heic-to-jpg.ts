
'use server';

/**
 * @fileOverview Converts an uploaded HEIC/HEIF file to a JPG file using ConvertAPI.
 *
 * - heicToJpg - A function that handles the HEIC to JPG conversion.
 * - HeicToJpgInput - The input type for the heicToJpg function.
 * - HeicToJpgOutput - The return type for the heicToJpg function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const HeicToJpgInputSchema = z.object({
  heicDataUri: z
    .string()
    .describe(
      "The HEIC file content as a data URI. Supports .heic and .heif formats. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original HEIC file.'),
});
export type HeicToJpgInput = z.infer<typeof HeicToJpgInputSchema>;

const HeicToJpgOutputSchema = z.object({
  jpgDataUri: z.string().describe('The converted JPG file as a data URI.'),
  fileName: z.string().describe('The name of the output JPG file.'),
});
export type HeicToJpgOutput = z.infer<typeof HeicToJpgOutputSchema>;

// ----------- Public function -----------
export async function heicToJpg(input: HeicToJpgInput): Promise<HeicToJpgOutput> {
  return heicToJpgFlow(input);
}

// ----------- Flow Definition -----------
const heicToJpgFlow = ai.defineFlow(
  {
    name: 'heicToJpgFlow',
    inputSchema: HeicToJpgInputSchema,
    outputSchema: HeicToJpgOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.heic|\.heif)$/i, '.jpg');

      const formData = new FormData();
      formData.append('File', new Blob([heicBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/heic/to/jpg?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting HEIC to JPG:', error);
      throw new Error(
        `Failed to convert HEIC to JPG. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
