
'use server';

/**
 * @fileOverview Converts an uploaded BMP file to a WEBP file using ConvertAPI.
 *
 * - bmpToWebp - A function that handles the BMP to WEBP conversion.
 * - BmpToWebpInput - The input type for the bmpToWebp function.
 * - BmpToWebpOutput - The return type for the bmpToWebp function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const BmpToWebpInputSchema = z.object({
  bmpDataUri: z
    .string()
    .describe(
      "The BMP file content as a data URI. Expected format: 'data:image/bmp;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original BMP file.'),
});
export type BmpToWebpInput = z.infer<typeof BmpToWebpInputSchema>;

const BmpToWebpOutputSchema = z.object({
  webpDataUri: z.string().describe('The converted WEBP file as a data URI.'),
  fileName: z.string().describe('The name of the output WEBP file.'),
});
export type BmpToWebpOutput = z.infer<typeof BmpToWebpOutputSchema>;

// ----------- Public function -----------
export async function bmpToWebp(input: BmpToWebpInput): Promise<BmpToWebpOutput> {
  return bmpToWebpFlow(input);
}

// ----------- Flow Definition -----------
const bmpToWebpFlow = ai.defineFlow(
  {
    name: 'bmpToWebpFlow',
    inputSchema: BmpToWebpInputSchema,
    outputSchema: BmpToWebpOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.bmp)$/i, '.webp');

      const formData = new FormData();
      formData.append('File', new Blob([bmpBuffer], { type: 'image/bmp' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/bmp/to/webp?Secret=${process.env.CONVERT_API_SECRET}`,
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
      
      const webpResponse = await fetch(convertedFile.Url);
      if (!webpResponse.ok) {
        throw new Error(`Failed to download converted WEBP file from ${convertedFile.Url}`);
      }

      const webpArrayBuffer = await webpResponse.arrayBuffer();
      const webpBase64 = Buffer.from(webpArrayBuffer).toString('base64');
      const webpDataUri = `data:image/webp;base64,${webpBase64}`;

      return {
        webpDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting BMP to WEBP:', error);
      throw new Error(
        `Failed to convert BMP to WEBP. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
