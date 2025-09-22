'use server';

/**
 * @fileOverview Converts an uploaded XLTX file to a PDF file using ConvertAPI.
 *
 * - xltxToPdf - A function that handles the XLTX to PDF conversion.
 * - XltxToPdfInput - The input type for the xltxToPdf function.
 * - XltxToPdfOutput - The return type for the xltxToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const XltxToPdfInputSchema = z.object({
  xltxDataUri: z
    .string()
    .describe(
      "The XLTX file content as a data URI. Supports .csv, .xls, .xlsb, .xltx formats. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original XLTX file.'),
});
export type XltxToPdfInput = z.infer<typeof XltxToPdfInputSchema>;

const XltxToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type XltxToPdfOutput = z.infer<typeof XltxToPdfOutputSchema>;

// ----------- Public function -----------
export async function xltxToPdf(input: XltxToPdfInput): Promise<XltxToPdfOutput> {
  return xltxToPdfFlow(input);
}

// ----------- Flow Definition -----------
const xltxToPdfFlow = ai.defineFlow(
  {
    name: 'xltxToPdfFlow',
    inputSchema: XltxToPdfInputSchema,
    outputSchema: XltxToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.xltxDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid XLTX data URI.');
      }

      const xltxBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.csv|\.xls|\.xlsb|\.xltx)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([xltxBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/xltx/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting XLTX to PDF:', error);
      throw new Error(
        `Failed to convert XLTX to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
