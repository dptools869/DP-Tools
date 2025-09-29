
'use server';

/**
 * @fileOverview Converts an uploaded AI file to a WEBP file using ConvertAPI.
 *
 * - aiToWebp - A function that handles the AI to WEBP conversion.
 * - AiToWebpInput - The input type for the aiToWebp function.
 * - AiToWebpOutput - The return type for the aiToWebp function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const AiToWebpInputSchema = z.object({
  aiDataUri: z
    .string()
    .describe(
      "The AI file content as a data URI. Expected format: 'data:application/postscript;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original AI file.'),
});
export type AiToWebpInput = z.infer<typeof AiToWebpInputSchema>;

const AiToWebpOutputSchema = z.object({
  webpDataUri: z.string().describe('The converted WEBP file as a data URI.'),
  fileName: z.string().describe('The name of the output WEBP file.'),
});
export type AiToWebpOutput = z.infer<typeof AiToWebpOutputSchema>;

// ----------- Public function -----------
export async function aiToWebp(input: AiToWebpInput): Promise<AiToWebpOutput> {
  return aiToWebpFlow(input);
}

// ----------- Flow Definition -----------
const aiToWebpFlow = ai.defineFlow(
  {
    name: 'aiToWebpFlow',
    inputSchema: AiToWebpInputSchema,
    outputSchema: AiToWebpOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.ai)$/i, '.webp');

      const formData = new FormData();
      formData.append('File', new Blob([aiBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/ai/to/webp?Secret=${process.env.CONVERT_API_SECRET}`,
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
      
      const webpResponse = await fetch(convertedFile.Url);
      if (!webpResponse.ok) {
        throw new Error(`Failed to download converted WEBP file from ${convertedFile.Url}`);
      }

      const webpArrayBuffer = await webpResponse.arrayBuffer();
      const webpBase64 = Buffer.from(webpArrayBuffer).toString('base64');
      const webpDataUri = `data:image/webp;base64,${webpBase64}`;

      return {
        webpDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting AI to WEBP:', error);
      throw new Error(
        `Failed to convert AI to WEBP. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
