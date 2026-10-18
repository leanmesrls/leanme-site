import { NextResponse } from "next/server";

import { getLeanLabArticles } from "@/lib/content";
import { listInterestVotes } from "@/lib/leanlab/interest-store";
import { getLeanHumanSessionFromCookies } from "@/lib/teresa-public/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  const ok = await getLeanHumanSessionFromCookies();
  if (!ok) {
    return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
  }

  const votes = await listInterestVotes();
  const articles = getLeanLabArticles().map((article) => {
    const mine = votes.filter((vote) => vote.slug === article.slug);
    const histogram = [0, 0, 0, 0, 0];
    for (const vote of mine) {
      if (vote.stars >= 1 && vote.stars <= 5) histogram[vote.stars - 1] += 1;
    }
    const count = mine.length;
    const average =
      count === 0
        ? 0
        : mine.reduce((sum, vote) => sum + vote.stars, 0) / count;
    const updatedAt = mine.reduce<string | null>((latest, vote) => {
      if (!latest || vote.updatedAt > latest) return vote.updatedAt;
      return latest;
    }, null);
    return {
      slug: article.slug,
      title: article.title,
      count,
      average,
      histogram,
      updatedAt,
    };
  });

  articles.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "");
  });

  return NextResponse.json({
    total: votes.length,
    articles,
  });
}
