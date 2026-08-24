import type {
  LeanLabArticleBodyTemplate,
  LeanLabArticleCta,
} from "@/types/content";

import { NewsletterEpisodio00 } from "./articles/NewsletterEpisodio00";
import { NewsletterEpisodio01 } from "./articles/NewsletterEpisodio01";

interface LeanLabArticleBodyProps {
  template: LeanLabArticleBodyTemplate;
  cta?: LeanLabArticleCta;
}

export function LeanLabArticleBody({ template, cta }: LeanLabArticleBodyProps) {
  switch (template) {
    case "newsletter-episodio-00":
      return <NewsletterEpisodio00 />;
    case "newsletter-episodio-01":
      return <NewsletterEpisodio01 cta={cta} />;
    default:
      return null;
  }
}
