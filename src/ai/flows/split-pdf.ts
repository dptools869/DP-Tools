'use server';

/**
 * @fileOverview Splits a PDF into multiple files.
 *
 * - splitPdf - A function that handles the PDF splitting.
 * - SplitPdfInput - The input type for the splitPdf function.
 * - SplitPdfOutput - The return type for the splitPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import JSZip from 'jszip';

// ----------- Schemas -----------
const SplitPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
});
export type SplitPdfInput = z.infer<typeof SplitPdfInputSchema>;

const SplitPdfOutputSchema = z.object({
  zipDataUri: z.string().describe('The split PDF files as a zipped data URI.'),
  fileName: z.string().describe('The name of the output ZIP file.'),
  fileCount: z.number().describe('The number of files generated.')
});
export type SplitPdfOutput = z.infer<typeof SplitPdfOutputSchema>;

// ----------- Public function -----------
export async function splitPdf(input: SplitPdfInput): Promise<SplitPdfOutput> {
  return splitPdfFlow(input);
}

// ----------- Flow Definition -----------
const splitPdfFlow = ai.defineFlow(
  {
    name: 'splitPdfFlow',
    inputSchema: SplitPdfInputSchema,
    outputSchema: SplitPdfOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.pdf)$/i, '-split.zip');

      const formData = new FormData();
      formData.append('File', new Blob([pdfBuffer], { type: 'application/pdf' }), input.fileName);
      formData.append('StoreFile', 'true');

      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/split?Secret=${process.env.CONVERT_API_SECRET}`,
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
        const fileUrl = file.Url;
        const fileName = file.FileName;
        
        const fileResponse = await fetch(fileUrl);
        if (!fileResponse.ok) {
            console.warn(`Could not download file: ${fileName} from ${fileUrl}`);
            continue;
        }
        const fileArrayBuffer = await fileResponse.arrayBuffer();
        zip.file(fileName, fileArrayBuffer);
      }

      const zipBuffer = await zip.generateAsync({type:"nodebuffer"});
      const zipBase64 = zipBuffer.toString('base64');
      const zipDataUri = `data:application/zip;base64,${zipBase64}`;

      return {
        zipDataUri,
        fileName: outputFileName,
        fileCount: convertResult.Files.length
      };
    } catch (error) {
      console.error('Error splitting PDF:', error);
      throw new Error(
        `Failed to split PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
