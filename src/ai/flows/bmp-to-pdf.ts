'use server';

/**
 * @fileOverview Converts an uploaded BMP file to a PDF file using ConvertAPI.
 *
 * - bmpToPdf - A function that handles the BMP to PDF conversion.
 * - BmpToPdfInput - The input type for the bmpToPdf function.
 * - BmpToPdfOutput - The return type for the bmpToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const BmpToPdfInputSchema = z.object({
  bmpDataUri: z
    .string()
    .describe(
      "The BMP file content as a data URI. Expected format: 'data:image/bmp;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original BMP file.'),
});
export type BmpToPdfInput = z.infer<typeof BmpToPdfInputSchema>;

const BmpToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type BmpToPdfOutput = z.infer<typeof BmpToPdfOutputSchema>;

// ----------- Public function -----------
export async function bmpToPdf(input: BmpToPdfInput): Promise<BmpToPdfOutput> {
  return bmpToPdfFlow(input);
}

// ----------- Flow Definition -----------
const bmpToPdfFlow = ai.defineFlow(
  {
    name: 'bmpToPdfFlow',
    inputSchema: BmpToPdfInputSchema,
    outputSchema: BmpToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.bmpDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid BMP data URI.');
      }

      const bmpBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.bmp)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([bmpBuffer], { type: 'image/bmp' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/bmp/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting BMP to PDF:', error);
      throw new Error(
        `Failed to convert BMP to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
