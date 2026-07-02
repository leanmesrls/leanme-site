import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { formatDate } from "@/lib/utils";
import type { LeanLabArticle } from "@/types/content";

interface ArticleCardProps {
  article: LeanLabArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card href={`/leanlab/articolo/${article.slug}`} className="h-full">
      <PlaceholderImage
        image={article.image}
        aspectRatio="video"
        className="rounded-none border-none"
      />
      <div className="p-6">
        <Badge>{article.category.replace(/-/g, " ")}</Badge>
        <h3 className="mt-4 text-xl font-semibold">{article.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-leanme-gray-600">
          {article.excerpt}
        </p>
        <p className="mt-4 text-xs text-leanme-gray-400">
          {formatDate(article.date)} · {article.readTime}
        </p>
      </div>
    </Card>
  );
}
