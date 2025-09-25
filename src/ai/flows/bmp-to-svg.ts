
'use server';

/**
 * @fileOverview Converts an uploaded BMP file to a SVG file using ConvertAPI.
 *
 * - bmpToSvg - A function that handles the BMP to SVG conversion.
 * - BmpToSvgInput - The input type for the bmpToSvg function.
 * - BmpToSvgOutput - The return type for the bmpToSvg function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const BmpToSvgInputSchema = z.object({
  bmpDataUri: z
    .string()
    .describe(
      "The BMP file content as a data URI. Expected format: 'data:image/bmp;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original BMP file.'),
});
export type BmpToSvgInput = z.infer<typeof BmpToSvgInputSchema>;

const BmpToSvgOutputSchema = z.object({
  svgDataUri: z.string().describe('The converted SVG file as a data URI.'),
  fileName: z.string().describe('The name of the output SVG file.'),
});
export type BmpToSvgOutput = z.infer<typeof BmpToSvgOutputSchema>;

// ----------- Public function -----------
export async function bmpToSvg(input: BmpToSvgInput): Promise<BmpToSvgOutput> {
  return bmpToSvgFlow(input);
}

// ----------- Flow Definition -----------
const bmpToSvgFlow = ai.defineFlow(
  {
    name: 'bmpToSvgFlow',
    inputSchema: BmpToSvgInputSchema,
    outputSchema: BmpToSvgOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.bmp)$/i, '.svg');

      const formData = new FormData();
      formData.append('File', new Blob([bmpBuffer], { type: 'image/bmp' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/bmp/to/svg?Secret=${process.env.CONVERT_API_SECRET}`,
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
      
      const svgResponse = await fetch(convertedFile.Url);
      if (!svgResponse.ok) {
        throw new Error(`Failed to download converted SVG file from ${convertedFile.Url}`);
      }

      const svgArrayBuffer = await svgResponse.arrayBuffer();
      const svgBase64 = Buffer.from(svgArrayBuffer).toString('base64');
      const svgDataUri = `data:image/svg+xml;base64,${svgBase64}`;

      return {
        svgDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting BMP to SVG:', error);
      throw new Error(
        `Failed to convert BMP to SVG. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
