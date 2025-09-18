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
import ConvertApi from 'convertapi';

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

export async function htmlToPdf(input: HtmlToPdfInput): Promise<HtmlToPdfOutput> {
  return htmlToPdfFlow(input);
}

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

    const convertApi = new ConvertApi(process.env.CONVERT_API_SECRET, {
      conversionTimeout: 120, // Optional: set conversion timeout
    });

    try {
      const base64Data = input.htmlDataUri.split(',')[1];
      const outputFileName = input.fileName.replace(/\.[^/.]+$/, '') + '.pdf';

      const params = convertApi.createParams();
      params.add('File', Buffer.from(base64Data, 'base64'), input.fileName);
      params.add('StoreFile', true);

      const result = await convertApi.convert('html', 'pdf', params);

      if (result.files && result.files.length > 0) {
        const pdfFile = result.files[0];
        const pdfBase64 = pdfFile.fileData.toString('base64');
        const pdfDataUri = `data:application/pdf;base64,${pdfBase64}`;

        return {
          pdfDataUri: pdfDataUri,
          fileName: outputFileName,
        };
      } else {
        throw new Error('Conversion result did not contain any files.');
      }
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
