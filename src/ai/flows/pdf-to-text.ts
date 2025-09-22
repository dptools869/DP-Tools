
'use server';

/**
 * @fileOverview Converts an uploaded PDF file to a plain text file using ConvertAPI.
 *
 * - pdfToText - A function that handles the PDF to Text conversion.
 * - PdfToTextInput - The input type for the pdfToText function.
 * - PdfToTextOutput - The return type for the pdfToText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const PdfToTextInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
});
export type PdfToTextInput = z.infer<typeof PdfToTextInputSchema>;

const PdfToTextOutputSchema = z.object({
  textDataUri: z.string().describe('The converted text file as a data URI.'),
  textContent: z.string().describe('The extracted text content.'),
  fileName: z.string().describe('The name of the output text file.'),
});
export type PdfToTextOutput = z.infer<typeof PdfToTextOutputSchema>;

// ----------- Public function -----------
export async function pdfToText(input: PdfToTextInput): Promise<PdfToTextOutput> {
  return pdfToTextFlow(input);
}

// ----------- Flow Definition -----------
const pdfToTextFlow = ai.defineFlow(
  {
    name: 'pdfToTextFlow',
    inputSchema: PdfToTextInputSchema,
    outputSchema: PdfToTextOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      // Decode Base64 PDF
      const base64Data = input.pdfDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid PDF data URI.');
      }

      const pdfBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.pdf)$/i, '.txt');

      const formData = new FormData();
      formData.append('File', new Blob([pdfBuffer], { type: 'application/pdf' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/txt?Secret=${process.env.CONVERT_API_SECRET}`,
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
      
      // Download Text content from URL
      const textResponse = await fetch(convertedFile.Url);
      if (!textResponse.ok) {
        throw new Error(`Failed to download converted text file from ${convertedFile.Url}`);
      }

      const textContent = await textResponse.text();
      const textBase64 = Buffer.from(textContent).toString('base64');
      const textDataUri = `data:text/plain;base64,${textBase64}`;

      return {
        textDataUri,
        textContent,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting PDF to Text:', error);
      throw new Error(
        `Failed to convert PDF to Text. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
