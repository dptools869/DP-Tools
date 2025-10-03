
'use server';

/**
 * @fileOverview Converts various Office documents to PDF using ConvertAPI.
 *
 * - officeToPdf - A function that handles the Office to PDF conversion.
 * - OfficeToPdfInput - The input type for the officeToPdf function.
 * - OfficeToPdfOutput - The return type for the officeToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const OfficeToPdfInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "The Office file content as a data URI. Supports .docx, .doc, .rtf, .xls, .xlsx, .ppt, .pptx and more. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original Office file.'),
});
export type OfficeToPdfInput = z.infer<typeof OfficeToPdfInputSchema>;

const OfficeToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type OfficeToPdfOutput = z.infer<typeof OfficeToPdfOutputSchema>;

// ----------- Public function -----------
export async function officeToPdf(input: OfficeToPdfInput): Promise<OfficeToPdfOutput> {
  return officeToPdfFlow(input);
}

// ----------- Flow Definition -----------
const officeToPdfFlow = ai.defineFlow(
  {
    name: 'officeToPdfFlow',
    inputSchema: OfficeToPdfInputSchema,
    outputSchema: OfficeToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.fileDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid file data URI.');
      }

      const fileBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/\.[^/.]+$/, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([fileBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/office/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting Office to PDF:', error);
      throw new Error(
        `Failed to convert Office to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
