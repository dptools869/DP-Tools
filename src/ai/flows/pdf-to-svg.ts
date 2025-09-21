
'use server';

/**
 * @fileOverview Converts an uploaded PDF file to SVG images using ConvertAPI.
 *
 * - pdfToSvg - A function that handles the PDF to SVG conversion.
 * - PdfToSvgInput - The input type for the pdfToSvg function.
 * - PdfToSvgOutput - The return type for the pdfToSvg function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import JSZip from 'jszip';

// ----------- Schemas -----------
const PdfToSvgInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
});
export type PdfToSvgInput = z.infer<typeof PdfToSvgInputSchema>;

const PdfToSvgOutputSchema = z.object({
  zipDataUri: z.string().describe('The converted SVG files as a zipped data URI.'),
  fileName: z.string().describe('The name of the output ZIP file.'),
  imageCount: z.number().describe('The number of images generated.')
});
export type PdfToSvgOutput = z.infer<typeof PdfToSvgOutputSchema>;

// ----------- Public function -----------
export async function pdfToSvg(input: PdfToSvgInput): Promise<PdfToSvgOutput> {
  return pdfToSvgFlow(input);
}

// ----------- Flow Definition -----------
const pdfToSvgFlow = ai.defineFlow(
  {
    name: 'pdfToSvgFlow',
    inputSchema: PdfToSvgInputSchema,
    outputSchema: PdfToSvgOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.pdfDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid PDF data URI.');
      }

      const pdfBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.pdf)$/i, '.zip');

      const formData = new FormData();
      formData.append('File', new Blob([pdfBuffer], { type: 'application/pdf' }), input.fileName);
      formData.append('StoreFile', 'true');

      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/svg?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting PDF to SVG:', error);
      throw new Error(
        `Failed to convert PDF to SVG. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
