
'use server';

/**
 * @fileOverview Converts an uploaded EPUB file to JPG images using ConvertAPI.
 *
 * - epubToJpg - A function that handles the EPUB to JPG conversion.
 * - EpubToJpgInput - The input type for the epubToJpg function.
 * - EpubToJpgOutput - The return type for the epubToJpg function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import JSZip from 'jszip';

// ----------- Schemas -----------
const EpubToJpgInputSchema = z.object({
  epubDataUri: z
    .string()
    .describe(
      "The EPUB file content as a data URI. Expected format: 'data:application/epub+zip;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original EPUB file.'),
});
export type EpubToJpgInput = z.infer<typeof EpubToJpgInputSchema>;

const EpubToJpgOutputSchema = z.object({
  zipDataUri: z.string().describe('The converted JPG files as a zipped data URI.'),
  fileName: z.string().describe('The name of the output ZIP file.'),
  imageCount: z.number().describe('The number of images generated.')
});
export type EpubToJpgOutput = z.infer<typeof EpubToJpgOutputSchema>;

// ----------- Public function -----------
export async function epubToJpg(input: EpubToJpgInput): Promise<EpubToJpgOutput> {
  return epubToJpgFlow(input);
}

// ----------- Flow Definition -----------
const epubToJpgFlow = ai.defineFlow(
  {
    name: 'epubToJpgFlow',
    inputSchema: EpubToJpgInputSchema,
    outputSchema: EpubToJpgOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.epubDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid EPUB data URI.');
      }

      const epubBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.epub)$/i, '.zip');

      const formData = new FormData();
      formData.append('File', new Blob([epubBuffer], { type: 'application/epub+zip' }), input.fileName);
      formData.append('StoreFile', 'true');

      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/epub/to/jpg?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting EPUB to JPG:', error);
      throw new Error(
        `Failed to convert EPUB to JPG. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
