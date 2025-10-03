
'use server';

/**
 * @fileOverview Converts an uploaded DJVU file to a PDF file using ConvertAPI.
 *
 * - djvuToPdf - A function that handles the DJVU to PDF conversion.
 * - DjvuToPdfInput - The input type for the djvuToPdf function.
 * - DjvuToPdfOutput - The return type for the djvuToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const DjvuToPdfInputSchema = z.object({
  djvuDataUri: z
    .string()
    .describe(
      "The DJVU file content as a data URI. Expected format: 'data:image/vnd.djvu;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original DJVU file.'),
});
export type DjvuToPdfInput = z.infer<typeof DjvuToPdfInputSchema>;

const DjvuToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type DjvuToPdfOutput = z.infer<typeof DjvuToPdfOutputSchema>;

// ----------- Public function -----------
export async function djvuToPdf(input: DjvuToPdfInput): Promise<DjvuToPdfOutput> {
  return djvuToPdfFlow(input);
}

// ----------- Flow Definition -----------
const djvuToPdfFlow = ai.defineFlow(
  {
    name: 'djvuToPdfFlow',
    inputSchema: DjvuToPdfInputSchema,
    outputSchema: DjvuToPdfOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.djvu)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([djvuBuffer], { type: 'image/vnd.djvu' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/djvu/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting DJVU to PDF:', error);
      throw new Error(
        `Failed to convert DJVU to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
