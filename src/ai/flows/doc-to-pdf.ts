'use server';

/**
 * @fileOverview Converts an uploaded DOC file to a PDF file using ConvertAPI.
 *
 * - docToPdf - A function that handles the DOC to PDF conversion.
 * - DocToPdfInput - The input type for the docToPdf function.
 * - DocToPdfOutput - The return type for the docToPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const DocToPdfInputSchema = z.object({
  docDataUri: z
    .string()
    .describe(
      "The DOC file content as a data URI. Supports .doc and .docx formats. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original DOC file.'),
});
export type DocToPdfInput = z.infer<typeof DocToPdfInputSchema>;

const DocToPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe('The converted PDF file as a data URI.'),
  fileName: z.string().describe('The name of the output PDF file.'),
});
export type DocToPdfOutput = z.infer<typeof DocToPdfOutputSchema>;

// ----------- Public function -----------
export async function docToPdf(input: DocToPdfInput): Promise<DocToPdfOutput> {
  return docToPdfFlow(input);
}

// ----------- Flow Definition -----------
const docToPdfFlow = ai.defineFlow(
  {
    name: 'docToPdfFlow',
    inputSchema: DocToPdfInputSchema,
    outputSchema: DocToPdfOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.docDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid DOC data URI.');
      }

      const docBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.doc|\.docx)$/i, '.pdf');

      const formData = new FormData();
      formData.append('File', new Blob([docBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/doc/to/pdf?Secret=${process.env.CONVERT_API_SECRET}`,
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
      console.error('Error converting DOC to PDF:', error);
      throw new Error(
        `Failed to convert DOC to PDF. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
