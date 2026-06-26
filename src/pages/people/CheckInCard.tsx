import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Square, Coffee, PlayCircle, MapPin, Home, Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { durationHours, fmtHM, fmtTime } from "./_hooks";

interface Props {
  userId: string;
  onChange?: () => void;
}

interface OpenSession {
  id: string;
  check_in_at: string;
  work_mode: string | null;
  notes: string | null;
}
interface OpenBreak { id: string; break_start: string; reason: string | null }

export default function CheckInCard({ userId, onChange }: Props) {
  const [session, setSession] = useState<OpenSession | null>(null);
  const [openBreak, setOpenBreak] = useState<OpenBreak | null>(null);
  const [breaksToday, setBreaksToday] = useState<{ break_start: string; break_end: string | null }[]>([]);
  const [, setTick] = useState(0);
  const [busy, setBusy] = useState(false);
  const [workMode, setWorkMode] = useState<"office" | "remote" | "hybrid">("office");
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    const { data: s } = await supabase
      .from("attendance_sessions")
      .select("id, check_in_at, work_mode, notes")
      .eq("user_id", userId)
      .is("check_out_at", null)
      .order("check_in_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setSession((s as any) ?? null);
    if (s) {
      setWorkMode(((s as any).work_mode as any) ?? "office");
      setNotes((s as any).notes ?? "");
      const { data: b } = await supabase
        .from("attendance_breaks")
        .select("id, break_start, break_end, reason")
        .eq("session_id", (s as any).id)
        .order("break_start", { ascending: false });
      const ob = (b ?? []).find((x: any) => !x.break_end) ?? null;
      setOpenBreak(ob as any);
      setBreaksToday(((b ?? []) as any).map((x: any) => ({ break_start: x.break_start, break_end: x.break_end })));
    } else {
      setOpenBreak(null);
      setBreaksToday([]);
      setNotes("");
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!session) return;
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, [session]);

  const checkIn = async () => {
    setBusy(true);
    const { error } = await supabase
      .from("attendance_sessions")
      .insert({ user_id: userId, work_mode: workMode });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Checked in — have a great day");
    await load();
    onChange?.();
  };

  const checkOut = async () => {
    if (!session) return;
    if (openBreak) {
      toast.error("End your break before checking out");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("attendance_sessions")
      .update({ check_out_at: new Date().toISOString(), notes: notes || null })
      .eq("id", session.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Checked out — see you tomorrow");
    await load();
    onChange?.();
  };

  const startBreak = async () => {
    if (!session) return;
    setBusy(true);
    const { error } = await supabase
      .from("attendance_breaks")
      .insert({ session_id: session.id, user_id: userId });
    setBusy(false);
    if (error) return toast.error(error.message);
    await load();
  };

  const endBreak = async () => {
    if (!openBreak) return;
    setBusy(true);
    const { error } = await supabase
      .from("attendance_breaks")
      .update({ break_end: new Date().toISOString() })
      .eq("id", openBreak.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    await load();
  };

  const updateWorkMode = async (v: "office" | "remote" | "hybrid") => {
    setWorkMode(v);
    if (!session) return;
    await supabase.from("attendance_sessions").update({ work_mode: v }).eq("id", session.id);
  };

  // Time math
  const grossH = session ? durationHours(session.check_in_at) : 0;
  const breakH = breaksToday.reduce((acc, b) => acc + durationHours(b.break_start, b.break_end ?? undefined), 0);
  const netH = Math.max(0, grossH - breakH);
  const breakNowH = openBreak ? durationHours(openBreak.break_start) : 0;

  const modeIcon = workMode === "remote" ? Home : workMode === "hybrid" ? MapPin : Building2;
  const ModeIcon = modeIcon;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-muted-foreground">Today</div>
          <div className="font-serif text-xl">{new Date().toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}</div>
        </div>
        <Badge variant={session ? "default" : "secondary"} className="rounded-full">
          {openBreak ? "On break" : session ? "Working" : "Not checked in"}
        </Badge>
      </div>

      <div className="flex items-end gap-3 my-5">
        <Clock className="h-7 w-7 text-primary mb-1.5" />
        <div>
          <div className="text-4xl font-serif tabular-nums leading-none">
            {session ? fmtHM(netH) : "0h 00m"}
          </div>
          {session && (
            <div className="text-xs text-muted-foreground mt-2 flex gap-3">
              <span>In {fmtTime(session.check_in_at)}</span>
              <span>Break {fmtHM(breakH + (openBreak ? breakNowH : 0))}</span>
            </div>
          )}
        </div>
      </div>

      {/* Work mode */}
      <div className="mb-4">
        <div className="text-xs text-muted-foreground mb-1.5">Work mode</div>
        <Select value={workMode} onValueChange={(v: any) => updateWorkMode(v)}>
          <SelectTrigger className="h-9">
            <ModeIcon className="h-4 w-4 mr-2 text-primary" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="office">In office</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="hybrid">Hybrid / Field</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {session && (
        <div className="mb-4">
          <div className="text-xs text-muted-foreground mb-1.5">Today's note</div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={async () => {
              if (!session) return;
              await supabase.from("attendance_sessions").update({ notes: notes || null }).eq("id", session.id);
            }}
            placeholder="What are you focusing on today?"
            rows={2}
            className="resize-none"
          />
        </div>
      )}

      <div className="grid gap-2">
        {!session ? (
          <Button onClick={checkIn} disabled={busy} className="w-full" size="lg">
            {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
            Check in
          </Button>
        ) : (
          <>
            {openBreak ? (
              <Button onClick={endBreak} disabled={busy} className="w-full" size="lg" variant="outline">
                <PlayCircle className="h-4 w-4 mr-2" /> End break ({fmtHM(breakNowH)})
              </Button>
            ) : (
              <Button onClick={startBreak} disabled={busy} className="w-full" size="lg" variant="outline">
                <Coffee className="h-4 w-4 mr-2" /> Start break
              </Button>
            )}
            <Button onClick={checkOut} disabled={busy || !!openBreak} className="w-full" size="lg" variant="secondary">
              <Square className="h-4 w-4 mr-2" /> Check out
            </Button>
          </>
        )}
      </div>

      {session && breaksToday.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">Breaks today</div>
          <div className="space-y-1">
            {breaksToday.slice(0, 4).map((b, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span>{fmtTime(b.break_start)} → {b.break_end ? fmtTime(b.break_end) : "ongoing"}</span>
                <span className="tabular-nums text-muted-foreground">
                  {fmtHM(durationHours(b.break_start, b.break_end ?? undefined))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}