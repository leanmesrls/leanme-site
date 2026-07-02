"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/homepage/Icons";
import { SectionTitle } from "@/components/homepage/SectionTitle";
import type { HomepageData } from "@/types/homepage";

interface LeanAgentAiSectionProps {
  data: HomepageData["leanAgentAi"];
}

export function LeanAgentAiSection({ data }: LeanAgentAiSectionProps) {
  return (
    <section className="bg-black px-5 py-16 md:px-10 md:py-24 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <SectionTitle>{data.title}</SectionTitle>

        <div className="mt-12 hidden gap-3 lg:grid lg:grid-cols-7">
          {data.agents.map((agent) => (
            <Link
              key={agent.slug}
              href={agent.href}
              className="group overflow-hidden rounded-xl border border-white/10 bg-[#111111] transition hover:border-leanme-purple/40"
            >
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={agent.image}
                  alt={agent.name}
                  fill
                  className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 1280px) 14vw, 160px"
                />
              </div>
              <div className="space-y-1 px-3 py-4 text-center">
                <p className="text-sm font-bold tracking-[0.08em] text-white">
                  {agent.name}
                </p>
                <p className="min-h-[2.5rem] text-[11px] leading-snug text-white/60">
                  {agent.role}
                </p>
                <p
                  className="pt-1 text-[11px] font-semibold tracking-[0.12em]"
                  style={{ color: agent.actionColor }}
                >
                  {agent.action}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 space-y-3 lg:hidden">
          {data.agents.map((agent) => (
            <Link
              key={agent.slug}
              href={agent.href}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#111111] p-3 transition hover:border-leanme-purple/40"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={agent.image}
                  alt={agent.name}
                  fill
                  className="object-cover object-top"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold tracking-[0.08em] text-white">
                  {agent.name}
                </p>
                <p className="text-xs text-white/60">{agent.role}</p>
                <p
                  className="text-[11px] font-semibold tracking-[0.12em]"
                  style={{ color: agent.actionColor }}
                >
                  {agent.action}
                </p>
              </div>
              <ArrowIcon className="shrink-0 text-white/50" />
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={data.footerLink.href}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-leanme-purple transition hover:text-white md:text-sm"
          >
            {data.footerLink.label}
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
