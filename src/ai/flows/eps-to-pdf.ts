
'use server';

/**
 * @fileOverview Converts an uploaded EPS file to a PDF file using ConvertAPI.
 *
 * - epsToPdf - A function that handles the EPS to PDF conversion.
 * - EpsToPdfInput - The input type for the epsToPdf function.
 * - EpsToPdfOutput - The return type for the epsToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const EpsToPdfInputSchema = z.object({
  epsDataUri: z
    .string()
    .describe(
      "The EPS file content as a data URI. Expected format: 'data:application/postscript;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original EPS file.'),
});
export type EpsToPdfInput = z.infer<typeof EpsToPdfInputSchema>;

const EpsToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type EpsToPdfOutput = z.infer<typeof EpsToPdfOutputSchema>;

// ----------- Public function -----------
export async function epsToPdf(input: EpsToPdfInput): Promise<EpsToPdfOutput> {
  return epsToPdfFlow(input);
}

// ----------- Flow Definition -----------
const epsToPdfFlow = ai.defineFlow(
  {
    name: 'epsToPdfFlow',
    inputSchema: EpsToPdfInputSchema,
    outputSchema: EpsToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.epsDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid EPS data URI.');
      }

      const epsBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.eps)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([epsBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/eps/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting EPS to PDF:', error);
      throw new Error(
        `Failed to convert EPS to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
