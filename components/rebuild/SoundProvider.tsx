"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import styles from "@/components/rebuild/story.module.css";

type SoundContextValue = {
  playing: boolean;
  ducked: boolean;
  volume: number;
  toggle: () => void;
  setVolume: (value: number) => void;
  setVideoAudio: (on: boolean) => void;
  analyserRef: RefObject<AnalyserNode | null>;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function useSound() {
  const value = useContext(SoundContext);
  if (!value) {
    throw new Error("useSound deve stare dentro SoundProvider");
  }
  return value;
}

export function SoundProvider({
  src,
  playLabel,
  subtitle,
  children,
}: {
  src: string;
  playLabel: string;
  subtitle: string;
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const wantedRef = useRef(false);
  const videoCountRef = useRef(0);
  const volumeRef = useRef(0.8);
  const startedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [ducked, setDucked] = useState(false);
  const [volume, setVolumeState] = useState(0.8);

  const ensureGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return null;
    if (contextRef.current && gainRef.current) return contextRef.current;
    const context = new AudioContext();
    const source = context.createMediaElementSource(audio);
    const analyser = context.createAnalyser();
    const gain = context.createGain();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyser.connect(gain);
    gain.connect(context.destination);
    gain.gain.setValueAtTime(0, context.currentTime);
    contextRef.current = context;
    analyserRef.current = analyser;
    gainRef.current = gain;
    return context;
  }, []);

  const fadeTo = useCallback((value: number, seconds: number) => {
    const context = contextRef.current;
    const gain = gainRef.current;
    if (!context || !gain) return;
    const now = context.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(value, now + seconds);
  }, []);

  const start = useCallback(
    async (initial: boolean) => {
      const audio = audioRef.current;
      const context = ensureGraph();
      if (!audio || !context) return;
      if (videoCountRef.current > 0) return;
      await context.resume();
      fadeTo(volumeRef.current, initial ? 1.4 : 0.35);
      try {
        await audio.play();
        setPlaying(true);
        setDucked(false);
        startedRef.current = true;
      } catch {
        setPlaying(false);
        wantedRef.current = false;
      }
    },
    [ensureGraph, fadeTo],
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || videoCountRef.current > 0) return;
    if (!audio.paused) {
      audio.pause();
      wantedRef.current = false;
      setPlaying(false);
      return;
    }
    wantedRef.current = true;
    void start(!startedRef.current);
  }, [start]);

  const setVolume = useCallback(
    (value: number) => {
      const next = Math.min(1, Math.max(0, value));
      volumeRef.current = next;
      setVolumeState(next);
      if (playing) fadeTo(next, 0.05);
    },
    [fadeTo, playing],
  );

  const setVideoAudio = useCallback(
    (on: boolean) => {
      const audio = audioRef.current;
      videoCountRef.current = Math.max(0, videoCountRef.current + (on ? 1 : -1));
      if (!audio) return;
      if (videoCountRef.current > 0) {
        if (!audio.paused) {
          audio.pause();
          setPlaying(false);
          setDucked(true);
        }
        return;
      }
      setDucked(false);
      if (wantedRef.current) void start(false);
    },
    [start],
  );

  const api: SoundContextValue = {
    playing,
    ducked,
    volume,
    toggle,
    setVolume,
    setVideoAudio,
    analyserRef,
  };

  return (
    <SoundContext.Provider value={api}>
      {children}
      <audio ref={audioRef} src={src} loop preload="none" />
      <StoryPlayer playLabel={playLabel} subtitle={subtitle} />
    </SoundContext.Provider>
  );
}

function StoryPlayer({
  playLabel,
  subtitle,
}: {
  playLabel: string;
  subtitle: string;
}) {
  const { playing, volume, toggle, setVolume, analyserRef } = useSound();
  const barsRef = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const bars = barsRef.current;
    const paint = (heights: number[]) => {
      heights.forEach((height, index) => {
        const bar = bars[index];
        if (bar) bar.style.transform = `scaleY(${height})`;
      });
    };

    if (!playing) {
      paint([0.2, 0.2, 0.2, 0.2, 0.2]);
      return;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      paint([0.45, 0.7, 0.55, 0.8, 0.4]);
      return;
    }

    const data = new Uint8Array(32);
    let frame = 0;
    const tick = () => {
      const analyser = analyserRef.current;
      if (analyser) {
        analyser.getByteFrequencyData(data);
        const bins = [2, 5, 9, 13, 18];
        paint(
          bins.map((bin) => {
            const level = data[bin] / 255;
            return 0.18 + level * 0.82;
          }),
        );
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [analyserRef, playing]);

  if (!playing) {
    return (
      <button
        type="button"
        onClick={toggle}
        className={`${styles.playCall} fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[min(calc(100vw-2rem),26rem)] -translate-x-1/2 items-center justify-center gap-4 border-2 border-white bg-[#E6007E] px-4 py-3 text-center text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
        aria-label={playLabel}
      >
        <span className="flex h-16 w-16 shrink-0 items-center justify-center bg-white text-[#E6007E]">
          <PlayIcon />
        </span>
        <span className="min-w-0 text-center">
          <span className="block text-sm font-semibold tracking-[0.14em] md:text-base">
            {playLabel}
          </span>
          <span className="mt-0.5 block text-xs text-white md:text-sm">{subtitle}</span>
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex items-center gap-3 border border-[#E6007E] bg-[#050505] px-3 py-2.5 md:inset-x-auto md:right-16 md:w-[22rem]">
      <button
        type="button"
        onClick={toggle}
        aria-pressed="true"
        aria-label="Metti in pausa la colonna sonora"
        className="flex h-12 w-12 shrink-0 items-center justify-center text-[#E6007E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E6007E]"
      >
        <PauseIcon />
      </button>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[11px] font-semibold tracking-[0.16em] text-white">
          REBUILD 100%
        </span>
        <span className="block truncate text-[11px] text-white/60">{subtitle}</span>
      </span>
      <Bars barsRef={barsRef} />
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        aria-label="Volume"
        onChange={(event) => setVolume(Number(event.target.value))}
        className="h-11 w-16 accent-[#E6007E] md:w-20"
      />
    </div>
  );
}

function Bars({
  barsRef,
  light = false,
}: {
  barsRef: { current: Array<HTMLSpanElement | null> };
  light?: boolean;
}) {
  return (
    <span className="flex h-7 shrink-0 items-end gap-1" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          ref={(node) => {
            barsRef.current[index] = node;
          }}
          className={`block w-1 origin-bottom ${light ? "bg-white" : "bg-[#E6007E]"}`}
          style={{ height: "100%", transform: "scaleY(0.2)" }}
        />
      ))}
    </span>
  );
}

function PlayIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M4.5 2.5v13l11-6.5-11-6.5z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M5 3h3v12H5V3zm5 0h3v12h-3V3z" fill="currentColor" />
    </svg>
  );
}
