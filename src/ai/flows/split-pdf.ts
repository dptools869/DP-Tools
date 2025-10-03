
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

const PdfFileSchema = z.object({
    fileName: z.string(),
    pdfDataUri: z.string(),
});

const SplitPdfOutputSchema = z.object({
  files: z.array(PdfFileSchema).describe('The array of split PDF files.'),
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
      
      const outputFiles = await Promise.all(
        convertResult.Files.map(async (file: { Url: string, FileName: string }) => {
          const fileResponse = await fetch(file.Url);
          if (!fileResponse.ok) {
            console.warn(`Could not download file: ${file.FileName} from ${file.Url}`);
            return null;
          }
          const fileArrayBuffer = await fileResponse.arrayBuffer();
          const fileBase64 = Buffer.from(fileArrayBuffer).toString('base64');
          const fileDataUri = `data:application/pdf;base64,${fileBase64}`;
          return {
            fileName: file.FileName,
            pdfDataUri: fileDataUri,
          };
        })
      );
      
      const successfulFiles = outputFiles.filter(Boolean) as { fileName: string, pdfDataUri: string }[];

      return {
        files: successfulFiles,
        fileCount: successfulFiles.length,
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
