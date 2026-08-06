export const LEONARDO_GUIDE_EVENT = "leonardo:guide";

export type LeonardoGuideTarget = {
  sectionId: string;
  actionId: string;
  message?: string;
};

export function dispatchLeonardoGuide(target: LeonardoGuideTarget) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<LeonardoGuideTarget>(LEONARDO_GUIDE_EVENT, {
      detail: target,
    })
  );
}
