
'use server';

/**
 * @fileOverview Converts an uploaded PDF file to PNG images using ConvertAPI.
 *
 * - pdfToPng - A function that handles the PDF to PNG conversion.
 * - PdfToPngInput - The input type for the pdfToPng function.
 * - PdfToPngOutput - The return type for the pdfToPng function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import JSZip from 'jszip';

// ----------- Schemas -----------
const PdfToPngInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
});
export type PdfToPngInput = z.infer<typeof PdfToPngInputSchema>;

const PdfToPngOutputSchema = z.object({
  zipDataUri: z.string().describe('The converted PNG files as a zipped data URI.'),
  fileName: z.string().describe('The name of the output ZIP file.'),
  imageCount: z.number().describe('The number of images generated.')
});
export type PdfToPngOutput = z.infer<typeof PdfToPngOutputSchema>;

// ----------- Public function -----------
export async function pdfToPng(input: PdfToPngInput): Promise<PdfToPngOutput> {
  return pdfToPngFlow(input);
}

// ----------- Flow Definition -----------
const pdfToPngFlow = ai.defineFlow(
  {
    name: 'pdfToPngFlow',
    inputSchema: PdfToPngInputSchema,
    outputSchema: PdfToPngOutputSchema,
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
        `https://v2.convertapi.com/convert/pdf/to/png?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting PDF to PNG:', error);
      throw new Error(
        `Failed to convert PDF to PNG. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
