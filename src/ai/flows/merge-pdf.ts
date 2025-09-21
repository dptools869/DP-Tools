'use server';

/**
 * @fileOverview Merges multiple PDF files into a single PDF using ConvertAPI.
 *
 * - mergePdf - A function that handles the PDF merging.
 * - MergePdfInput - The input type for the mergePdf function.
 * - MergePdfOutput - The return type for the mergePdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const MergePdfInputSchema = z.object({
  pdfDataUris: z.array(z.string()).describe('An array of PDF files as data URIs.'),
  fileName: z.string().describe('The desired name for the output merged PDF file.'),
});
export type MergePdfInput = z.infer<typeof MergePdfInputSchema>;

const MergePdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The merged PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type MergePdfOutput = z.infer<typeof MergePdfOutputSchema>;


// ----------- Public function -----------
export async function mergePdf(input: MergePdfInput): Promise<MergePdfOutput> {
  return mergePdfFlow(input);
}

// ----------- Flow Definition -----------
const mergePdfFlow = ai.defineFlow(
  {
    name: 'mergePdfFlow',
    inputSchema: MergePdfInputSchema,
    outputSchema: MergePdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    if (input.pdfDataUris.length < 2) {
      throw new Error('At least two PDF files are required to merge.');
    }

    try {
      const formData = new FormData();
      formData.append('StoreFile', 'true');

      for (let i = 0; i < input.pdfDataUris.length; i++) {
        const dataUri = input.pdfDataUris[i];
        const base64Data = dataUri.split(';base64,').pop();
        if (!base64Data) {
          throw new Error(`Invalid data URI at index ${i}.`);
        }
        const pdfBuffer = Buffer.from(base64Data, 'base64');
        formData.append(`Files[${i}]`, new Blob([pdfBuffer], { type: 'application/pdf' }), `file${i}.pdf`);
      }

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/merge?Secret=${process.env.CONVERT_API_SECRET}`,
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

      const mergedFile = convertResult.Files[0];

      // Download PDF from URL
      const pdfResponse = await fetch(mergedFile.Url);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to download merged PDF file from ${mergedFile.Url}`);
      }

      const pdfArrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfArrayBuffer).toString('base64');
      const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;

      return {
        pdfDataUri,
        fileName: input.fileName,
      };
    } catch (error) {
      console.error('Error merging PDFs:', error);
      throw new Error(
        `Failed to merge PDFs. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
