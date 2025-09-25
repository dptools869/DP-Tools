'use server';

/**
 * @fileOverview Converts an uploaded AI (Adobe Illustrator) file to a JPG file using ConvertAPI.
 *
 * - aiToJpg - A function that handles the AI to JPG conversion.
 * - AiToJpgInput - The input type for the aiToJpg function.
 * - AiToJpgOutput - The return type for the aiToJpg function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// ----------- Schemas -----------
const AiToJpgInputSchema = z.object({
  aiDataUri: z
    .string()
    .describe(
      "The AI file content as a data URI. Expected format: 'data:application/postscript;base64,<encoded_data>'"
    ),
  fileName: z.string().describe('The name of the original AI file.'),
});
export type AiToJpgInput = z.infer<typeof AiToJpgInputSchema>;

const AiToJpgOutputSchema = z.object({
  jpgDataUri: z.string().describe('The converted JPG file as a data URI.'),
  fileName: z.string().describe('The name of the output JPG file.'),
});
export type AiToJpgOutput = z.infer<typeof AiToJpgOutputSchema>;

// ----------- Public function -----------
export async function aiToJpg(input: AiToJpgInput): Promise<AiToJpgOutput> {
  return aiToJpgFlow(input);
}

// ----------- Flow Definition -----------
const aiToJpgFlow = ai.defineFlow(
  {
    name: 'aiToJpgFlow',
    inputSchema: AiToJpgInputSchema,
    outputSchema: AiToJpgOutputSchema,
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
      const outputFileName = input.fileName.replace(/(\.ai)$/i, '.jpg');

      const formData = new FormData();
      formData.append('File', new Blob([aiBuffer]), input.fileName);
      formData.append('StoreFile', 'true');

      // Call ConvertAPI
      const convertResponse = await fetch(
        `https://v2.convertapi.com/convert/ai/to/jpg?Secret=${process.env.CONVERT_API_SECRET}`,
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
      
      const jpgResponse = await fetch(convertedFile.Url);
      if (!jpgResponse.ok) {
        throw new Error(`Failed to download converted JPG file from ${convertedFile.Url}`);
      }

      const jpgArrayBuffer = await jpgResponse.arrayBuffer();
      const jpgBase64 = Buffer.from(jpgArrayBuffer).toString('base64');
      const jpgDataUri = `data:image/jpeg;base64,${jpgBase64}`;

      return {
        jpgDataUri,
        fileName: outputFileName,
      };
    } catch (error) {
      console.error('Error converting AI to JPG:', error);
      throw new Error(
        `Failed to convert AI to JPG. Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
);
