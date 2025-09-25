'use server';

/**
 * @fileOverview Converts an uploaded EPUB file to a PDF file using ConvertAPI.
 *
 * - epubToPdf - A function that handles the EPUB to PDF conversion.
 * - EpubToPdfInput - The input type for the epubToPdf function.
 * - EpubToPdfOutput - The return type for the epubToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const EpubToPdfInputSchema = z.object({
  epubDataUri: z
    .string()
    .describe(
      "The EPUB file content as a data URI. Expected format: 'data:application/epub+zip;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original EPUB file.'),
});
export type EpubToPdfInput = z.infer<typeof EpubToPdfInputSchema>;

const EpubToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type EpubToPdfOutput = z.infer<typeof EpubToPdfOutputSchema>;

// ----------- Public function -----------
export async function epubToPdf(input: EpubToPdfInput): Promise<EpubToPdfOutput> {
  return epubToPdfFlow(input);
}

// ----------- Flow Definition -----------
const epubToPdfFlow = ai.defineFlow(
  {
    name: 'epubToPdfFlow',
    inputSchema: EpubToPdfInputSchema,
    outputSchema: EpubToPdfOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.epub)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([epubBuffer], { type: 'application/epub+zip' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/epub/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      
      const pdfResponse = await fetch(convertedFile.Url);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to download converted PDF file from ${convertedFile.Url}`);
      }

      const pdfArrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfArrayBuffer).toString('base64');
      const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;

      return {
        pdfDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting EPUB to PDF:', error);
      throw new Error(
        `Failed to convert EPUB to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
