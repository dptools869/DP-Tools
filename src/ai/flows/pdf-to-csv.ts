'use server';

/**
 * @fileOverview Converts an uploaded PDF file to a CSV file using ConvertAPI.
 *
 * - pdfToCsv - A function that handles the PDF to CSV conversion.
 * - PdfToCsvInput - The input type for the pdfToCsv function.
 * - PdfToCsvOutput - The return type for the pdfToCsv function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const PdfToCsvInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
});
export type PdfToCsvInput = z.infer<typeof PdfToCsvInputSchema>;

const PdfToCsvOutputSchema = z.object({
  csvDataUri: z.string().describe('The converted CSV file as a data URI.'),
  fileName: z.string().describe('The name of the output CSV file.'),
});
export type PdfToCsvOutput = z.infer<typeof PdfToCsvOutputSchema>;

// ----------- Public function -----------
export async function pdfToCsv(input: PdfToCsvInput): Promise<PdfToCsvOutput> {
  return pdfToCsvFlow(input);
}

// ----------- Flow Definition -----------
const pdfToCsvFlow = ai.defineFlow(
  {
    name: 'pdfToCsvFlow',
    inputSchema: PdfToCsvInputSchema,
    outputSchema: PdfToCsvOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.pdf)$/i, '.csv');

      const formData = new FormData();
      formData.append('File', new Blob([pdfBuffer], { type: 'application/pdf' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/csv?Secret=${process.env.CONVERT_API_SECRET}`,
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
      
      const csvResponse = await fetch(convertedFile.Url);
      if (!csvResponse.ok) {
        throw new Error(`Failed to download converted CSV file from ${convertedFile.Url}`);
      }

      const csvArrayBuffer = await csvResponse.arrayBuffer();
      const csvBase64 = Buffer.from(csvArrayBuffer).toString('base64');
      const csvDataUri = `data:text/csv;base64,${csvBase64}`;

      return {
        csvDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting PDF to CSV:', error);
      throw new Error(
        `Failed to convert PDF to CSV. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
