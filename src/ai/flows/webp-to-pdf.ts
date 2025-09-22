
'use server';

/**
 * @fileOverview Converts an uploaded WEBP file to a PDF file using ConvertAPI.
 *
 * - webpToPdf - A function that handles the WEBP to PDF conversion.
 * - WebpToPdfInput - The input type for the webpToPdf function.
 * - WebpToPdfOutput - The return type for the webpToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const WebpToPdfInputSchema = z.object({
  webpDataUri: z
    .string()
    .describe(
      "The WEBP file content as a data URI. Expected format: 'data:image/webp;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original WEBP file.'),
});
export type WebpToPdfInput = z.infer<typeof WebpToPdfInputSchema>;

const WebpToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type WebpToPdfOutput = z.infer<typeof WebpToPdfOutputSchema>;

// ----------- Public function -----------
export async function webpToPdf(input: WebpToPdfInput): Promise<WebpToPdfOutput> {
  return webpToPdfFlow(input);
}

// ----------- Flow Definition -----------
const webpToPdfFlow = ai.defineFlow(
  {
    name: 'webpToPdfFlow',
    inputSchema: WebpToPdfInputSchema,
    outputSchema: WebpToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.webpDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid WEBP data URI.');
      }

      const webpBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.webp)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([webpBuffer], { type: 'image/webp' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/webp/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting WEBP to PDF:', error);
      throw new Error(
        `Failed to convert WEBP to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
