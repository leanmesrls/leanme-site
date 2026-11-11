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
    <p className="mt-8 text-sm font-semibold tracking-[0.12em] text-white">
      <span className="tabular-nums">{total}</span> persone sono entrate
    </p>
  );
}
