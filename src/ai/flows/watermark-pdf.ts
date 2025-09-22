
'use server';

/**
 * @fileOverview Adds a text watermark to an uploaded PDF file.
 *
 * - watermarkPdf - A function that handles the PDF watermarking.
 * - WatermarkPdfInput - The input type for the watermarkPdf function.
 * - WatermarkPdfOutput - The return type for the watermarkPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const WatermarkPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
  watermarkText: z.string().describe('The text to use as the watermark.'),
});
export type WatermarkPdfInput = z.infer<typeof WatermarkPdfInputSchema>;

const WatermarkPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The watermarked PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type WatermarkPdfOutput = z.infer<typeof WatermarkPdfOutputSchema>;


// ----------- Public function -----------
export async function watermarkPdf(input: WatermarkPdfInput): Promise<WatermarkPdfOutput> {
  return watermarkPdfFlow(input);
}

// ----------- Flow Definition -----------
const watermarkPdfFlow = ai.defineFlow(
  {
    name: 'watermarkPdfFlow',
    inputSchema: WatermarkPdfInputSchema,
    outputSchema: WatermarkPdfOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.pdf)$/i, '-watermarked.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([pdfBuffer], { type: 'application/pdf' }), input.fileName);
      formData.append('Text', input.watermarkText);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/watermark?Secret=${process.env.CONVERT_API_SECRET}`,
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

      const watermarkedFile = convertResult.Files[0];

      // Download PDF from URL
      const pdfResponse = await fetch(watermarkedFile.Url);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to download watermarked PDF file from ${watermarkedFile.Url}`);
      }

      const pdfArrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfArrayBuffer).toString('base64');
      const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;

      return {
        pdfDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error watermarking PDF:', error);
      throw new Error(
        `Failed to watermark PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
