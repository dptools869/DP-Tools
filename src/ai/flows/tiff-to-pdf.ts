
'use server';

/**
 * @fileOverview Converts an uploaded TIFF file to a PDF file using ConvertAPI.
 *
 * - tiffToPdf - A function that handles the TIFF to PDF conversion.
 * - TiffToPdfInput - The input type for the tiffToPdf function.
 * - TiffToPdfOutput - The return type for the tiffToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const TiffToPdfInputSchema = z.object({
  tiffDataUri: z
    .string()
    .describe(
      "The TIFF file content as a data URI. Expected format: 'data:image/tiff;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original TIFF file.'),
});
export type TiffToPdfInput = z.infer<typeof TiffToPdfInputSchema>;

const TiffToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type TiffToPdfOutput = z.infer<typeof TiffToPdfOutputSchema>;

// ----------- Public function -----------
export async function tiffToPdf(input: TiffToPdfInput): Promise<TiffToPdfOutput> {
  return tiffToPdfFlow(input);
}

// ----------- Flow Definition -----------
const tiffToPdfFlow = ai.defineFlow(
  {
    name: 'tiffToPdfFlow',
    inputSchema: TiffToPdfInputSchema,
    outputSchema: TiffToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.tiffDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid TIFF data URI.');
      }

      const tiffBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.tiff|\.tif)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([tiffBuffer], { type: 'image/tiff' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/tiff/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting TIFF to PDF:', error);
      throw new Error(
        `Failed to convert TIFF to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
