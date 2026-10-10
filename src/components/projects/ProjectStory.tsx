import type { ProjectGalleryImage, ProjectVideo } from "../../types";

interface ProjectStoryProps {
  description?: string;
  gallery?: ProjectGalleryImage[];
  video?: ProjectVideo;
}

function VideoBlock({ video }: { video: ProjectVideo }) {
  switch (video.type) {
    case "video":
      return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video src={video.src} poster={video.poster} controls className="h-full w-full object-cover" />
      );
    case "youtube":
      return (
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${video.ytId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    case "vimeo":
      return (
        <iframe
          className="h-full w-full"
          src={`https://player.vimeo.com/video/${video.vimeoId}`}
          title="Vimeo video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
  }
}

export function ProjectStory({ description, gallery = [], video }: ProjectStoryProps) {
  const hasGallery = gallery.length > 0;
  const hasDescription = Boolean(description && description.trim());
  const hasVideo = Boolean(video);

  if (!hasGallery && !hasDescription && !hasVideo) return null;

  return (
    <div className="space-y-8">
      {(hasGallery || hasDescription) && (
        <div className={`grid gap-6 ${hasGallery && hasDescription ? "md:grid-cols-2" : ""}`}>
          {hasGallery && (
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((image) => (
                <div key={image.id} className="overflow-hidden rounded-2xl border border-border bg-surface-alt">
                  <img src={image.src} alt={image.alt} className="aspect-square w-full object-cover" />
                </div>
              ))}
            </div>
          )}
          {hasDescription && <p className="whitespace-pre-line text-muted">{description}</p>}
        </div>
      )}

      {hasVideo && video && (
        <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-surface-alt">
          <VideoBlock video={video} />
        </div>
      )}
    </div>
  );
}
