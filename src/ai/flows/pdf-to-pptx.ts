
'use server';

/**
 * @fileOverview Converts an uploaded PDF file to a PPTX file using ConvertAPI.
 *
 * - pdfToPptx - A function that handles the PDF to PPTX conversion.
 * - PdfToPptxInput - The input type for the pdfToPptx function.
 * - PdfToPptxOutput - The return type for the pdfToPptx function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const PdfToPptxInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
});
export type PdfToPptxInput = z.infer<typeof PdfToPptxInputSchema>;

const PdfToPptxOutputSchema = z.object({
  pptxDataUri: z.string().describe('The converted PPTX file as a data URI.'),
  fileName: z.string().describe('The name of the output PPTX file.'),
});
export type PdfToPptxOutput = z.infer<typeof PdfToPptxOutputSchema>;

// ----------- Public function -----------
export async function pdfToPptx(input: PdfToPptxInput): Promise<PdfToPptxOutput> {
  return pdfToPptxFlow(input);
}

// ----------- Flow Definition -----------
const pdfToPptxFlow = ai.defineFlow(
  {
    name: 'pdfToPptxFlow',
    inputSchema: PdfToPptxInputSchema,
    outputSchema: PdfToPptxOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.pdf)$/i, '.pptx');

      const formData = new FormData();
      formData.append('File', new Blob([pdfBuffer], { type: 'application/pdf' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/pptx?Secret=${process.env.CONVERT_API_SECRET}`,
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
      
      // Download PPTX from URL
      const pptxResponse = await fetch(convertedFile.Url);
      if (!pptxResponse.ok) {
        throw new Error(`Failed to download converted PPTX file from ${convertedFile.Url}`);
      }

      const pptxArrayBuffer = await pptxResponse.arrayBuffer();
      const pptxBase64 = Buffer.from(pptxArrayBuffer).toString('base64');
      const pptxDataUri = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${pptxBase64}`;

      return {
        pptxDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting PDF to PPTX:', error);
      throw new Error(
        `Failed to convert PDF to PPTX. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
