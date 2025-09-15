'use server';

/**
 * @fileOverview Recommends relevant YouTube tutorial videos based on the specific tool the user is currently using.
 *
 * - recommendRelevantYouTubeVideos - A function that recommends YouTube videos based on the tool being used.
 * - RecommendRelevantYouTubeVideosInput - The input type for the recommendRelevantYouTubeVideos function.
 * - RecommendRelevantYouTubeVideosOutput - The return type for the recommendRelevantYouTubeVideos function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendRelevantYouTubeVideosInputSchema = z.object({
  toolName: z.string().describe('The name of the tool being used.'),
});
export type RecommendRelevantYouTubeVideosInput = z.infer<typeof RecommendRelevantYouTubeVideosInputSchema>;

const RecommendRelevantYouTubeVideosOutputSchema = z.object({
  videoTitle: z.string().describe('The title of the recommended YouTube video.'),
  videoUrl: z.string().describe('The URL of the recommended YouTube video.'),
  videoDescription: z.string().describe('A short description of the video.'),
});
export type RecommendRelevantYouTubeVideosOutput = z.infer<typeof RecommendRelevantYouTubeVideosOutputSchema>;

export async function recommendRelevantYouTubeVideos(
  input: RecommendRelevantYouTubeVideosInput
): Promise<RecommendRelevantYouTubeVideosOutput> {
  return recommendRelevantYouTubeVideosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendRelevantYouTubeVideosPrompt',
  input: {schema: RecommendRelevantYouTubeVideosInputSchema},
  output: {schema: RecommendRelevantYouTubeVideosOutputSchema},
  prompt: `You are a helpful assistant that recommends YouTube tutorial videos based on the tool the user is currently using.  The output must be a JSON object. Do not include any other text.

  Tool Name: {{{toolName}}}

  Please provide the videoTitle, videoUrl, and videoDescription for a relevant YouTube tutorial video.  Only provide a single recommendation.
  `,
});

const recommendRelevantYouTubeVideosFlow = ai.defineFlow(
  {
    name: 'recommendRelevantYouTubeVideosFlow',
    inputSchema: RecommendRelevantYouTubeVideosInputSchema,
    outputSchema: RecommendRelevantYouTubeVideosOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
