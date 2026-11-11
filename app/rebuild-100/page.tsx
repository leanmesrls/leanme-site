import { JsonLd } from "@/components/seo/JsonLd";
import { RebuildStory, RestartButton } from "@/components/rebuild/RebuildStory";
import { SoundProvider } from "@/components/rebuild/SoundProvider";
import { createPageMetadata, SITE_URL } from "@/lib/metadata";
import { getRebuildStory } from "@/lib/rebuild";

const title = "REBUILD 100% | Le idee hanno trovato casa — LeanMe";
const description =
  "Dall'idea alla realtà. Scopri la trasformazione della nuova sede LeanMe a Bologna e rivivi i momenti dell'inaugurazione dell'8 novembre 2026.";

export const metadata = createPageMetadata({
  title,
  description,
  path: "/rebuild-100",
  image: "/rebuild/og.jpg",
  keywords: [
    "REBUILD 100%",
    "LeanMe",
    "Open Innovation Hub",
    "Bologna",
    "nuova sede",
    "inaugurazione",
  ],
});

export default function Rebuild100Page() {
  const story = getRebuildStory();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: "REBUILD 100% — Inaugurazione della sede LeanMe",
          description,
          startDate: "2026-11-08",
          endDate: "2026-11-08",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          image: `${SITE_URL}/rebuild/og.jpg`,
          url: `${SITE_URL}/rebuild-100`,
          location: {
            "@type": "Place",
            name: "LeanMe Open Innovation Hub",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Via Porrettana 148/2/C",
              addressLocality: "Bologna",
              postalCode: "40135",
              addressCountry: "IT",
            },
          },
          organizer: {
            "@id": `${SITE_URL}/#organization`,
          },
        }}
      />
      <SoundProvider
        src={story.audio.src}
        playLabel={story.audio.playLabel}
        subtitle={story.audio.subtitle}
      >
        <RebuildStory story={story} />
      </SoundProvider>
      <section className="bg-[#050505] px-5 pb-36 pr-12 text-center md:pr-16">
        <RestartButton />
      </section>
    </>
  );
}
