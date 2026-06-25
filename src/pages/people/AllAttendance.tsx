import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "./PeopleLayout";
import { durationHours, fmtHM, fmtTime, fmtDate } from "./_hooks";
import { Download } from "lucide-react";

export default function AllAttendance() {
  const today = new Date().toISOString().slice(0,10);
  const past = new Date(); past.setDate(past.getDate() - 7);
  const [from, setFrom] = useState(past.toISOString().slice(0,10));
  const [to, setTo] = useState(today);
  const [rows, setRows] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});

  const load = async () => {
    const fromIso = new Date(from + "T00:00:00").toISOString();
    const toIso = new Date(to + "T23:59:59").toISOString();
    const { data } = await supabase
      .from("attendance_sessions")
      .select("id, user_id, check_in_at, check_out_at")
      .gte("check_in_at", fromIso).lte("check_in_at", toIso)
      .order("check_in_at", { ascending: false });
    setRows(data ?? []);

    const ids = Array.from(new Set((data ?? []).map((r:any) => r.user_id)));
    if (ids.length) {
      const { data: ps } = await supabase.from("profiles").select("id, full_name, email").in("id", ids);
      const m: Record<string, any> = {};
      (ps ?? []).forEach((p:any) => m[p.id] = p);
      setProfiles(m);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const csvExport = () => {
    const lines = [["Employee","Email","Date","Check In","Check Out","Hours"].join(",")];
    rows.forEach((r) => {
      const p = profiles[r.user_id] || {};
      const h = r.check_out_at ? durationHours(r.check_in_at, r.check_out_at) : 0;
      lines.push([
        JSON.stringify(p.full_name ?? ""), JSON.stringify(p.email ?? ""),
        new Date(r.check_in_at).toISOString().slice(0,10),
        new Date(r.check_in_at).toISOString(),
        r.check_out_at ?? "",
        h.toFixed(2),
      ].join(","));
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `attendance-${from}_to_${to}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Team Attendance"
        subtitle="All check-ins across the company."
        actions={<Button variant="outline" onClick={csvExport}><Download className="h-4 w-4 mr-2" />Export CSV</Button>}
      />
      <Card className="p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div>
          <div className="text-xs text-muted-foreground mb-1">From</div>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">To</div>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <Button onClick={load}>Apply</Button>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No data in this range.</TableCell></TableRow>
            )}
            {rows.map((r) => {
              const p = profiles[r.user_id] || {};
              const h = r.check_out_at ? durationHours(r.check_in_at, r.check_out_at) : durationHours(r.check_in_at);
              return (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="font-medium">{p.full_name ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">{p.email}</div>
                  </TableCell>
                  <TableCell>{fmtDate(r.check_in_at)}</TableCell>
                  <TableCell>{fmtTime(r.check_in_at)}</TableCell>
                  <TableCell>{r.check_out_at ? fmtTime(r.check_out_at) : <span className="text-accent">running</span>}</TableCell>
                  <TableCell className="tabular-nums">{fmtHM(h)}</TableCell>
                  <TableCell><Badge variant={r.check_out_at ? "secondary" : "default"}>{r.check_out_at ? "Closed" : "Open"}</Badge></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}