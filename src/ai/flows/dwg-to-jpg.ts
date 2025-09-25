
'use server';

/**
 * @fileOverview Converts an uploaded AutoCAD drawing file to JPG images using ConvertAPI.
 *
 * - dwgToJpg - A function that handles the DWG to JPG conversion.
 * - DwgToJpgInput - The input type for the dwgToJpg function.
 * - DwgToJpgOutput - The return type for the dwgToJpg function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import JSZip from 'jszip';

// ----------- Schemas -----------
const DwgToJpgInputSchema = z.object({
  drawingDataUri: z
    .string()
    .describe(
      "The AutoCAD drawing file content as a data URI. Supports .dwg, .dxf, .dwf. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original drawing file.'),
});
export type DwgToJpgInput = z.infer<typeof DwgToJpgInputSchema>;

const DwgToJpgOutputSchema = z.object({
  zipDataUri: z.string().describe('The converted JPG files as a zipped data URI.'),
  fileName: z.string().describe('The name of the output ZIP file.'),
  imageCount: z.number().describe('The number of images generated.')
});
export type DwgToJpgOutput = z.infer<typeof DwgToJpgOutputSchema>;

// ----------- Public function -----------
export async function dwgToJpg(input: DwgToJpgInput): Promise<DwgToJpgOutput> {
  return dwgToJpgFlow(input);
}

// ----------- Flow Definition -----------
const dwgToJpgFlow = ai.defineFlow(
  {
    name: 'dwgToJpgFlow',
    inputSchema: DwgToJpgInputSchema,
    outputSchema: DwgToJpgOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.drawingDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid drawing data URI.');
      }

      const drawingBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/\.[^/.]+$/, '.zip');

      const formData = new FormData();
      formData.append('File', new Blob([drawingBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/dwg/to/jpg?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting DWG to JPG:', error);
      throw new Error(
        `Failed to convert DWG to JPG. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
