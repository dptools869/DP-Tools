'use server';

/**
 * @fileOverview Converts an uploaded HTML file to a PDF using ConvertAPI.
 *
 * - htmlToPdf - A function that handles the HTML to PDF conversion.
 * - HtmlToPdfInput - The input type for the htmlToPdf function.
 * - HtmlToPdfOutput - The return type for the htmlToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const HtmlToPdfInputSchema = z.object({
  htmlDataUri: z
    .string()
    .describe(
      "The HTML file content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:text/html;base64,<encoded_data>'."
    ),
  fileName: z.string().describe('The name of the original HTML file.'),
});
export type HtmlToPdfInput = z.infer<typeof HtmlToPdfInputSchema>;

const HtmlToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type HtmlToPdfOutput = z.infer<typeof HtmlToPdfOutputSchema>;

// ----------- Public function -----------
export async function htmlToPdf(input: HtmlToPdfInput): Promise<HtmlToPdfOutput> {
  return htmlToPdfFlow(input);
}

// ----------- Flow Definition -----------
const htmlToPdfFlow = ai.defineFlow(
  {
    name: 'htmlToPdfFlow',
    inputSchema: HtmlToPdfInputSchema,
    outputSchema: HtmlToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      // Decode Base64 HTML
      const base64Data = input.htmlDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid HTML data URI.');
      }

      const htmlBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/\.[^/.]+$/, '') + '.pdf';

      // Use built-in FormData (no external form-data lib needed)
      const formData = new FormData();
      formData.append('File', new Blob([htmlBuffer], { type: 'text/html' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/html/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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

      const pdfFileUrl = convertResult.Files[0].Url;

      // Download PDF
      const pdfResponse = await fetch(pdfFileUrl);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to download converted PDF file from ${pdfFileUrl}`);
      }

      const pdfBuffer = await pdfResponse.arrayBuffer();
      const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
      const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;

      return {
        pdfDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting HTML to PDF:', error);
      throw new Error(
        `Failed to convert HTML to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
