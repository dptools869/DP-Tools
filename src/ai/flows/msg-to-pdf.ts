'use server';

/**
 * @fileOverview Converts an uploaded MSG or EML file to a PDF file using ConvertAPI.
 *
 * - msgToPdf - A function that handles the MSG/EML to PDF conversion.
 * - MsgToPdfInput - The input type for the msgToPdf function.
 * - MsgToPdfOutput - The return type for the msgToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const MsgToPdfInputSchema = z.object({
  emailDataUri: z
    .string()
    .describe(
      "The email file content as a data URI. Supports .msg and .eml. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original email file.'),
});
export type MsgToPdfInput = z.infer<typeof MsgToPdfInputSchema>;

const MsgToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type MsgToPdfOutput = z.infer<typeof MsgToPdfOutputSchema>;

// ----------- Public function -----------
export async function msgToPdf(input: MsgToPdfInput): Promise<MsgToPdfOutput> {
  return msgToPdfFlow(input);
}

// ----------- Flow Definition -----------
const msgToPdfFlow = ai.defineFlow(
  {
    name: 'msgToPdfFlow',
    inputSchema: MsgToPdfInputSchema,
    outputSchema: MsgToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.emailDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid email data URI.');
      }

      const emailBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.msg|\.eml)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([emailBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/msg/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting MSG to PDF:', error);
      throw new Error(
        `Failed to convert MSG to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
