import type { LeanLabArticleBodyTemplate } from "@/types/content";

import { NewsletterEpisodio00 } from "./articles/NewsletterEpisodio00";

interface LeanLabArticleBodyProps {
  template: LeanLabArticleBodyTemplate;
}

export function LeanLabArticleBody({ template }: LeanLabArticleBodyProps) {
  switch (template) {
    case "newsletter-episodio-00":
      return <NewsletterEpisodio00 />;
    default:
      return null;
  }
}
