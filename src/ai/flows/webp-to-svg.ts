
'use server';

/**
 * @fileOverview Converts an uploaded WEBP file to an SVG file using ConvertAPI.
 *
 * - webpToSvg - A function that handles the WEBP to SVG conversion.
 * - WebpToSvgInput - The input type for the webpToSvg function.
 * - WebpToSvgOutput - The return type for the webpToSvg function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const WebpToSvgInputSchema = z.object({
  webpDataUri: z
    .string()
    .describe(
      "The WEBP file content as a data URI. Expected format: 'data:image/webp;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original WEBP file.'),
});
export type WebpToSvgInput = z.infer<typeof WebpToSvgInputSchema>;

const WebpToSvgOutputSchema = z.object({
  svgDataUri: z.string().describe('The converted SVG file as a data URI.'),
  fileName: z.string().describe('The name of the output SVG file.'),
});
export type WebpToSvgOutput = z.infer<typeof WebpToSvgOutputSchema>;

// ----------- Public function -----------
export async function webpToSvg(input: WebpToSvgInput): Promise<WebpToSvgOutput> {
  return webpToSvgFlow(input);
}

// ----------- Flow Definition -----------
const webpToSvgFlow = ai.defineFlow(
  {
    name: 'webpToSvgFlow',
    inputSchema: WebpToSvgInputSchema,
    outputSchema: WebpToSvgOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.webpDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid WEBP data URI.');
      }

      const webpBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.webp)$/i, '.svg');

      const formData = new FormData();
      formData.append('File', new Blob([webpBuffer], { type: 'image/webp' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/webp/to/svg?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting WEBP to SVG:', error);
      throw new Error(
        `Failed to convert WEBP to SVG. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
