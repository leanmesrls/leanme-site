"use client";

import { useEffect } from "react";
import {
  LEONARDO_GUIDE_EVENT,
  type LeonardoGuideTarget,
} from "@/lib/segreteria/guide";

const HIGHLIGHT_MS = 6000;

export function LeonardoGuideListener() {
  useEffect(() => {
    let timer: number | undefined;

    const clearHighlights = () => {
      document
        .querySelectorAll("[data-leonardo-highlight='true']")
        .forEach((el) => {
          el.removeAttribute("data-leonardo-highlight");
        });
    };

    const onGuide = (event: Event) => {
      const detail = (event as CustomEvent<LeonardoGuideTarget>).detail;
      if (!detail?.sectionId || !detail?.actionId) return;

      clearHighlights();
      if (timer) window.clearTimeout(timer);

      const section = document.getElementById(detail.sectionId);
      const action = document.querySelector<HTMLElement>(
        `[data-leonardo-section="${detail.sectionId}"] [data-leonardo-action="${detail.actionId}"]`
      );

      const scrollTarget = action ?? section;
      scrollTarget?.scrollIntoView({ behavior: "smooth", block: "center" });

      if (action) {
        // Attendi lo scroll, poi avvia la pulsazione ben visibile.
        timer = window.setTimeout(() => {
          action.setAttribute("data-leonardo-highlight", "true");
          action.focus({ preventScroll: true });
          timer = window.setTimeout(clearHighlights, HIGHLIGHT_MS);
        }, 450);
      }
    };

    window.addEventListener(LEONARDO_GUIDE_EVENT, onGuide);
    return () => {
      window.removeEventListener(LEONARDO_GUIDE_EVENT, onGuide);
      if (timer) window.clearTimeout(timer);
      clearHighlights();
    };
  }, []);

  return null;
}
