
'use server';

/**
 * @fileOverview Converts a web page to a PDF file using ConvertAPI.
 *
 * - webToPdf - A function that handles the Web to PDF conversion.
 * - WebToPdfInput - The input type for the webToPdf function.
 * - WebToPdfOutput - The return type for the webToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const WebToPdfInputSchema = z.object({
  url: z.string().url().describe('The URL of the web page to convert.'),
});
export type WebToPdfInput = z.infer<typeof WebToPdfInputSchema>;

const WebToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type WebToPdfOutput = z.infer<typeof WebToPdfOutputSchema>;


// ----------- Public function -----------
export async function webToPdf(input: WebToPdfInput): Promise<WebToPdfOutput> {
  return webToPdfFlow(input);
}

// ----------- Flow Definition -----------
const webToPdfFlow = ai.defineFlow(
  {
    name: 'webToPdfFlow',
    inputSchema: WebToPdfInputSchema,
    outputSchema: WebToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const url = new URL(input.url);
      const outputFileName = `${url.hostname}.pdf`;

      const formData = new FormData();
      formData.append('Url', input.url);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/web/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting URL to PDF:', error);
      throw new Error(
        `Failed to convert URL to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
