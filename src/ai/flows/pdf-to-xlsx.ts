
'use server';

/**
 * @fileOverview Converts an uploaded PDF file to an XLSX file using ConvertAPI.
 *
 * - pdfToXlsx - A function that handles the PDF to XLSX conversion.
 * - PdfToXlsxInput - The input type for the pdfToXlsx function.
 * - PdfToXlsxOutput - The return type for the pdfToXlsx function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const PdfToXlsxInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
});
export type PdfToXlsxInput = z.infer<typeof PdfToXlsxInputSchema>;

const PdfToXlsxOutputSchema = z.object({
  xlsxDataUri: z.string().describe('The converted XLSX file as a data URI.'),
  fileName: z.string().describe('The name of the output XLSX file.'),
});
export type PdfToXlsxOutput = z.infer<typeof PdfToXlsxOutputSchema>;

// ----------- Public function -----------
export async function pdfToXlsx(input: PdfToXlsxInput): Promise<PdfToXlsxOutput> {
  const secret = process.env.CONVERT_API_SECRET;
  if (!secret) {
    throw new Error('CONVERT_API_SECRET is not set in the environment.');
  }
  return pdfToXlsxFlow({ ...input, secret });
}

const InternalPdfToXlsxInputSchema = PdfToXlsxInputSchema.extend({
  secret: z.string(),
});

// ----------- Flow Definition -----------
const pdfToXlsxFlow = ai.defineFlow(
  {
    name: 'pdfToXlsxFlow',
    inputSchema: InternalPdfToXlsxInputSchema,
    outputSchema: PdfToXlsxOutputSchema,
  },
  async (input) => {
    try {
      // Decode Base64 PDF
      const base64Data = input.pdfDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid PDF data URI.');
      }

      const pdfBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.pdf)$/i, '.xlsx');

      const formData = new FormData();
      formData.append('File', new Blob([pdfBuffer], { type: 'application/pdf' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/xlsx?Secret=${input.secret}`,
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
      
      // Download XLSX from URL
      const xlsxResponse = await fetch(convertedFile.Url);
      if (!xlsxResponse.ok) {
        throw new Error(`Failed to download converted XLSX file from ${convertedFile.Url}`);
      }

      const xlsxArrayBuffer = await xlsxResponse.arrayBuffer();
      const xlsxBase64 = Buffer.from(xlsxArrayBuffer).toString('base64');
      const xlsxDataUri = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${xlsxBase64}`;

      return {
        xlsxDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting PDF to XLSX:', error);
      throw new Error(
        `Failed to convert PDF to XLSX. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
