'use server';

/**
 * @fileOverview Converts an uploaded LOG file to a PDF file using ConvertAPI.
 *
 * - logToPdf - A function that handles the LOG to PDF conversion.
 * - LogToPdfInput - The input type for the logToPdf function.
 * - LogToPdfOutput - The return type for the logToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const LogToPdfInputSchema = z.object({
  logDataUri: z
    .string()
    .describe(
      "The LOG file content as a data URI. Expected format: 'data:text/plain;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original LOG file.'),
});
export type LogToPdfInput = z.infer<typeof LogToPdfInputSchema>;

const LogToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type LogToPdfOutput = z.infer<typeof LogToPdfOutputSchema>;

// ----------- Public function -----------
export async function logToPdf(input: LogToPdfInput): Promise<LogToPdfOutput> {
  return logToPdfFlow(input);
}

// ----------- Flow Definition -----------
const logToPdfFlow = ai.defineFlow(
  {
    name: 'logToPdfFlow',
    inputSchema: LogToPdfInputSchema,
    outputSchema: LogToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.logDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid LOG data URI.');
      }

      const logBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.log)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([logBuffer], { type: 'text/plain' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/log/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting LOG to PDF:', error);
      throw new Error(
        `Failed to convert LOG to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
