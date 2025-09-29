
'use server';

/**
 * @fileOverview Converts an uploaded Word document to JPG images using ConvertAPI.
 *
 * - docToJpg - A function that handles the DOC to JPG conversion.
 * - DocToJpgInput - The input type for the docToJpg function.
 * - DocToJpgOutput - The return type for the docToJpg function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import JSZip from 'jszip';

// ----------- Schemas -----------
const DocToJpgInputSchema = z.object({
  docDataUri: z
    .string()
    .describe(
      "The Word document content as a data URI. Supports .doc, .docx, .rtf, etc. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original document file.'),
});
export type DocToJpgInput = z.infer<typeof DocToJpgInputSchema>;

const DocToJpgOutputSchema = z.object({
  zipDataUri: z.string().describe('The converted JPG files as a zipped data URI.'),
  fileName: z.string().describe('The name of the output ZIP file.'),
  imageCount: z.number().describe('The number of images generated.')
});
export type DocToJpgOutput = z.infer<typeof DocToJpgOutputSchema>;

// ----------- Public function -----------
export async function docToJpg(input: DocToJpgInput): Promise<DocToJpgOutput> {
  return docToJpgFlow(input);
}

// ----------- Flow Definition -----------
const docToJpgFlow = ai.defineFlow(
  {
    name: 'docToJpgFlow',
    inputSchema: DocToJpgInputSchema,
    outputSchema: DocToJpgOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.docDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid document data URI.');
      }

      const docBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/\.[^/.]+$/, '.zip');

      const formData = new FormData();
      formData.append('File', new Blob([docBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/doc/to/jpg?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting DOC to JPG:', error);
      throw new Error(
        `Failed to convert DOC to JPG. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
