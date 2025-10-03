
'use server';

/**
 * @fileOverview Converts an uploaded PDF file to a DOCX file using ConvertAPI.
 *
 * - pdfToDocx - A function that handles the PDF to DOCX conversion.
 * - PdfToDocxInput - The input type for the pdfToDocx function.
 * - PdfToDocxOutput - The return type for the pdfToDocx function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const PdfToDocxInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
});
export type PdfToDocxInput = z.infer<typeof PdfToDocxInputSchema>;

const PdfToDocxOutputSchema = z.object({
  docxDataUri: z.string().describe('The converted DOCX file as a data URI.'),
  fileName: z.string().describe('The name of the output DOCX file.'),
});
export type PdfToDocxOutput = z.infer<typeof PdfToDocxOutputSchema>;

// ----------- Public function -----------
export async function pdfToDocx(input: PdfToDocxInput): Promise<PdfToDocxOutput> {
  return pdfToDocxFlow(input);
}

// ----------- Flow Definition -----------
const pdfToDocxFlow = ai.defineFlow(
  {
    name: 'pdfToDocxFlow',
    inputSchema: PdfToDocxInputSchema,
    outputSchema: PdfToDocxOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.pdf)$/i, '.docx');

      const formData = new FormData();
      formData.append('File', new Blob([pdfBuffer], { type: 'application/pdf' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/docx?Secret=${process.env.CONVERT_API_SECRET}`,
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
      
      // Download DOCX from URL
      const docxResponse = await fetch(convertedFile.Url);
      if (!docxResponse.ok) {
        throw new Error(`Failed to download converted DOCX file from ${convertedFile.Url}`);
      }

      const docxArrayBuffer = await docxResponse.arrayBuffer();
      const docxBase64 = Buffer.from(docxArrayBuffer).toString('base64');
      const docxDataUri = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${docxBase64}`;

      return {
        docxDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting PDF to DOCX:', error);
      throw new Error(
        `Failed to convert PDF to DOCX. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
