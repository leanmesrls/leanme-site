interface AudioPlayerProps {
  src: string;
  label: string;
}

/** Player nativo. Il testo della pagina resta l'alternativa alla registrazione. */
export function AudioPlayer({ src, label }: AudioPlayerProps) {
  return (
    <figure className="rounded-xl border border-white/10 bg-[#111111] p-5 md:p-6">
      <figcaption className="text-sm font-semibold leading-relaxed text-white">
        {label}
      </figcaption>
      <audio controls preload="metadata" src={src} className="mt-4 w-full">
        <a href={src}>Scarica la registrazione</a>
      </audio>
    </figure>
  );
}
