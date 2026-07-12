import { useEffect, useState } from "react";
import { Users, WifiOff, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "purelytics_visit_recorded_v2";

type State =
  | { status: "loading" }
  | { status: "ready"; count: number }
  | { status: "offline" }
  | { status: "error" };

export function VisitorCounter() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    const fetchCount = async () => {
      const { count, error } = await supabase
        .from("site_visits")
        .select("*", { count: "exact", head: true });
      if (cancelled) return;
      if (error) {
        setState({ status: "error" });
        return;
      }
      setState({ status: "ready", count: count ?? 0 });
    };

    const load = async () => {
      if (typeof navigator !== "undefined" && navigator.onLine === false) {
        if (!cancelled) setState({ status: "offline" });
        return;
      }
      try {
        const already = sessionStorage.getItem(STORAGE_KEY);
        if (!already) {
          sessionStorage.setItem(STORAGE_KEY, "1");
          await supabase.rpc("record_site_visit", {
            _path: window.location.pathname,
            _ua: navigator.userAgent.slice(0, 240),
          });
        }
        await fetchCount();
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    };

    load();

    const onOnline = () => load();
    const onOffline = () => setState({ status: "offline" });
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    // Refresh count periodically so the number stays live without flicker.
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible" && navigator.onLine !== false) {
        fetchCount();
      }
    }, 30000);

    return () => {
      cancelled = true;
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.clearInterval(interval);
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
        aria-label="Loading verified visitor count"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span className="opacity-70">loading visits…</span>
      </div>
    );
  }

  if (state.status === "offline") {
    return (
      <div className={baseCls} style={style} aria-label="Visitor count unavailable — you are offline">
        <WifiOff className="h-3.5 w-3.5" />
        <span className="opacity-70">visits unavailable offline</span>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className={baseCls} style={style} aria-label="Visitor count temporarily unavailable">
        <AlertCircle className="h-3.5 w-3.5" />
        <span className="opacity-70">visits unavailable</span>
      </div>
    );
  }

  return (
    <div
      className={baseCls + " animate-in fade-in duration-500"}
      style={style}
      aria-label={`${state.count.toLocaleString()} verified site visits`}
      title="Verified visits recorded by our backend"
    >
      <Users className="h-3.5 w-3.5" />
      <span className="font-medium tabular-nums">{state.count.toLocaleString()}</span>
      <span className="opacity-70">verified visits</span>
    </div>
  );
}