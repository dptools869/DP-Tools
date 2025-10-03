
'use server';

/**
 * @fileOverview Protects a PDF file with a password.
 *
 * - protectPdf - A function that handles the PDF protection.
 * - ProtectPdfInput - The input type for the protectPdf function.
 * - ProtectPdfOutput - The return type for the protectPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const ProtectPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
  password: z.string().describe('The password to protect the PDF with.'),
});
export type ProtectPdfInput = z.infer<typeof ProtectPdfInputSchema>;

const ProtectPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The protected PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type ProtectPdfOutput = z.infer<typeof ProtectPdfOutputSchema>;


// ----------- Public function -----------
export async function protectPdf(input: ProtectPdfInput): Promise<ProtectPdfOutput> {
  return protectPdfFlow(input);
}

// ----------- Flow Definition -----------
const protectPdfFlow = ai.defineFlow(
  {
    name: 'protectPdfFlow',
    inputSchema: ProtectPdfInputSchema,
    outputSchema: ProtectPdfOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.pdf)$/i, '-protected.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([pdfBuffer], { type: 'application/pdf' }), input.fileName);
      formData.append('UserPassword', input.password);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/protect?Secret=${process.env.CONVERT_API_SECRET}`,
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

      const protectedFile = convertResult.Files[0];

      // Download PDF from URL
      const pdfResponse = await fetch(protectedFile.Url);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to download protected PDF file from ${protectedFile.Url}`);
      }

      const pdfArrayBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfArrayBuffer).toString('base64');
      const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;

      return {
        pdfDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error protecting PDF:', error);
      throw new Error(
        `Failed to protect PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
