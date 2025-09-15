'use client';

function getYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) return videoId;
    }
  } catch (e) {
    // Fallback for non-URL strings or invalid URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  return null;
}

export function YouTubeEmbed({ url, className }: { url: string; className?: string }) {
  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    return <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">Invalid YouTube URL</div>;
  }

  return (
    <div className={`aspect-video w-full rounded-lg overflow-hidden ${className}`}>
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
