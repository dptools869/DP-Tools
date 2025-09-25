
'use server';

/**
 * @fileOverview Converts an uploaded DWF file to WEBP images using ConvertAPI.
 *
 * - dwfToWebp - A function that handles the DWF to WEBP conversion.
 * - DwfToWebpInput - The input type for the dwfToWebp function.
 * - DwfToWebpOutput - The return type for the dwfToWebp function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import JSZip from 'jszip';

// ----------- Schemas -----------
const DwfToWebpInputSchema = z.object({
  dwfDataUri: z
    .string()
    .describe(
      "The DWF file content as a data URI. Supports .dwf, .dwfx, .dwg, .dxf. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original DWF file.'),
});
export type DwfToWebpInput = z.infer<typeof DwfToWebpInputSchema>;

const DwfToWebpOutputSchema = z.object({
  zipDataUri: z.string().describe('The converted WEBP files as a zipped data URI.'),
  fileName: z.string().describe('The name of the output ZIP file.'),
  imageCount: z.number().describe('The number of images generated.')
});
export type DwfToWebpOutput = z.infer<typeof DwfToWebpOutputSchema>;

// ----------- Public function -----------
export async function dwfToWebp(input: DwfToWebpInput): Promise<DwfToWebpOutput> {
  return dwfToWebpFlow(input);
}

// ----------- Flow Definition -----------
const dwfToWebpFlow = ai.defineFlow(
  {
    name: 'dwfToWebpFlow',
    inputSchema: DwfToWebpInputSchema,
    outputSchema: DwfToWebpOutputSchema,
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
      const outputFileName = input.fileName.replace(/\.[^/.]+$/, '.zip');

      const formData = new FormData();
      formData.append('File', new Blob([dwfBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/dwf/to/webp?Secret=${process.env.CONVERT_API_SECRET}`,
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
      
      const zip = new JSZip();

      for (const file of convertResult.Files) {
        const imageUrl = file.Url;
        const imageName = file.FileName;
        
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            console.warn(`Could not download image: ${imageName} from ${imageUrl}`);
            continue;
        }
        const imageArrayBuffer = await imageResponse.arrayBuffer();
        zip.file(imageName, imageArrayBuffer);
      }

      const zipBuffer = await zip.generateAsync({type:"nodebuffer"});
      const zipBase64 = zipBuffer.toString('base64');
      const zipDataUri = `data:application/zip;base64,${zipBase64}`;

      return {
        zipDataUri,
        fileName: outputFileName,
        imageCount: convertResult.Files.length
      };
    } catch (error) {
      console.error('Error converting DWF to WEBP:', error);
      throw new Error(
        `Failed to convert DWF to WEBP. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
