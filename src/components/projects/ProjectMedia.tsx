import type { ProjectGalleryImage, ProjectVideo } from "../../types";

function VideoBlock({ video }: { video: ProjectVideo }) {
  switch (video.type) {
    case "video":
      return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video src={video.src} poster={video.poster} controls />
      );
    case "youtube":
      return (
        <iframe
          src={`https://www.youtube.com/embed/${video.ytId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    case "vimeo":
      return (
        <iframe
          src={`https://player.vimeo.com/video/${video.vimeoId}`}
          title="Vimeo video"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      );
  }
}

/** The photo and video sections of a project page; each only renders when it has content. */
export function ProjectMedia({ gallery = [], video }: { gallery?: ProjectGalleryImage[]; video?: ProjectVideo }) {
  const photos = gallery.filter((image) => image.src);
  return (
    <>
      {photos.length > 0 && (
        <section className="page-media" aria-labelledby="photos">
          <h2 id="photos">Photos</h2>
          <div className="page-gallery">
            {photos.map((image) => (
              <a key={image.id} href={image.src} target="_blank" rel="noreferrer">
                <img src={image.src} alt={image.alt} loading="lazy" />
              </a>
            ))}
          </div>
        </section>
      )}
      {/* Only in local development: shows where photos will go until some are added. */}
      {photos.length === 0 && import.meta.env.DEV && (
        <section className="page-media" aria-labelledby="photos">
          <h2 id="photos">Photos</h2>
          <div className="page-photo-placeholder">
            Photos go here. Add them in the admin panel under Projects, then Photo gallery. This note only shows
            on your computer, never on the live site.
          </div>
        </section>
      )}
      {video && (
        <section className="page-media" aria-labelledby="video">
          <h2 id="video">Video</h2>
          <div className="page-video">
            <VideoBlock video={video} />
          </div>
        </section>
      )}
    </>
  );
}
