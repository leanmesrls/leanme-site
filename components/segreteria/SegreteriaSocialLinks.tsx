import { Icon } from "@/components/ui/Icon";
import type { SocialLink } from "@/types/content";

interface SegreteriaSocialLinksProps {
  social: SocialLink[];
  title?: string;
}

export function SegreteriaSocialLinks({
  social,
  title = "Social",
}: SegreteriaSocialLinksProps) {
  if (!social.length) return null;

  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
        {title}
      </h3>
      <ul className="mt-2 flex flex-wrap gap-3">
        {social.map((item) => (
          <li key={item.platform}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/75 transition hover:text-leanme-fuchsia"
            >
              <Icon name={item.platform} className="h-4 w-4" />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
