/** Etichette categoria: testo colorato su fondo quasi nero, leggibile sul grigio. */
export const leanLabCategoryBadge: Record<
  string,
  { chip: string; bar: string }
> = {
  "progetti-conclusi": {
    chip: "bg-[#0c0614] text-[#c4b5fd] ring-1 ring-[#7c4dff]/80",
    bar: "bg-[#7c4dff]",
  },
  "ricerca-e-innovazione": {
    chip: "bg-[#041018] text-[#8adfff] ring-1 ring-[#3ec6ff]/80",
    bar: "bg-[#3ec6ff]",
  },
  "vita-in-leanme": {
    chip: "bg-[#14060e] text-[#ff5aa8] ring-1 ring-[#e6007e]/80",
    bar: "bg-[#e6007e]",
  },
};

const chipClass =
  "inline-flex items-center rounded-full px-2.5 py-1 font-semibold uppercase tracking-[0.12em]";

export function categoryBadgeClass(
  category: string | undefined,
  size = "text-[10px]"
): string {
  const badge = category ? leanLabCategoryBadge[category] : undefined;
  return `${chipClass} ${size} ${badge?.chip ?? "bg-black text-white ring-1 ring-white/25"}`;
}

export function categoryBadgeFromLabel(label: string | undefined): string {
  const value = label?.toLowerCase() ?? "";
  if (value.includes("progett")) return categoryBadgeClass("progetti-conclusi");
  if (value.includes("ricerca")) return categoryBadgeClass("ricerca-e-innovazione");
  if (value.includes("vita")) return categoryBadgeClass("vita-in-leanme");
  return categoryBadgeClass(undefined);
}
