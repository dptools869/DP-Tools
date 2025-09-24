'use server';

/**
 * @fileOverview Converts an uploaded ICO file to a PDF file using ConvertAPI.
 *
 * - icoToPdf - A function that handles the ICO to PDF conversion.
 * - IcoToPdfInput - The input type for the icoToPdf function.
 * - IcoToPdfOutput - The return type for the icoToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const IcoToPdfInputSchema = z.object({
  icoDataUri: z
    .string()
    .describe(
      "The ICO file content as a data URI. Expected format: 'data:image/x-icon;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original ICO file.'),
});
export type IcoToPdfInput = z.infer<typeof IcoToPdfInputSchema>;

const IcoToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type IcoToPdfOutput = z.infer<typeof IcoToPdfOutputSchema>;

// ----------- Public function -----------
export async function icoToPdf(input: IcoToPdfInput): Promise<IcoToPdfOutput> {
  return icoToPdfFlow(input);
}

// ----------- Flow Definition -----------
const icoToPdfFlow = ai.defineFlow(
  {
    name: 'icoToPdfFlow',
    inputSchema: IcoToPdfInputSchema,
    outputSchema: IcoToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.icoDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid ICO data URI.');
      }

      const icoBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.ico)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([icoBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/ico/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting ICO to PDF:', error);
      throw new Error(
        `Failed to convert ICO to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
