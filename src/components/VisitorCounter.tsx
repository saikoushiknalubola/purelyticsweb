import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "purelytics_visit_recorded";

type State =
  | { status: "loading" }
  | { status: "ready"; count: number }
  | { status: "offline" }
  | { status: "error" };

export function VisitorCounter() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        if (!cancelled) setState({ status: "offline" });
        return;
      }
      try {
        // Only record one visit per browser session
        const already = sessionStorage.getItem(STORAGE_KEY);
        if (!already) {
          sessionStorage.setItem(STORAGE_KEY, "1");
          await supabase.rpc("record_site_visit", {
            _path: window.location.pathname,
            _ua: navigator.userAgent.slice(0, 240),
          });
        }
        const { count, error } = await supabase
          .from("site_visits")
          .select("*", { count: "exact", head: true });
        if (cancelled) return;
        if (error) {
          setState({ status: "error" });
          return;
        }
        setState({ status: "ready", count: count ?? 0 });
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    };

    load();

    const onOnline = () => load();
    const onOffline = () => setState({ status: "offline" });
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      cancelled = true;
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const baseCls =
    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-opacity";
  const style = {
    background: "hsl(var(--primary-foreground) / 0.08)",
    color: "hsl(var(--primary-foreground) / 0.8)",
  } as const;

  if (state.status === "loading") {
    return (
      <div
        className={baseCls}
        style={style}
        role="status"
        aria-live="polite"
        aria-label="Loading visitor count"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="opacity-70">counting visits…</span>
      </div>
    );
  }

  if (state.status === "offline") {
    return (
      <div className={baseCls} style={style} aria-label="Visitor count unavailable — offline">
        <EyeOff className="h-3.5 w-3.5" />
        <span className="opacity-70">offline</span>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className={baseCls} style={style} aria-label="Visitor count temporarily unavailable">
        <EyeOff className="h-3.5 w-3.5" />
        <span className="opacity-70">count unavailable</span>
      </div>
    );
  }

  return (
    <div
      className={baseCls + " animate-in fade-in duration-500"}
      style={style}
      aria-label={`${state.count.toLocaleString()} total site visits`}
    >
      <Eye className="h-3.5 w-3.5" />
      <span className="font-medium tabular-nums">{state.count.toLocaleString()}</span>
      <span className="opacity-70">visits</span>
    </div>
  );
}