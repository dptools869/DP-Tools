'use server';

/**
 * @fileOverview Converts an uploaded CSV file to a PDF file using ConvertAPI.
 *
 * - csvToPdf - A function that handles the CSV to PDF conversion.
 * - CsvToPdfInput - The input type for the csvToPdf function.
 * - CsvToPdfOutput - The return type for the csvToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const CsvToPdfInputSchema = z.object({
  csvDataUri: z
    .string()
    .describe(
      "The CSV file content as a data URI. Expected format: 'data:text/csv;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original CSV file.'),
});
export type CsvToPdfInput = z.infer<typeof CsvToPdfInputSchema>;

const CsvToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type CsvToPdfOutput = z.infer<typeof CsvToPdfOutputSchema>;

// ----------- Public function -----------
export async function csvToPdf(input: CsvToPdfInput): Promise<CsvToPdfOutput> {
  return csvToPdfFlow(input);
}

// ----------- Flow Definition -----------
const csvToPdfFlow = ai.defineFlow(
  {
    name: 'csvToPdfFlow',
    inputSchema: CsvToPdfInputSchema,
    outputSchema: CsvToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.csvDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid CSV data URI.');
      }

      const csvBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.csv)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([csvBuffer], { type: 'text/csv' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/csv/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting CSV to PDF:', error);
      throw new Error(
        `Failed to convert CSV to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
