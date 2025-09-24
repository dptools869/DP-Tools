'use server';

/**
 * @fileOverview Deletes specified pages from a PDF file.
 *
 * - deletePdfPages - A function that handles the PDF page deletion.
 * - DeletePdfPagesInput - The input type for the deletePdfPages function.
 * - DeletePdfPagesOutput - The return type for the deletePdfPages function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const DeletePdfPagesInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
  pageRange: z.string().describe('The page range to delete (e.g., "1, 3-5, 8").'),
});
export type DeletePdfPagesInput = z.infer<typeof DeletePdfPagesInputSchema>;

const DeletePdfPagesOutputSchema = z.object({
  pdfDataUri: z.string().describe('The modified PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type DeletePdfPagesOutput = z.infer<typeof DeletePdfPagesOutputSchema>;


// ----------- Public function -----------
export async function deletePdfPages(input: DeletePdfPagesInput): Promise<DeletePdfPagesOutput> {
  return deletePdfPagesFlow(input);
}

// ----------- Flow Definition -----------
const deletePdfPagesFlow = ai.defineFlow(
  {
    name: 'deletePdfPagesFlow',
    inputSchema: DeletePdfPagesInputSchema,
    outputSchema: DeletePdfPagesOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.pdf)$/i, '-modified.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([pdfBuffer], { type: 'application/pdf' }), input.fileName);
      formData.append('PageRange', input.pageRange);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/delete-pages?Secret=${process.env.CONVERT_API_SECRET}`,
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

      const modifiedFile = convertResult.Files[0];

      // Download PDF from URL
      const pdfResponse = await fetch(modifiedFile.Url);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to download modified PDF file from ${modifiedFile.Url}`);
      }

      const pdfArrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfArrayBuffer).toString('base64');
      const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;

      return {
        pdfDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error deleting PDF pages:', error);
      throw new Error(
        `Failed to delete PDF pages. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
