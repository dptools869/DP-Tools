
'use server';

/**
 * @fileOverview Converts an uploaded DJVU file to JPG images using ConvertAPI.
 *
 * - djvuToJpg - A function that handles the DJVU to JPG conversion.
 * - DjvuToJpgInput - The input type for the djvuToJpg function.
 * - DjvuToJpgOutput - The return type for the djvuToJpg function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import JSZip from 'jszip';

// ----------- Schemas -----------
const DjvuToJpgInputSchema = z.object({
  djvuDataUri: z
    .string()
    .describe(
      "The DJVU file content as a data URI. Expected format: 'data:image/vnd.djvu;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original DJVU file.'),
});
export type DjvuToJpgInput = z.infer<typeof DjvuToJpgInputSchema>;

const DjvuToJpgOutputSchema = z.object({
  zipDataUri: z.string().describe('The converted JPG files as a zipped data URI.'),
  fileName: z.string().describe('The name of the output ZIP file.'),
  imageCount: z.number().describe('The number of images generated.')
});
export type DjvuToJpgOutput = z.infer<typeof DjvuToJpgOutputSchema>;

// ----------- Public function -----------
export async function djvuToJpg(input: DjvuToJpgInput): Promise<DjvuToJpgOutput> {
  return djvuToJpgFlow(input);
}

// ----------- Flow Definition -----------
const djvuToJpgFlow = ai.defineFlow(
  {
    name: 'djvuToJpgFlow',
    inputSchema: DjvuToJpgInputSchema,
    outputSchema: DjvuToJpgOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.djvuDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid DJVU data URI.');
      }

      const djvuBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.djvu)$/i, '.zip');

      const formData = new FormData();
      formData.append('File', new Blob([djvuBuffer], { type: 'image/vnd.djvu' }), input.fileName);
      formData.append('StoreFile', 'true');

      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/djvu/to/jpg?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting DJVU to JPG:', error);
      throw new Error(
        `Failed to convert DJVU to JPG. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
