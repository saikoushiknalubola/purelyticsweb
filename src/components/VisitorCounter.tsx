import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "purelytics_visit_recorded";

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Only record one visit per browser session
      const already = sessionStorage.getItem(STORAGE_KEY);
      if (!already) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        await supabase.rpc("record_site_visit", {
          _path: window.location.pathname,
          _ua: navigator.userAgent.slice(0, 240),
        });
      }
      const { count: c } = await supabase
        .from("site_visits")
        .select("*", { count: "exact", head: true });
      if (!cancelled) setCount(c ?? 0);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs"
      style={{
        background: "hsl(var(--primary-foreground) / 0.08)",
        color: "hsl(var(--primary-foreground) / 0.8)",
      }}
      aria-label="Total site visits"
    >
      <Eye className="h-3.5 w-3.5" />
      <span className="font-medium tabular-nums">
        {count === null ? "—" : count.toLocaleString()}
      </span>
      <span className="opacity-70">visits</span>
    </div>
  );
}