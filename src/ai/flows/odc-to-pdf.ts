
'use server';

/**
 * @fileOverview Converts an uploaded OpenOffice file to a PDF file using ConvertAPI.
 *
 * - odcToPdf - A function that handles the OpenOffice to PDF conversion.
 * - OdcToPdfInput - The input type for the odcToPdf function.
 * - OdcToPdfOutput - The return type for the odcToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const OdcToPdfInputSchema = z.object({
  odcDataUri: z
    .string()
    .describe(
      "The OpenOffice file content as a data URI. Supports .odc, .odf, .odp, .ods, .odt. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original OpenOffice file.'),
});
export type OdcToPdfInput = z.infer<typeof OdcToPdfInputSchema>;

const OdcToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type OdcToPdfOutput = z.infer<typeof OdcToPdfOutputSchema>;

// ----------- Public function -----------
export async function odcToPdf(input: OdcToPdfInput): Promise<OdcToPdfOutput> {
  return odcToPdfFlow(input);
}

// ----------- Flow Definition -----------
const odcToPdfFlow = ai.defineFlow(
  {
    name: 'odcToPdfFlow',
    inputSchema: OdcToPdfInputSchema,
    outputSchema: OdcToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.odcDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid OpenOffice data URI.');
      }

      const odcBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.od[a-z]{1})$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([odcBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/odc/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting OpenOffice to PDF:', error);
      throw new Error(
        `Failed to convert OpenOffice to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
