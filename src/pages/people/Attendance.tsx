import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import CheckInCard from "./CheckInCard";
import { PageHeader } from "./PeopleLayout";
import { durationHours, fmtHM, fmtTime, fmtDate } from "./_hooks";

interface Ctx { user: { id: string }; }

interface Session { id: string; check_in_at: string; check_out_at: string | null; note: string | null; }

function groupByDay(sessions: Session[]) {
  const map = new Map<string, { day: string; total: number; sessions: Session[] }>();
  for (const s of sessions) {
    const key = new Date(s.check_in_at).toDateString();
    if (!map.has(key)) map.set(key, { day: key, total: 0, sessions: [] });
    const row = map.get(key)!;
    row.sessions.push(s);
    if (s.check_out_at) row.total += durationHours(s.check_in_at, s.check_out_at);
  }
  return Array.from(map.values()).sort((a,b) => +new Date(b.day) - +new Date(a.day));
}

export default function Attendance() {
  const { user } = useOutletContext<Ctx>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const since = new Date(); since.setDate(since.getDate() - 45);
    supabase
      .from("attendance_sessions")
      .select("id, check_in_at, check_out_at, note")
      .eq("user_id", user.id)
      .gte("check_in_at", since.toISOString())
      .order("check_in_at", { ascending: false })
      .then(({ data }) => setSessions((data as any) ?? []));
  }, [user.id, reload]);

  const days = groupByDay(sessions);

  return (
    <div>
      <PageHeader title="My Attendance" subtitle="Check in when you start, check out when you wrap up." />
      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-1">
          <CheckInCard userId={user.id} onChange={() => setReload((k) => k + 1)} />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-border font-medium">Recent days</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Sessions</TableHead>
              <TableHead>First in</TableHead>
              <TableHead>Last out</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {days.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No attendance yet.</TableCell></TableRow>
            )}
            {days.map((d) => {
              const sorted = [...d.sessions].sort((a,b)=>+new Date(a.check_in_at)-+new Date(b.check_in_at));
              const last = sorted[sorted.length - 1];
              const status =
                d.total >= 8 ? { label: "Present", v: "default" as const }
                : d.total >= 4 ? { label: "Half day", v: "secondary" as const }
                : { label: "Short", v: "outline" as const };
              return (
                <TableRow key={d.day}>
                  <TableCell>{fmtDate(d.day)}</TableCell>
                  <TableCell>{d.sessions.length}</TableCell>
                  <TableCell>{fmtTime(sorted[0].check_in_at)}</TableCell>
                  <TableCell>{last.check_out_at ? fmtTime(last.check_out_at) : <span className="text-accent">running</span>}</TableCell>
                  <TableCell className="tabular-nums">{fmtHM(d.total)}</TableCell>
                  <TableCell><Badge variant={status.v}>{status.label}</Badge></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}