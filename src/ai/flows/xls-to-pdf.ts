'use server';

/**
 * @fileOverview Converts an uploaded XLS file to a PDF file using ConvertAPI.
 *
 * - xlsToPdf - A function that handles the XLS to PDF conversion.
 * - XlsToPdfInput - The input type for the xlsToPdf function.
 * - XlsToPdfOutput - The return type for the xlsToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const XlsToPdfInputSchema = z.object({
  xlsDataUri: z
    .string()
    .describe(
      "The XLS file content as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original XLS file.'),
});
export type XlsToPdfInput = z.infer<typeof XlsToPdfInputSchema>;

const XlsToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type XlsToPdfOutput = z.infer<typeof XlsToPdfOutputSchema>;

// ----------- Public function -----------
export async function xlsToPdf(input: XlsToPdfInput): Promise<XlsToPdfOutput> {
  return xlsToPdfFlow(input);
}

// ----------- Flow Definition -----------
const xlsToPdfFlow = ai.defineFlow(
  {
    name: 'xlsToPdfFlow',
    inputSchema: XlsToPdfInputSchema,
    outputSchema: XlsToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.xlsDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid XLS data URI.');
      }

      const xlsBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.csv|\.xls|\.xlsb|\.xltx)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([xlsBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/xls/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting XLS to PDF:', error);
      throw new Error(
        `Failed to convert XLS to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
