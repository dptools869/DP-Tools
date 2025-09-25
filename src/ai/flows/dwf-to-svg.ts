
'use server';

/**
 * @fileOverview Converts an uploaded DWF file to an SVG file using ConvertAPI.
 *
 * - dwfToSvg - A function that handles the DWF to SVG conversion.
 * - DwfToSvgInput - The input type for the dwfToSvg function.
 * - DwfToSvgOutput - The return type for the dwfToSvg function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const DwfToSvgInputSchema = z.object({
  dwfDataUri: z
    .string()
    .describe(
      "The DWF file content as a data URI. Supports .dwf, .dwfx, .dwg, .dxf. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original DWF file.'),
});
export type DwfToSvgInput = z.infer<typeof DwfToSvgInputSchema>;

const DwfToSvgOutputSchema = z.object({
  svgDataUri: z.string().describe('The converted SVG file as a data URI.'),
  fileName: z.string().describe('The name of the output SVG file.'),
});
export type DwfToSvgOutput = z.infer<typeof DwfToSvgOutputSchema>;

// ----------- Public function -----------
export async function dwfToSvg(input: DwfToSvgInput): Promise<DwfToSvgOutput> {
  return dwfToSvgFlow(input);
}

// ----------- Flow Definition -----------
const dwfToSvgFlow = ai.defineFlow(
  {
    name: 'dwfToSvgFlow',
    inputSchema: DwfToSvgInputSchema,
    outputSchema: DwfToSvgOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.dwfDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid DWF data URI.');
      }

      const dwfBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/\.[^/.]+$/, '.svg');

      const formData = new FormData();
      formData.append('File', new Blob([dwfBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/dwf/to/svg?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting DWF to SVG:', error);
      throw new Error(
        `Failed to convert DWF to SVG. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
