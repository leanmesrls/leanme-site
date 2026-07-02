import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/homepage/Icons";
import type { LeanAgent } from "@/types/content";

interface AgentCardProps {
  agent: LeanAgent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link
      href={`/staff-ibrido/lean-agent/${agent.slug}`}
      className="group overflow-hidden rounded-xl border border-white/10 bg-[#111111] transition hover:border-leanme-purple/40"
    >
      <div className="relative aspect-[3/4] w-full">
        <Image
          src={agent.cardImage.src}
          alt={agent.cardImage.alt}
          fill
          className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 1280px) 25vw, 220px"
        />
      </div>
      <div className="space-y-1 px-3 py-4 text-center">
        <p className="text-sm font-bold tracking-[0.08em] text-white">{agent.name}</p>
        <p className="min-h-[2.5rem] text-[11px] leading-snug text-white/60">
          {agent.specialty}
        </p>
        {agent.action && (
          <p
            className="pt-1 text-[11px] font-semibold tracking-[0.12em]"
            style={{ color: agent.actionColor ?? "#8016D2" }}
          >
            {agent.action}
          </p>
        )}
      </div>
    </Link>
  );
}

export function AgentCardCompact({ agent }: AgentCardProps) {
  return (
    <Link
      href={`/staff-ibrido/lean-agent/${agent.slug}`}
      className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#111111] p-3 transition hover:border-leanme-purple/40"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={agent.image.src}
          alt={agent.name}
          fill
          className="object-cover object-top"
          sizes="64px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold tracking-[0.08em] text-white">{agent.name}</p>
        <p className="text-xs text-white/60">{agent.role}</p>
        {agent.action && (
          <p
            className="text-[11px] font-semibold tracking-[0.12em]"
            style={{ color: agent.actionColor ?? "#8016D2" }}
          >
            {agent.action}
          </p>
        )}
      </div>
      <ArrowIcon className="shrink-0 text-white/50" />
    </Link>
  );
}
