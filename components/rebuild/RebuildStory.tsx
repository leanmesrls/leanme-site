"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ASSETS } from "@/lib/assets";
import {
  collectStoryImages,
  isClip,
  type RebuildImage,
  type RebuildMedia,
  type RebuildStory as RebuildStoryData,
} from "@/lib/rebuild";
import { BeforeAfter, Lightbox, StoryStill, StoryVideo } from "@/components/rebuild/StoryMedia";
import { VisitCounter } from "@/components/rebuild/VisitCounter";
import styles from "@/components/rebuild/story.module.css";

export function RebuildStory({ story }: { story: RebuildStoryData }) {
  const photos = collectStoryImages(story);
  const [openId, setOpenId] = useState<string | null>(null);
  const openIndex = openId ? photos.findIndex((photo) => photo.id === openId) : null;
  const reduce = useReducedMotion();

  function openPhoto(photo: RebuildImage) {
    setOpenId(photo.id);
  }

  return (
    <>
      <ScrollRail />
      <article id="rebuild-top" className="overflow-x-clip bg-[#050505] text-white">
        <Link
          href="/"
          className="fixed left-4 top-4 z-30 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <Image
            src={ASSETS.logo.pinkWhite}
            alt="LeanMe — torna alla home"
            width={931}
            height={250}
            className="h-9 w-auto"
            priority
            unoptimized
          />
        </Link>
        <VisitCounter />

        <div className="pr-9 md:pr-12">
          <Opening story={story} reduce={Boolean(reduce)} />

          <section className="bg-[#E6007E]">
            <div className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-28">
              <BeforeChapter story={story} onOpen={openPhoto} hot />
            </div>
          </section>

          <section className="bg-[#050505]">
            <div className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-28">
              <MakingChapter story={story} onOpen={openPhoto} />
            </div>
          </section>

          <section className="bg-[#E6007E]">
            <div className="mx-auto w-full max-w-4xl px-5 py-20 md:px-8 md:py-28">
              <RevealChapter story={story} onOpen={openPhoto} hot />
            </div>
          </section>

          <PeopleChapter story={story} onOpen={openPhoto} reduce={Boolean(reduce)} />

          <section className="bg-[#E6007E]">
            <ThanksChapter story={story} onOpen={openPhoto} hot />
          </section>
        </div>

        <Lightbox
          photos={photos}
          index={openIndex === -1 ? null : openIndex}
          onClose={() => setOpenId(null)}
          onIndex={(index) => setOpenId(photos[index]?.id ?? null)}
        />
      </article>
    </>
  );
}

function ScrollRail() {
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const remaining =
        document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      setVisible(remaining > 180);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!visible) return null;

  return (
    <p
      className={`${reduce ? "" : styles.rail} pointer-events-none fixed bottom-32 right-0 top-28 z-30 flex w-9 items-center justify-center md:top-24 md:w-12`}
      aria-hidden="true"
    >
      <span className="flex flex-col items-center gap-3 text-white">
        <span className="text-[13px] font-semibold tracking-[0.32em] [text-orientation:upright] [writing-mode:vertical-rl] md:text-sm">
          SCROLL
        </span>
        <DownArrow />
      </span>
    </p>
  );
}

export function RestartButton() {
  const reduce = useReducedMotion();

  return (
    <a
      href="#rebuild-top"
      onClick={(event) => {
        event.preventDefault();
        const top = document.getElementById("rebuild-top");
        top?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }}
      className="mx-auto mt-14 flex min-h-12 w-full max-w-sm items-center justify-center border border-white px-6 text-center text-sm font-semibold tracking-[0.04em] text-white hover:bg-white hover:text-[#050505] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      Ricomincia dall&apos;inizio
    </a>
  );
}

