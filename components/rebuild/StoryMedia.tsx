"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { RebuildClip, RebuildImage } from "@/lib/rebuild";

const placeClass: Record<NonNullable<RebuildImage["place"]>, string> = {
  full: "w-full",
  left: "w-full",
  right: "w-full",
  detail: "w-full",
};

export function StoryStill({
  photo,
  onOpen,
  priority = false,
  driftClass,
}: {
  photo: RebuildImage;
  onOpen: (photo: RebuildImage) => void;
  priority?: boolean;
  driftClass?: string;
}) {
  return (
    <figure className={`w-full ${placeClass[photo.place ?? "full"]}`}>
      {photo.word ? <WordMark label={photo.word} /> : null}
      <button
        type="button"
        onClick={() => onOpen(photo)}
        className="block w-full cursor-zoom-in overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        aria-label={`Apri la fotografia: ${photo.alt}`}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          priority={priority}
          sizes="(max-width: 960px) calc(100vw - 4.75rem), 896px"
          className={`block h-auto w-full ${driftClass ?? ""}`}
        />
      </button>
    </figure>
  );
}

function WordMark({ label }: { label: string }) {
  return (
    <p className="mb-4 w-full text-center text-[2rem] font-semibold leading-none tracking-tight text-white md:text-5xl">
      {label}
      <span className="mx-auto mt-2 block h-[3px] w-10 bg-[#E6007E]" />
    </p>
  );
}

export function StoryVideo({ clip }: { clip: RebuildClip }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = boxRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setNear(true);
      },
      { rootMargin: "480px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !near || reduce) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
          return;
        }
        video.pause();
      },
      { threshold: 0.5 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [near, reduce]);

  return (
    <figure ref={boxRef} className="w-full">
      <video
        ref={videoRef}
        src={near ? clip.src : undefined}
        poster={clip.poster}
        muted
        loop
        playsInline
        preload={near ? "metadata" : "none"}
        width={clip.width}
        height={clip.height}
        aria-label={clip.alt}
        style={{ aspectRatio: `${clip.width} / ${clip.height}` }}
        className="block h-auto w-full bg-black object-contain"
      />
      {reduce ? (
        <button
          type="button"
          onClick={() => {
            void videoRef.current?.play().catch(() => undefined);
          }}
          className="mt-3 min-h-11 border border-white/20 px-3 text-[11px] font-semibold tracking-[0.14em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6007E]"
        >
          Guarda
        </button>
      ) : null}
    </figure>
  );
}

export function BeforeAfter({
  before,
  after,
  label,
}: {
  before: RebuildImage;
  after: RebuildImage;
  label: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(52);
  const gesture = useRef<{ x: number; y: number; active: boolean } | null>(null);

  function moveTo(clientX: number) {
    const box = frameRef.current?.getBoundingClientRect();
    if (!box || box.width === 0) return;
    const next = ((clientX - box.left) / box.width) * 100;
    setPosition(Math.min(94, Math.max(6, next)));
  }

  return (
    <div>
      <div
        ref={frameRef}
        className="relative aspect-[2000/1126] w-full touch-pan-y overflow-hidden bg-black"
        onPointerDown={(event) => {
          gesture.current = { x: event.clientX, y: event.clientY, active: false };
        }}
        onPointerMove={(event) => {
          const current = gesture.current;
          if (!current) return;
          const dx = event.clientX - current.x;
          const dy = event.clientY - current.y;
          if (!current.active) {
            if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
              gesture.current = null;
              return;
            }
            if (Math.abs(dx) < 6) return;
            current.active = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }
          moveTo(event.clientX);
        }}
        onPointerUp={() => {
          gesture.current = null;
        }}
        onPointerCancel={() => {
          gesture.current = null;
        }}
      >
        <Image
          src={after.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          draggable={false}
        />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={before.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            draggable={false}
          />
          <span className="absolute left-3 top-3 bg-[#050505]/80 px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-white">
            BEFORE
          </span>
        </div>
        <span className="pointer-events-none absolute right-3 top-3 bg-[#050505]/80 px-2 py-1 text-[10px] font-semibold tracking-[0.18em] text-white">
          AFTER
        </span>
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-[#E6007E]"
          style={{ left: `${position}%` }}
        />
        <button
          type="button"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-label={label}
          className="absolute top-1/2 z-10 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#E6007E] bg-[#050505] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6007E]"
          style={{ left: `${position}%` }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              setPosition((value) => Math.max(6, value - 4));
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              setPosition((value) => Math.min(94, value + 4));
            }
          }}
        >
          <span className="mx-auto block h-4 w-px bg-[#E6007E]" />
        </button>
      </div>
      <p className="mt-3 w-full text-center text-sm text-white">{label}</p>
    </div>
  );
}

export function Lightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: RebuildImage[];
  index: number | null;
  onClose: () => void;
  onIndex: (index: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const photo = index === null ? null : photos[index];

  useEffect(() => {
    if (!photo) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && index !== null) {
        onIndex((index + 1) % photos.length);
      }
      if (event.key === "ArrowLeft" && index !== null) {
        onIndex((index - 1 + photos.length) % photos.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, onClose, onIndex, photo, photos.length]);

  if (!photo || index === null) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#050505]/96"
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-[11px] tracking-[0.16em] text-white/60">
          {index + 1} / {photos.length}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="min-h-11 px-3 text-sm tracking-[0.14em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6007E]"
        >
          Chiudi
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="100vw"
          className="max-h-[78vh] w-auto max-w-full object-contain"
        />
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => onIndex((index - 1 + photos.length) % photos.length)}
          className="min-h-11 px-3 text-sm tracking-[0.14em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6007E]"
        >
          Precedente
        </button>
        <p className="max-w-md text-center text-sm text-white/70">{photo.alt}</p>
        <button
          type="button"
          onClick={() => onIndex((index + 1) % photos.length)}
          className="min-h-11 px-3 text-sm tracking-[0.14em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6007E]"
        >
          Successiva
        </button>
      </div>
    </div>
  );
}
