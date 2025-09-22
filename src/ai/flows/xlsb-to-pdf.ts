'use server';

/**
 * @fileOverview Converts an uploaded XLSB file to a PDF file using ConvertAPI.
 *
 * - xlsbToPdf - A function that handles the XLSB to PDF conversion.
 * - XlsbToPdfInput - The input type for the xlsbToPdf function.
 * - XlsbToPdfOutput - The return type for the xlsbToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const XlsbToPdfInputSchema = z.object({
  xlsbDataUri: z
    .string()
    .describe(
      "The XLSB file content as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original XLSB file.'),
});
export type XlsbToPdfInput = z.infer<typeof XlsbToPdfInputSchema>;

const XlsbToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type XlsbToPdfOutput = z.infer<typeof XlsbToPdfOutputSchema>;

// ----------- Public function -----------
export async function xlsbToPdf(input: XlsbToPdfInput): Promise<XlsbToPdfOutput> {
  return xlsbToPdfFlow(input);
}

// ----------- Flow Definition -----------
const xlsbToPdfFlow = ai.defineFlow(
  {
    name: 'xlsbToPdfFlow',
    inputSchema: XlsbToPdfInputSchema,
    outputSchema: XlsbToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.xlsbDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid XLSB data URI.');
      }

      const xlsbBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.xlsb)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([xlsbBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/xlsb/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting XLSB to PDF:', error);
      throw new Error(
        `Failed to convert XLSB to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
