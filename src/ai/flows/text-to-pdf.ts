
'use server';

/**
 * @fileOverview Converts an uploaded TXT file to a PDF file using ConvertAPI.
 *
 * - textToPdf - A function that handles the TXT to PDF conversion.
 * - TextToPdfInput - The input type for the textToPdf function.
 * - TextToPdfOutput - The return type for the textToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const TextToPdfInputSchema = z.object({
  textDataUri: z
    .string()
    .describe(
      "The TXT file content as a data URI. Expected format: 'data:text/plain;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original TXT file.'),
});
export type TextToPdfInput = z.infer<typeof TextToPdfInputSchema>;

const TextToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type TextToPdfOutput = z.infer<typeof TextToPdfOutputSchema>;

// ----------- Public function -----------
export async function textToPdf(input: TextToPdfInput): Promise<TextToPdfOutput> {
  return textToPdfFlow(input);
}

// ----------- Flow Definition -----------
const textToPdfFlow = ai.defineFlow(
  {
    name: 'textToPdfFlow',
    inputSchema: TextToPdfInputSchema,
    outputSchema: TextToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.textDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid TXT data URI.');
      }

      const textBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.txt)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([textBuffer], { type: 'text/plain' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/txt/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting TXT to PDF:', error);
      throw new Error(
        `Failed to convert TXT to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
