
'use server';

/**
 * @fileOverview Converts an uploaded PDF file to an HTML file using ConvertAPI.
 *
 * - pdfToHtml - A function that handles the PDF to HTML conversion.
 * - PdfToHtmlInput - The input type for the pdfToHtml function.
 * - PdfToHtmlOutput - The return type for the pdfToHtml function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const PdfToHtmlInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
});
export type PdfToHtmlInput = z.infer<typeof PdfToHtmlInputSchema>;

const PdfToHtmlOutputSchema = z.object({
  htmlDataUri: z.string().describe('The converted HTML file as a data URI.'),
  fileName: z.string().describe('The name of the output HTML file.'),
});
export type PdfToHtmlOutput = z.infer<typeof PdfToHtmlOutputSchema>;

// ----------- Public function -----------
export async function pdfToHtml(input: PdfToHtmlInput): Promise<PdfToHtmlOutput> {
  return pdfToHtmlFlow(input);
}

// ----------- Flow Definition -----------
const pdfToHtmlFlow = ai.defineFlow(
  {
    name: 'pdfToHtmlFlow',
    inputSchema: PdfToHtmlInputSchema,
    outputSchema: PdfToHtmlOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.pdf)$/i, '.html');

      const formData = new FormData();
      formData.append('File', new Blob([pdfBuffer], { type: 'application/pdf' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/html?Secret=${process.env.CONVERT_API_SECRET}`,
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
      
      // Download HTML from URL
      const htmlResponse = await fetch(convertedFile.Url);
      if (!htmlResponse.ok) {
        throw new Error(`Failed to download converted HTML file from ${convertedFile.Url}`);
      }

      const htmlArrayBuffer = await htmlResponse.arrayBuffer();
      const htmlBase64 = Buffer.from(htmlArrayBuffer).toString('base64');
      const htmlDataUri = `data:text/html;base64,${htmlBase64}`;

      return {
        htmlDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting PDF to HTML:', error);
      throw new Error(
        `Failed to convert PDF to HTML. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
