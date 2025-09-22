'use server';

/**
 * @fileOverview Converts an uploaded PPTX file to a PDF file using ConvertAPI.
 *
 * - pptxToPdf - A function that handles the PPTX to PDF conversion.
 * - PptxToPdfInput - The input type for the pptxToPdf function.
 * - PptxToPdfOutput - The return type for the pptxToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const PptxToPdfInputSchema = z.object({
  pptxDataUri: z
    .string()
    .describe(
      "The PPTX file content as a data URI. Expected format: 'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PPTX file.'),
});
export type PptxToPdfInput = z.infer<typeof PptxToPdfInputSchema>;

const PptxToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type PptxToPdfOutput = z.infer<typeof PptxToPdfOutputSchema>;

// ----------- Public function -----------
export async function pptxToPdf(input: PptxToPdfInput): Promise<PptxToPdfOutput> {
  return pptxToPdfFlow(input);
}

// ----------- Flow Definition -----------
const pptxToPdfFlow = ai.defineFlow(
  {
    name: 'pptxToPdfFlow',
    inputSchema: PptxToPdfInputSchema,
    outputSchema: PptxToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.pptxDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid PPTX data URI.');
      }

      const pptxBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.pptx)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([pptxBuffer], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pptx/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting PPTX to PDF:', error);
      throw new Error(
        `Failed to convert PPTX to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
