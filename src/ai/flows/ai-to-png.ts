'use server';

/**
 * @fileOverview Converts an uploaded AI file to a PNG file using ConvertAPI.
 *
 * - aiToPng - A function that handles the AI to PNG conversion.
 * - AiToPngInput - The input type for the aiToPng function.
 * - AiToPngOutput - The return type for the aiToPng function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const AiToPngInputSchema = z.object({
  aiDataUri: z
    .string()
    .describe(
      "The AI file content as a data URI. Expected format: 'data:application/postscript;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original AI file.'),
});
export type AiToPngInput = z.infer<typeof AiToPngInputSchema>;

const AiToPngOutputSchema = z.object({
  pngDataUri: z.string().describe('The converted PNG file as a data URI.'),
  fileName: z.string().describe('The name of the output PNG file.'),
});
export type AiToPngOutput = z.infer<typeof AiToPngOutputSchema>;

// ----------- Public function -----------
export async function aiToPng(input: AiToPngInput): Promise<AiToPngOutput> {
  return aiToPngFlow(input);
}

// ----------- Flow Definition -----------
const aiToPngFlow = ai.defineFlow(
  {
    name: 'aiToPngFlow',
    inputSchema: AiToPngInputSchema,
    outputSchema: AiToPngOutputSchema,
  },
  async (input) => {
    if (!process.env.CONVERT_API_SECRET) {
      throw new Error('CONVERT_API_SECRET is not set in the environment.');
    }

    try {
      const base64Data = input.aiDataUri.split(';base64,').pop();
      if (!base64Data) {
        throw new Error('Invalid AI data URI.');
      }

      const aiBuffer = Buffer.from(base64Data, 'base64');
      const outputFileName = input.fileName.replace(/(\.ai)$/i, '.png');

      const formData = new FormData();
      formData.append('File', new Blob([aiBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/ai/to/png?Secret=${process.env.CONVERT_API_SECRET}`,
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
      
      const pngResponse = await fetch(convertedFile.Url);
      if (!pngResponse.ok) {
        throw new Error(`Failed to download converted PNG file from ${convertedFile.Url}`);
      }

      const pngArrayBuffer = await pngResponse.arrayBuffer();
      const pngBase64 = Buffer.from(pngArrayBuffer).toString('base64');
      const pngDataUri = `data:image/png;base64,${pngBase64}`;

      return {
        pngDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting AI to PNG:', error);
      throw new Error(
        `Failed to convert AI to PNG. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
