import Image from "next/image";
import Link from "next/link";

import type {
  LeanLabArticleAsideModel,
  LeanLabAsideAction,
} from "@/lib/leanlab-aside";

function AsideLink({
  action,
  primary,
}: {
  action: LeanLabAsideAction;
  primary: boolean;
}) {
  const className = primary
    ? "inline-flex min-h-11 w-full items-center justify-center rounded-full bg-leanme-fuchsia px-4 text-center text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia"
    : "inline-flex min-h-11 w-full items-center justify-center rounded-full border border-leanme-fuchsia px-4 text-center text-sm font-semibold text-leanme-fuchsia transition hover:bg-leanme-fuchsia hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leanme-fuchsia";

  if (action.href.startsWith("/")) {
    return (
      <Link href={action.href} className={className}>
        {action.label}
      </Link>
    );
  }

  return (
    <a href={action.href} target="_blank" rel="noopener noreferrer" className={className}>
      {action.label}
    </a>
  );
}

export function LeanLabArticleAside({
  actions,
  related,
  relatedFooter,
}: LeanLabArticleAsideModel) {
  return (
    <aside aria-label="Contenuti utili" className="lg:sticky lg:top-24">
      {actions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {actions.map((item, index) => (
            <AsideLink key={item.href + item.label} action={item} primary={index === 0} />
          ))}
        </div>
      ) : null}
      {related.length > 0 ? (
        <div
          className={
            actions.length > 0
              ? "mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              : "rounded-2xl border border-white/10 bg-white/[0.04] p-4"
          }
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
            Contenuti attinenti
          </p>
          <ul className="mt-3 space-y-3">
            {related.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block overflow-hidden rounded-xl border border-white/10 transition hover:border-leanme-fuchsia"
                >
                  {item.imageSrc ? (
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt ?? ""}
                      width={1024}
                      height={433}
                      className="h-auto max-h-28 w-full object-cover object-top"
                    />
                  ) : null}
                  <span className="block px-3 py-3">
                    <span className="block text-sm font-semibold leading-snug text-white">
                      {item.title}
                    </span>
                    {item.kicker ? (
                      <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.08em] text-leanme-fuchsia">
                        {item.kicker}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {relatedFooter ? (
            <Link
              href={relatedFooter.href}
              className="mt-3 inline-block text-sm text-white/70 underline-offset-4 transition hover:text-white hover:underline"
            >
              {relatedFooter.label}
            </Link>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
