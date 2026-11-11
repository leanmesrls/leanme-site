import storyData from "@/data/rebuild-100.json";

export type RebuildPlace = "full" | "left" | "right" | "detail";

export type RebuildImage = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  word?: string;
  place?: RebuildPlace;
  hidden?: boolean;
};

export type RebuildClip = {
  id: string;
  type: "video";
  src: string;
  poster: string;
  alt: string;
  width: number;
  height: number;
  word?: string;
  hidden?: boolean;
};

export type RebuildMedia = RebuildImage | RebuildClip;

export type RebuildStory = {
  audio: {
    src: string;
    playLabel: string;
    subtitle: string;
  };
  opening: {
    title: string;
    steps: number[];
    line: string;
    subtitle: string;
    scroll: string;
  };
  before: {
    index: string;
    title: string;
    text: string;
    images: RebuildImage[];
  };
  making: {
    index: string;
    title: string;
    ideas: string;
    media: RebuildMedia[];
  };
  reveal: {
    index: string;
    title: string;
    compareLabel: string;
    before: RebuildImage;
    after: RebuildImage;
    welcome: string;
    welcomeSub: string;
    images: RebuildImage[];
    video: RebuildClip;
  };
  people: {
    lead: string;
    title: string;
    media: RebuildMedia[];
  };
  thanks: {
    kicker: string;
    title: string;
    image: RebuildImage;
    paragraphs: string[];
    sign: string;
    card: RebuildImage;
  };
};

function shown<T extends { hidden?: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.hidden !== true);
}

export function isClip(item: RebuildMedia): item is RebuildClip {
  return "type" in item && item.type === "video";
}

export function getRebuildStory(): RebuildStory {
  const story = storyData as RebuildStory;
  return {
    ...story,
    before: { ...story.before, images: shown(story.before.images) },
    making: { ...story.making, media: shown(story.making.media) },
    reveal: { ...story.reveal, images: shown(story.reveal.images) },
    people: { ...story.people, media: shown(story.people.media) },
  };
}

export function collectStoryImages(story: RebuildStory): RebuildImage[] {
  const images: RebuildImage[] = [
    ...story.before.images,
    ...story.making.media.filter((item): item is RebuildImage => !isClip(item)),
    story.reveal.before,
    story.reveal.after,
    ...story.reveal.images,
    ...story.people.media.filter((item): item is RebuildImage => !isClip(item)),
    story.thanks.image,
    story.thanks.card,
  ];
  return images.filter((item) => item.hidden !== true);
}
