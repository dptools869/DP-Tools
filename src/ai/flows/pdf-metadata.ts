
'use server';

/**
 * @fileOverview Extracts metadata from a PDF file.
 *
 * - pdfMetadata - A function that handles the metadata extraction.
 * - PdfMetadataInput - The input type for the pdfMetadata function.
 * - PdfMetadataOutput - The return type for the pdfMetadata function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const PdfMetadataInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
});
export type PdfMetadataInput = z.infer<typeof PdfMetadataInputSchema>;

const PdfMetadataOutputSchema = z.object({
  Title: z.string().optional(),
  Author: z.string().optional(),
  Subject: z.string().optional(),
  Keywords: z.string().optional(),
  Creator: z.string().optional(),
  Producer: z.string().optional(),
  CreationDate: z.string().optional(),
  ModDate: z.string().optional(),
  Trapped: z.string().optional(),
  PageCount: z.number().optional(),
  FileSize: z.number().optional(),
}).describe('The extracted metadata from the PDF file.');
export type PdfMetadataOutput = z.infer<typeof PdfMetadataOutputSchema>;


// ----------- Public function -----------
export async function pdfMetadata(input: PdfMetadataInput): Promise<PdfMetadataOutput> {
  return pdfMetadataFlow(input);
}

// ----------- Flow Definition -----------
const pdfMetadataFlow = ai.defineFlow(
  {
    name: 'pdfMetadataFlow',
    inputSchema: PdfMetadataInputSchema,
    outputSchema: PdfMetadataOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.pdfDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid PDF data URI.');
      }
      const pdfBuffer = Buffer.from(base64Data, 'base64');

      const formData = new FormData();
      formData.append('File', new Blob([pdfBuffer], { type: 'application/pdf' }), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/meta?Secret=${process.env.CONVERT_API_SECRET}`,
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
        throw new Error('Metadata extraction did not return any data.');
      }

      const metadataFileUrl = convertResult.Files[0].Url;

      // Fetch the actual metadata from the returned URL
      const metadataResponse = await fetch(metadataFileUrl);
       if (!metadataResponse.ok) {
        throw new Error(`Failed to download metadata file from ${metadataFileUrl}`);
      }

      const metadata = await metadataResponse.json();

      return {
        ...metadata,
        PageCount: metadata.PageCount ? parseInt(metadata.PageCount, 10) : undefined,
        FileSize: metadata.FileSize ? parseInt(metadata.FileSize, 10) : undefined,
      };

    } catch (error) {
      console.error('Error extracting PDF metadata:', error);
      throw new Error(
        `Failed to extract metadata. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
