"use client";

import { useEffect, useState } from "react";
import { adminListContactMessages } from "@/lib/api/admin";

export function AdminContactNavBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const load = () => {
      adminListContactMessages({ status: "new", limit: 1 })
        .then((res) => setCount(res.total))
        .catch(() => setCount(0));
    };
    load();
    const id = window.setInterval(load, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (count <= 0) return null;

  return (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-400 px-1.5 text-[10px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}
