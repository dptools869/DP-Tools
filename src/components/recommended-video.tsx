import { recommendRelevantYouTubeVideos } from '@/ai/flows/recommend-relevant-youtube-videos';
import { YouTubeEmbed } from '@/components/youtube-embed';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Video } from 'lucide-react';

export async function RecommendedVideo({ toolName }: { toolName: string }) {
  try {
    const recommendation = await recommendRelevantYouTubeVideos({ toolName });

    if (!recommendation?.videoUrl) {
      return (
         <Alert>
          <Video className="h-4 w-4" />
          <AlertTitle>Tutorial Coming Soon!</AlertTitle>
          <AlertDescription>We are working on providing a video tutorial for this tool.</AlertDescription>
        </Alert>
      )
    }

    return (
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{recommendation.videoTitle}</CardTitle>
          <CardDescription>{recommendation.videoDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <YouTubeEmbed url={recommendation.videoUrl} />
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Failed to fetch video recommendation:", error);
     return (
        <Alert variant="destructive">
          <Video className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Could not load video recommendation at this time.</AlertDescription>
        </Alert>
     )
  }
}
