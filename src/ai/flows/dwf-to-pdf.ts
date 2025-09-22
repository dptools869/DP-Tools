'use server';

/**
 * @fileOverview Converts an uploaded DWF file to a PDF file using ConvertAPI.
 *
 * - dwfToPdf - A function that handles the DWF to PDF conversion.
 * - DwfToPdfInput - The input type for the dwfToPdf function.
 * - DwfToPdfOutput - The return type for the dwfToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const DwfToPdfInputSchema = z.object({
  dwfDataUri: z
    .string()
    .describe(
      "The DWF file content as a data URI. Supports .dwf, .dwfx, .dwg, .dxf formats. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original DWF file.'),
});
export type DwfToPdfInput = z.infer<typeof DwfToPdfInputSchema>;

const DwfToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type DwfToPdfOutput = z.infer<typeof DwfToPdfOutputSchema>;

// ----------- Public function -----------
export async function dwfToPdf(input: DwfToPdfInput): Promise<DwfToPdfOutput> {
  return dwfToPdfFlow(input);
}

// ----------- Flow Definition -----------
const dwfToPdfFlow = ai.defineFlow(
  {
    name: 'dwfToPdfFlow',
    inputSchema: DwfToPdfInputSchema,
    outputSchema: DwfToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.dwfDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid DWF data URI.');
      }

      const dwfBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.dwf|\.dwfx|\.dwg|\.dxf)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([dwfBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/dwf/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting DWF to PDF:', error);
      throw new Error(
        `Failed to convert DWF to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
