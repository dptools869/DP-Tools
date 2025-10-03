
'use server';

/**
 * @fileOverview Converts an uploaded JPG file to a PDF file using ConvertAPI.
 *
 * - jpgToPdf - A function that handles the JPG to PDF conversion.
 * - JpgToPdfInput - The input type for the jpgToPdf function.
 * - JpgToPdfOutput - The return type for the jpgToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const JpgToPdfInputSchema = z.object({
  jpgDataUri: z
    .string()
    .describe(
      "The JPG file content as a data URI. Expected format: 'data:image/jpeg;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original JPG file.'),
});
export type JpgToPdfInput = z.infer<typeof JpgToPdfInputSchema>;

const JpgToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type JpgToPdfOutput = z.infer<typeof JpgToPdfOutputSchema>;

// ----------- Public function -----------
export async function jpgToPdf(input: JpgToPdfInput): Promise<JpgToPdfOutput> {
  return jpgToPdfFlow(input);
}

// ----------- Flow Definition -----------
const jpgToPdfFlow = ai.defineFlow(
  {
    name: 'jpgToPdfFlow',
    inputSchema: JpgToPdfInputSchema,
    outputSchema: JpgToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.jpgDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid JPG data URI.');
      }

      const jpgBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.jpg|\.jpeg)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([jpgBuffer], { type: 'image/jpeg' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/jpg/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting JPG to PDF:', error);
      throw new Error(
        `Failed to convert JPG to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
