import { VideoPlayer } from "@/components/ui/video-player";

/**
 * Full-width video band. The player's lazy-mount and autoplay behaviour lives
 * in VideoPlayer; this is only the surrounding section.
 */
export function VideoSection({
  title,
  videoId,
}: {
  title: string;
  videoId: string;
}) {
  /*
   * Flat navy, the same field as the auth panel. No wash, no vignette, no
   * grid — the video is the only bright thing in the section, which is the
   * whole idea.
   */
  return (
    <section className="relative overflow-hidden bg-brand-950">
      <div className="relative container-page py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 flex items-center justify-center gap-3 text-[10px] tracking-[0.28em] text-white/45 uppercase">
            <span className="h-px w-6 bg-white/20" aria-hidden />
            Watch
            <span className="h-px w-6 bg-white/20" aria-hidden />
          </p>
          <h2 className="font-display text-[1.9rem] leading-[1.15] font-light text-white/95 lg:text-[2.6rem]">
            {title}
          </h2>
        </div>

        <VideoPlayer
          videoId={videoId}
          title={title}
          className="mx-auto mt-14 max-w-5xl"
        />
      </div>
    </section>
  );
}
