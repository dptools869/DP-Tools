
'use server';

/**
 * @fileOverview Extracts structured data from a PDF file using AI.
 *
 * - extractPdf - A function that handles the data extraction.
 * - ExtractPdfInput - The input type for the extractPdf function.
 * - ExtractPdfOutput - The return type for the extractPdf function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const DocumentTypeSchema = z.enum([
    'auto', 
    'invoice', 
    'receipt', 
    'contract', 
    'identification', 
    'financial', 
    'form'
]);

const ExtractPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF file content as a data URI. Expected format: 'data:application/pdf;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original PDF file.'),
  documentType: DocumentTypeSchema.describe('The type of document to guide AI extraction.')
});
export type ExtractPdfInput = z.infer<typeof ExtractPdfInputSchema>;

const ExtractPdfOutputSchema = z.object({
  extractedData: z.any().describe('The extracted structured data as a JSON object.'),
  fileName: z.string().describe('The name of the source file.'),
});
export type ExtractPdfOutput = z.infer<typeof ExtractPdfOutputSchema>;


// ----------- Public function -----------
export async function extractPdf(input: ExtractPdfInput): Promise<ExtractPdfOutput> {
  return extractPdfFlow(input);
}

// ----------- Flow Definition -----------
const extractPdfFlow = ai.defineFlow(
  {
    name: 'extractPdfFlow',
    inputSchema: ExtractPdfInputSchema,
    outputSchema: ExtractPdfOutputSchema,
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
      formData.append('DocumentType', input.documentType);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/extract?Secret=${process.env.CONVERT_API_SECRET}`,
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
        throw new Error('Data extraction did not return any data.');
      }

      const dataFileUrl = convertResult.Files[0].Url;

      // Fetch the actual extracted data from the returned URL
      const dataResponse = await fetch(dataFileUrl);
       if (!dataResponse.ok) {
        throw new Error(`Failed to download extracted data file from ${dataFileUrl}`);
      }

      const extractedData = await dataResponse.json();
      
      return {
        extractedData,
        fileName: input.fileName
      };

    } catch (error) {
      console.error('Error extracting PDF data:', error);
      throw new Error(
        `Failed to extract data. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
