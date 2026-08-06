"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { dispatchLeonardoGuide } from "@/lib/segreteria/guide";
import type { SegreteriaAction, SegreteriaData } from "@/types/segreteria";

type WhoTarget =
  | { kind: "company"; sectionId: string; label: string }
  | { kind: "person"; sectionId: string; label: string }
  | { kind: "staff"; sectionId: string; label: string };

interface LeonardoGuideProps {
  guide: SegreteriaData["leonardo"]["guide"];
  companySectionId: string;
  companyLabel: string;
  companyActions: SegreteriaAction[];
  people: Array<{
    slug: string;
    name: string;
    actions: SegreteriaAction[];
  }>;
  staff: {
    sectionId: string;
    label: string;
    actionLabel: string;
    actionId: string;
  };
}

type Step = 1 | 2 | 3;

export function LeonardoGuide({
  guide,
  companySectionId,
  companyLabel,
  companyActions,
  people,
  staff,
}: LeonardoGuideProps) {
  const [step, setStep] = useState<Step>(1);
  const [who, setWho] = useState<WhoTarget | null>(null);
  const [action, setAction] = useState<SegreteriaAction | null>(null);
  const [doneMessage, setDoneMessage] = useState<string | null>(null);

  const whoOptions = useMemo<WhoTarget[]>(
    () => [
      { kind: "company", sectionId: companySectionId, label: companyLabel },
      ...people.map((person) => ({
        kind: "person" as const,
        sectionId: person.slug,
        label: person.name,
      })),
      {
        kind: "staff",
        sectionId: staff.sectionId,
        label: staff.label,
      },
    ],
    [companyLabel, companySectionId, people, staff.label, staff.sectionId]
  );

  const actionOptions = useMemo(() => {
    if (!who) return [] as Array<{ id: string; label: string; action?: SegreteriaAction }>;

    if (who.kind === "company") {
      return companyActions.map((item) => ({
        id: item.id,
        label: item.label,
        action: item,
      }));
    }

    if (who.kind === "person") {
      const person = people.find((item) => item.slug === who.sectionId);
      return (person?.actions ?? []).map((item) => ({
        id: item.id,
        label: item.label,
        action: item,
      }));
    }

    return [
      {
        id: staff.actionId,
        label: staff.actionLabel,
      },
    ];
  }, [companyActions, people, staff.actionId, staff.actionLabel, who]);

  const reset = () => {
    setStep(1);
    setWho(null);
    setAction(null);
    setDoneMessage(null);
  };

  const goToAction = () => {
    if (!who || !action) return;

    dispatchLeonardoGuide({
      sectionId: who.sectionId,
      actionId: action.id,
      message: guide.doneMessage,
    });
    setDoneMessage(guide.doneMessage);
  };

  return (
    <div className="mt-5 rounded-xl border border-leanme-fuchsia/30 bg-leanme-fuchsia/[0.07] p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-leanme-fuchsia">
          {guide.title}
        </p>
        <p className="text-[11px] text-white/40">Passo {step} di 3</p>
      </div>

      {step === 1 && (
        <div className="mt-3">
          <p className="text-sm text-white/80">{guide.step1Question}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {whoOptions.map((option) => (
              <button
                key={option.sectionId}
                type="button"
                onClick={() => {
                  setWho(option);
                  setAction(null);
                  setDoneMessage(null);
                  setStep(2);
                }}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-left text-sm text-white transition hover:border-leanme-fuchsia/50 hover:bg-white/10"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && who && (
        <div className="mt-3">
          <p className="text-sm text-white/80">{guide.step2Question}</p>
          <p className="mt-1 text-xs text-white/45">{who.label}</p>
          <div className="mt-3 grid gap-2">
            {actionOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setAction({
                    id: option.id as SegreteriaAction["id"],
                    label: option.label,
                    href: option.action?.href ?? "#",
                    variant: option.action?.variant,
                    download: option.action?.download,
                    external: option.action?.external,
                  });
                  setDoneMessage(null);
                  setStep(3);
                }}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-left text-sm text-white transition hover:border-leanme-fuchsia/50 hover:bg-white/10"
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setStep(1);
              setWho(null);
              setAction(null);
            }}
            className="mt-3 text-xs text-white/50 transition hover:text-leanme-fuchsia"
          >
            {guide.backLabel}
          </button>
        </div>
      )}

      {step === 3 && who && action && (
        <div className="mt-3">
          <p className="text-sm text-white/80">{guide.step3Question}</p>
          <p className="mt-2 text-sm text-white/70">
            {guide.confirmPrefix}{" "}
            <span className="font-medium text-white">
              {action.label}
            </span>{" "}
            · {who.label}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={goToAction}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-leanme-fuchsia px-5 py-2.5 text-sm font-medium text-white transition hover:bg-leanme-fuchsia/90"
            >
              {guide.confirmLabel}
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 transition hover:border-leanme-fuchsia/40"
            >
              {guide.backLabel}
            </button>
          </div>
          {doneMessage && (
            <p
              role="status"
              className="mt-3 rounded-lg border border-leanme-fuchsia/30 bg-black/40 px-3 py-2 text-sm text-white/80"
            >
              {doneMessage}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            className={cn(
              "mt-3 text-xs text-white/50 transition hover:text-leanme-fuchsia"
            )}
          >
            {guide.restartLabel}
          </button>
        </div>
      )}
    </div>
  );
}
