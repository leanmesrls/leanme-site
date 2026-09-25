"use client";

import { useRef } from "react";

function openFullscreen(video: HTMLVideoElement) {
  const player = video as HTMLVideoElement & {
    webkitEnterFullscreen?: () => void;
  };

  if (typeof player.requestFullscreen === "function") {
    void player.requestFullscreen();
    return;
  }

  player.webkitEnterFullscreen?.();
}

export function AcademyVideoPlayer({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="w-full">
      <video
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        poster={poster}
        className="h-auto w-full rounded-xl bg-black"
        aria-label={label}
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            openFullscreen(video);
          }}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:border-leanme-fuchsia hover:text-leanme-fuchsia focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
        >
          Schermo intero
        </button>
      </div>
    </div>
  );
}
