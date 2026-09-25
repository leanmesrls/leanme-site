import type {
  LeanLabArticleBodyTemplate,
  LeanLabArticleCta,
} from "@/types/content";

import { NewsletterEpisodio00 } from "./articles/NewsletterEpisodio00";
import { NewsletterEpisodio01 } from "./articles/NewsletterEpisodio01";
import { NewsletterEpisodio02 } from "./articles/NewsletterEpisodio02";
import { NewsletterEpisodio03 } from "./articles/NewsletterEpisodio03";
import { NewsletterEpisodio04 } from "./articles/NewsletterEpisodio04";
import { NewsletterEpisodio05 } from "./articles/NewsletterEpisodio05";
import { NewsletterRicercaEpisodio01 } from "./articles/NewsletterRicercaEpisodio01";

interface LeanLabArticleBodyProps {
  template: LeanLabArticleBodyTemplate;
  cta?: LeanLabArticleCta;
  videoCta?: LeanLabArticleCta;
}

export function LeanLabArticleBody({
  template,
  cta,
  videoCta,
}: LeanLabArticleBodyProps) {
  switch (template) {
    case "newsletter-episodio-00":
      return <NewsletterEpisodio00 />;
    case "newsletter-episodio-01":
      return <NewsletterEpisodio01 cta={cta} videoCta={videoCta} />;
    case "newsletter-episodio-02":
      return <NewsletterEpisodio02 cta={cta} videoCta={videoCta} />;
    case "newsletter-episodio-03":
      return <NewsletterEpisodio03 cta={cta} videoCta={videoCta} />;
    case "newsletter-episodio-04":
      return <NewsletterEpisodio04 cta={cta} videoCta={videoCta} />;
    case "newsletter-episodio-05":
      return <NewsletterEpisodio05 cta={cta} videoCta={videoCta} />;
    case "newsletter-ricerca-episodio-01":
      return <NewsletterRicercaEpisodio01 />;
    default:
      return null;
  }
}
