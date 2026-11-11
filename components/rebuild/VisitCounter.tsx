"use client";

import { useEffect, useState } from "react";

const REBUILD_VISIT_BASE = 184;

export function VisitCounter() {
  const [total, setTotal] = useState(REBUILD_VISIT_BASE);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/rebuild-visits", { method: "POST", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { total?: unknown } | null) => {
        if (typeof data?.total === "number" && data.total >= REBUILD_VISIT_BASE) {
          setTotal(Math.floor(data.total));
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  return (
    <p className="fixed right-3 top-3 z-30 w-36 bg-[#050505]/85 px-2 py-1 text-right text-[11px] font-semibold leading-snug text-white md:w-auto md:text-xs">
      <span className="tabular-nums">{total}</span> persone hanno visitato questa pagina
    </p>
  );
}
