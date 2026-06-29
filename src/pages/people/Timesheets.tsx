import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Loader2, Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "./PeopleLayout";

type Ctx = { user: any };

function mondayOf(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // 0 = Monday
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - day);
  return x;
}
function isoDate(d: Date) { return d.toISOString().slice(0, 10); }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Timesheets() {
  const { user } = useOutletContext<Ctx>();
  const [weekStart, setWeekStart] = useState(mondayOf(new Date()));
  const [entries, setEntries] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [week, setWeek] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [addRow, setAddRow] = useState<{ project_id: string; task: string }>({ project_id: "", task: "" });

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const weekEnd = days[6];

  const load = async () => {
    setLoading(true);
    const [{ data: te }, { data: pr }, { data: wk }] = await Promise.all([
      supabase.from("timesheet_entries").select("*")
        .eq("user_id", user.id)
        .gte("entry_date", isoDate(weekStart))
        .lte("entry_date", isoDate(weekEnd)),
      supabase.from("projects").select("id,name,billable,status").neq("status", "archived").order("name"),
      supabase.from("timesheet_weeks").select("*")
        .eq("user_id", user.id).eq("week_start", isoDate(weekStart)).maybeSingle(),
    ]);
    setEntries(te ?? []);
    setProjects(pr ?? []);
    setWeek(wk);
    setLoading(false);
  };
  useEffect(() => { load(); }, [weekStart]);

  // group entries by project+task
  const rows = useMemo(() => {
    const map = new Map<string, { project_id: string; task: string; cells: Record<string, any> }>();
    for (const e of entries) {
      const k = `${e.project_id || "none"}::${e.task || ""}`;
      if (!map.has(k)) map.set(k, { project_id: e.project_id, task: e.task || "", cells: {} });
      map.get(k)!.cells[e.entry_date] = e;
    }
    return Array.from(map.values());
  }, [entries]);

  const locked = week?.status === "submitted" || week?.status === "approved";

  const setHours = async (row: any, date: Date, hours: number) => {
    if (locked) return;
    const dateStr = isoDate(date);
    const existing = row.cells[dateStr];
    const project = projects.find((p) => p.id === row.project_id);
    if (existing) {
      if (hours <= 0) {
        await supabase.from("timesheet_entries").delete().eq("id", existing.id);
      } else {
        await supabase.from("timesheet_entries").update({ hours }).eq("id", existing.id);
      }
    } else if (hours > 0) {
      await supabase.from("timesheet_entries").insert({
        user_id: user.id, project_id: row.project_id || null, entry_date: dateStr,
        hours, task: row.task || null, billable: project?.billable ?? true,
      });
    }
    load();
  };

  const addNewRow = () => {
    if (!addRow.project_id) return toast.error("Pick a project");
    if (rows.some((r) => r.project_id === addRow.project_id && r.task === addRow.task)) {
      return toast.info("Row already exists");
    }
    setEntries((prev) => [...prev, { project_id: addRow.project_id, task: addRow.task, entry_date: "_placeholder_", hours: 0 }]);
    setAddRow({ project_id: "", task: "" });
  };

  const removeRow = async (row: any) => {
    if (locked) return;
    const ids = Object.values(row.cells).map((c: any) => c.id);
    if (ids.length) await supabase.from("timesheet_entries").delete().in("id", ids);
    load();
  };

  const totals = useMemo(() => {
    const total = entries.reduce((s, e) => s + Number(e.hours || 0), 0);
    const billable = entries.filter((e) => e.billable).reduce((s, e) => s + Number(e.hours || 0), 0);
    return { total, billable, nonBillable: total - billable };
  }, [entries]);

  const submit = async () => {
    const payload = {
      user_id: user.id,
      week_start: isoDate(weekStart),
      status: "submitted",
      submitted_at: new Date().toISOString(),
      total_hours: totals.total,
      billable_hours: totals.billable,
    };
    const { error } = await supabase.from("timesheet_weeks").upsert(payload, { onConflict: "user_id,week_start" });
    if (error) return toast.error(error.message);
    // link entries to week
    const { data: w } = await supabase.from("timesheet_weeks").select("id")
      .eq("user_id", user.id).eq("week_start", isoDate(weekStart)).maybeSingle();
    if (w?.id) {
      await supabase.from("timesheet_entries").update({ week_id: w.id })
        .eq("user_id", user.id)
        .gte("entry_date", isoDate(weekStart)).lte("entry_date", isoDate(weekEnd));
    }
    toast.success("Week submitted for approval");
    load();
  };

  return (
    <div>
      <PageHeader
        title="Timesheets"
        subtitle="Log hours against projects and submit weekly for approval"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, -7))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium px-2">
              {weekStart.toLocaleDateString([], { day: "2-digit", month: "short" })} – {weekEnd.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" })}
            </div>
            <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, 7))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4"><div className="text-xs text-muted-foreground">Total hours</div><div className="text-2xl font-semibold">{totals.total.toFixed(2)}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Billable</div><div className="text-2xl font-semibold text-primary">{totals.billable.toFixed(2)}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Non-billable</div><div className="text-2xl font-semibold">{totals.nonBillable.toFixed(2)}</div></Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground">Status</div>
          <div className="mt-1"><Badge variant={week?.status === "approved" ? "default" : "secondary"}>{week?.status ?? "draft"}</Badge></div>
        </Card>
      </div>

      <Card className="overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr>
                <th className="text-left p-3 min-w-[200px]">Project / Task</th>
                {days.map((d, i) => (
                  <th key={i} className="p-3 text-center min-w-[70px]">
                    <div className="text-xs text-muted-foreground">{DAY_LABELS[i]}</div>
                    <div className="font-medium">{d.getDate()}</div>
                  </th>
                ))}
                <th className="p-3 text-center">Total</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={10} className="p-8 text-center text-muted-foreground">No entries this week. Add a row below.</td></tr>
              )}
              {rows.map((row, idx) => {
                const project = projects.find((p) => p.id === row.project_id);
                const rowTotal = days.reduce((s, d) => s + Number(row.cells[isoDate(d)]?.hours || 0), 0);
                return (
                  <tr key={idx} className="border-t border-border">
                    <td className="p-3">
                      <div className="font-medium">{project?.name || "Unassigned"}</div>
                      {row.task && <div className="text-xs text-muted-foreground">{row.task}</div>}
                    </td>
                    {days.map((d, i) => (
                      <td key={i} className="p-2 text-center">
                        <Input
                          disabled={locked}
                          type="number" step="0.25" min="0" max="24"
                          defaultValue={row.cells[isoDate(d)]?.hours ?? ""}
                          onBlur={(e) => {
                            const v = parseFloat(e.target.value) || 0;
                            const cur = Number(row.cells[isoDate(d)]?.hours || 0);
                            if (v !== cur) setHours(row, d, v);
                          }}
                          className="h-9 text-center"
                        />
                      </td>
                    ))}
                    <td className="p-3 text-center font-medium">{rowTotal.toFixed(2)}</td>
                    <td className="p-3">
                      {!locked && (
                        <Button variant="ghost" size="icon" onClick={() => removeRow(row)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!locked && (
          <div className="p-3 border-t border-border flex flex-wrap items-end gap-2 bg-secondary/20">
            <div className="flex-1 min-w-[200px]">
              <Select value={addRow.project_id} onValueChange={(v) => setAddRow({ ...addRow, project_id: v })}>
                <SelectTrigger><SelectValue placeholder="Pick project" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Task (optional)" value={addRow.task} onChange={(e) => setAddRow({ ...addRow, task: e.target.value })} className="flex-1 min-w-[200px]" />
            <Button onClick={addNewRow}><Plus className="h-4 w-4 mr-1" />Add row</Button>
          </div>
        )}
      </Card>

      {week?.status === "rejected" && week.review_notes && (
        <Card className="mt-4 p-4 border-destructive/50">
          <div className="text-sm font-medium text-destructive">Rejected</div>
          <div className="text-sm mt-1">{week.review_notes}</div>
        </Card>
      )}

      <div className="mt-6 flex justify-end">
        {!locked && entries.length > 0 && (
          <Button onClick={submit}><Send className="h-4 w-4 mr-2" />Submit week for approval</Button>
        )}
      </div>
    </div>
  );
}