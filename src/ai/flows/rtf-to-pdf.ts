'use server';

/**
 * @fileOverview Converts an uploaded RTF file to a PDF file using ConvertAPI.
 *
 * - rtfToPdf - A function that handles the RTF to PDF conversion.
 * - RtfToPdfInput - The input type for the rtfToPdf function.
 * - RtfToPdfOutput - The return type for the rtfToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const RtfToPdfInputSchema = z.object({
  rtfDataUri: z
    .string()
    .describe(
      "The RTF file content as a data URI. Expected format: 'data:application/rtf;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original RTF file.'),
});
export type RtfToPdfInput = z.infer<typeof RtfToPdfInputSchema>;

const RtfToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type RtfToPdfOutput = z.infer<typeof RtfToPdfOutputSchema>;

// ----------- Public function -----------
export async function rtfToPdf(input: RtfToPdfInput): Promise<RtfToPdfOutput> {
  return rtfToPdfFlow(input);
}

// ----------- Flow Definition -----------
const rtfToPdfFlow = ai.defineFlow(
  {
    name: 'rtfToPdfFlow',
    inputSchema: RtfToPdfInputSchema,
    outputSchema: RtfToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.rtfDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid RTF data URI.');
      }

      const rtfBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.rtf)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([rtfBuffer], { type: 'application/rtf' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/rtf/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting RTF to PDF:', error);
      throw new Error(
        `Failed to convert RTF to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