function Opening({
  story,
  reduce,
}: {
  story: RebuildStoryData;
  reduce: boolean;
}) {
  const steps = story.opening.steps;
  const [step, setStep] = useState(0);
  const [showLine, setShowLine] = useState(reduce);

  useEffect(() => {
    if (reduce) return;
    const timers = steps.map((value, index) =>
      window.setTimeout(() => {
        setStep(index);
        if (value === 100) {
          window.setTimeout(() => setShowLine(true), 280);
        }
      }, 480 * index),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [reduce, steps]);

  const percent = steps[step] ?? 0;

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-x-clip px-5 pb-44 pt-24 text-center">
      <h1 className="w-full text-[clamp(2.7rem,13vw,10.5rem)] font-semibold leading-none tracking-[-0.05em]">
        {story.opening.title}
      </h1>
      <div className={`${styles.bar} mt-6`} aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-4 text-sm tabular-nums tracking-[0.28em] text-white/80" aria-hidden="true">
        {percent}%
      </p>
      <div
        className={`mt-10 w-full transition-opacity duration-700 ${showLine ? "opacity-100" : "opacity-0"}`}
      >
        <p className="text-balance text-base font-semibold leading-snug tracking-[0.04em] md:text-2xl md:tracking-[0.08em]">
          {story.opening.line}
        </p>
        <p className="mt-4 w-full text-base italic leading-relaxed text-white md:text-lg">
          {story.opening.subtitle}
        </p>
      </div>
      <a
        href="#capitolo-prima"
        className={`${styles.hint} mt-12 inline-flex flex-col items-center gap-2 text-base font-semibold tracking-[0.28em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:text-lg`}
      >
        <span>{story.opening.scroll}</span>
        <DownArrow size={40} />
      </a>
    </section>
  );
}

function ChapterIndex({ children, hot = false }: { children: string; hot?: boolean }) {
  return (
    <p
      className={`w-full text-center text-[11px] font-semibold uppercase tracking-[0.22em] ${hot ? "text-white" : "text-[#E6007E]"}`}
    >
      {children}
    </p>
  );
}

function BeforeChapter({
  story,
  onOpen,
  hot = false,
}: {
  story: RebuildStoryData;
  onOpen: (photo: RebuildImage) => void;
  hot?: boolean;
}) {
  return (
    <section id="capitolo-prima" className="scroll-mt-8 text-center">
      <ChapterIndex hot={hot}>{story.before.index}</ChapterIndex>
      <h2 className="mt-4 w-full text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
        {story.before.title}
      </h2>
      <div className="mt-10 flex flex-col gap-8">
        {story.before.images.map((photo, index) => (
          <StoryStill
            key={photo.id}
            photo={photo}
            onOpen={onOpen}
            priority={index === 0}
            driftClass={index === 0 ? styles.drift : undefined}
          />
        ))}
      </div>
      <p className="mt-8 w-full text-lg leading-relaxed text-white md:text-xl">
        {story.before.text}
      </p>
    </section>
  );
}

function MakingChapter({
  story,
  onOpen,
}: {
  story: RebuildStoryData;
  onOpen: (photo: RebuildImage) => void;
}) {
  return (
    <section className="flex flex-col gap-10 text-center md:gap-14">
      <div>
        <ChapterIndex>{story.making.index}</ChapterIndex>
        <h2 className="mt-4 w-full text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          {story.making.title}
        </h2>
      </div>
      {story.making.media.map((item) => (
        <MediaBlock key={item.id} item={item} onOpen={onOpen} />
      ))}
      <p className="w-full py-6 text-5xl font-semibold tracking-tight md:text-7xl">
        {story.making.ideas}
        <span className="mx-auto mt-3 block h-[3px] w-16 bg-[#E6007E]" />
      </p>
    </section>
  );
}

function RevealChapter({
  story,
  onOpen,
  hot = false,
}: {
  story: RebuildStoryData;
  onOpen: (photo: RebuildImage) => void;
  hot?: boolean;
}) {
  return (
    <section className="flex flex-col gap-12 text-center md:gap-16">
      <div>
        <ChapterIndex hot={hot}>{story.reveal.index}</ChapterIndex>
        <h2 className="mt-4 w-full text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          {story.reveal.title}
        </h2>
      </div>
      <BeforeAfter
        before={story.reveal.before}
        after={story.reveal.after}
        label={story.reveal.compareLabel}
      />
      <div className="w-full py-8">
        <p className="w-full text-4xl font-semibold tracking-tight md:text-6xl">{story.reveal.welcome}</p>
        <p className="mt-4 w-full text-lg italic text-white">{story.reveal.welcomeSub}</p>
        <span className={`mx-auto mt-5 block h-[3px] w-16 ${hot ? "bg-white" : "bg-[#E6007E]"}`} />
      </div>
      {story.reveal.images.map((photo) => (
        <StoryStill key={photo.id} photo={photo} onOpen={onOpen} />
      ))}
      <StoryVideo clip={story.reveal.video} />
    </section>
  );
}

function PeopleChapter({
  story,
  onOpen,
  reduce,
}: {
  story: RebuildStoryData;
  onOpen: (photo: RebuildImage) => void;
  reduce: boolean;
}) {
  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-12 text-center md:py-16">
        <motion.p
          className="w-full text-2xl tracking-[0.18em] text-white md:text-4xl"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {story.people.lead}
        </motion.p>
        <motion.h2
          className="mt-6 w-full text-4xl font-semibold leading-[1.02] tracking-tight md:text-7xl"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {story.people.title}
        </motion.h2>
        <motion.svg
          viewBox="0 0 360 28"
          className="mt-5 h-5 w-56 md:w-72"
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: reduce ? 0 : 0.7 }}
        >
          <motion.path
            d="M4 16 C 28 6, 48 24, 86 12 S 150 4, 198 16 S 280 8, 356 14"
            fill="none"
            stroke="#E6007E"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: reduce ? 0 : 0.85, ease: "easeOut" }}
          />
        </motion.svg>
        <motion.span
          className="mt-6 text-2xl text-[#E6007E]"
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: reduce ? 0 : 1.05, duration: 0.4 }}
        >
          <Heart />
        </motion.span>
      </div>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-5 pb-8 md:gap-14 md:px-8">
        {story.people.media.map((item, index) => (
          <motion.div
            key={item.id}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.7, delay: reduce ? 0 : Math.min(index, 2) * 0.05 }}
          >
            <MediaBlock item={item} onOpen={onOpen} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ThanksChapter({
  story,
  onOpen,
  hot = false,
}: {
  story: RebuildStoryData;
  onOpen: (photo: RebuildImage) => void;
  hot?: boolean;
}) {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-5 py-24 text-center md:px-8 md:py-32">
      <div className="w-full">
        <p
          className={`w-full text-[11px] font-semibold tracking-[0.22em] ${hot ? "text-white" : "text-[#E6007E]"}`}
        >
          {story.thanks.kicker}
        </p>
        <h2 className="mt-3 w-full text-5xl font-semibold tracking-tight md:text-7xl">{story.thanks.title}</h2>
        <div className="mt-8 w-full space-y-4 text-lg leading-relaxed text-white">
          {story.thanks.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-8 w-full text-base font-semibold">{story.thanks.sign}</p>
        <Image
          src={ASSETS.logo.white}
          alt="LeanMe"
          width={931}
          height={250}
          className="mx-auto mt-8 h-10 w-auto"
        />
      </div>
      <StoryStill photo={story.thanks.image} onOpen={onOpen} />
      <StoryStill photo={story.thanks.card} onOpen={onOpen} />
    </section>
  );
}

function MediaBlock({
  item,
  onOpen,
}: {
  item: RebuildMedia;
  onOpen: (photo: RebuildImage) => void;
}) {
  if (isClip(item)) return <StoryVideo clip={item} />;
  return <StoryStill photo={item} onOpen={onOpen} />;
}

function DownArrow({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3v16M6 13l6 8 6-8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Heart() {
  return (
    <svg width="28" height="26" viewBox="0 0 28 26" aria-hidden="true">
      <path
        d="M14 23 C 6 16, 2 12, 2 8 A 6 6 0 0 1 14 7 A 6 6 0 0 1 26 8 C 26 12, 22 16, 14 23 Z"
        fill="#E6007E"
      />
    </svg>
  );
}
