
'use server';

/**
 * @fileOverview Applies OCR to a PDF to make it searchable.
 *
 * - pdfOcr - A function that handles the PDF OCR processing.
 * - PdfOcrInput - The input type for the pdfOcr function.
 * - PdfOcrOutput - The return type for the pdfOcr function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const PdfOcrInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
});
export type PdfOcrInput = z.infer<typeof PdfOcrInputSchema>;

const PdfOcrOutputSchema = z.object({
  pdfDataUri: z.string().describe('The OCR-processed PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type PdfOcrOutput = z.infer<typeof PdfOcrOutputSchema>;

// ----------- Public function -----------
export async function pdfOcr(input: PdfOcrInput): Promise<PdfOcrOutput> {
  return pdfOcrFlow(input);
}

// ----------- Flow Definition -----------
const pdfOcrFlow = ai.defineFlow(
  {
    name: 'pdfOcrFlow',
    inputSchema: PdfOcrInputSchema,
    outputSchema: PdfOcrOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      // Decode Base64 PDF
      const base64Data = input.pdfDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid PDF data URI.');
      }
      const pdfBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.pdf)$/i, '-ocr.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([pdfBuffer], { type: 'application/pdf' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/ocr?Secret=${process.env.CONVERT_API_SECRET}`,
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

      // Download PDF from URL
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
      console.error('Error during PDF OCR:', error);
      throw new Error(
        `Failed to perform OCR on PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
