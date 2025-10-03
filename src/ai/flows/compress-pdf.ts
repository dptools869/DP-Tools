
'use server';

/**
 * @fileOverview Compresses an uploaded PDF file using ConvertAPI.
 *
 * - compressPdf - A function that handles the PDF compression.
 * - CompressPdfInput - The input type for the compressPdf function.
 * - CompressPdfOutput - The return type for the compressPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const CompressPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
});
export type CompressPdfInput = z.infer<typeof CompressPdfInputSchema>;

const CompressPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The compressed PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
  originalSize: z.number().describe('Original file size in bytes.'),
  compressedSize: z.number().describe('Compressed file size in bytes.'),
});
export type CompressPdfOutput = z.infer<typeof CompressPdfOutputSchema>;

// ----------- Public function -----------
export async function compressPdf(input: CompressPdfInput): Promise<CompressPdfOutput> {
  return compressPdfFlow(input);
}

// ----------- Flow Definition -----------
const compressPdfFlow = ai.defineFlow(
  {
    name: 'compressPdfFlow',
    inputSchema: CompressPdfInputSchema,
    outputSchema: CompressPdfOutputSchema,
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
      const originalSize = pdfBuffer.length;
      
      const outputFileName = input.fileName.replace(/(\.pdf)$/i, '-compressed.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([pdfBuffer], { type: 'application/pdf' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/compress?Secret=${process.env.CONVERT_API_SECRET}`,
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

      const compressedFile = convertResult.Files[0];
      const compressedSize = compressedFile.FileSize;
      
      // Download PDF from URL
      const pdfResponse = await fetch(compressedFile.Url);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to download converted PDF file from ${compressedFile.Url}`);
      }

      const pdfArrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfArrayBuffer).toString('base64');
      const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;

      return {
        pdfDataUri,
        fileName: outputFileName,
        originalSize,
        compressedSize,
      };
    } catch (error) {
      console.error('Error compressing PDF:', error);
      throw new Error(
        `Failed to compress PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
