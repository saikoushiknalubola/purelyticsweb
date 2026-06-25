import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, Square } from "lucide-react";
import { toast } from "sonner";
import { durationHours, fmtHM, fmtTime } from "./_hooks";

interface Props {
  userId: string;
  onChange?: () => void;
}

export default function CheckInCard({ userId, onChange }: Props) {
  const [open, setOpen] = useState<{ id: string; check_in_at: string } | null>(null);
  const [tick, setTick] = useState(0);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("attendance_sessions")
      .select("id, check_in_at")
      .eq("user_id", userId)
      .is("check_out_at", null)
      .order("check_in_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setOpen(data ?? null);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!open) return;
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, [open]);

  const checkIn = async () => {
    setBusy(true);
    const { error } = await supabase.from("attendance_sessions").insert({ user_id: userId });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Checked in");
    await load();
    onChange?.();
  };

  const checkOut = async () => {
    if (!open) return;
    setBusy(true);
    const { error } = await supabase
      .from("attendance_sessions")
      .update({ check_out_at: new Date().toISOString() })
      .eq("id", open.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Checked out");
    await load();
    onChange?.();
  };

  const elapsed = open ? durationHours(open.check_in_at) : 0;
  void tick;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-muted-foreground">Today</div>
          <div className="font-serif text-xl">{new Date().toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}</div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${open ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}`}>
          {open ? "Checked in" : "Not checked in"}
        </div>
      </div>

      <div className="flex items-center gap-3 my-6">
        <Clock className="h-7 w-7 text-primary" />
        <div className="text-4xl font-serif tabular-nums">
          {open ? fmtHM(elapsed) : "0h 00m"}
        </div>
      </div>

      {open && (
        <div className="text-xs text-muted-foreground mb-4">
          Started at {fmtTime(open.check_in_at)}
        </div>
      )}

      {!open ? (
        <Button onClick={checkIn} disabled={busy} className="w-full" size="lg">
          <Play className="h-4 w-4 mr-2" /> Check in
        </Button>
      ) : (
        <Button onClick={checkOut} disabled={busy} variant="secondary" className="w-full" size="lg">
          <Square className="h-4 w-4 mr-2" /> Check out
        </Button>
      )}
    </Card>
  );
}