import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Target, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "./PeopleLayout";
import { fmtDate } from "./_hooks";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

type Ctx = { user: any; isAdmin: boolean; isManager: boolean };

const STATUS_COLORS: Record<string, string> = {
  on_track: "default", at_risk: "secondary", off_track: "destructive",
  completed: "default", dropped: "outline",
};

export default function Goals() {
  const { user, isManager } = useOutletContext<Ctx>();
  const [tab, setTab] = useState<"mine" | "team">("mine");
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<any[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [checkinFor, setCheckinFor] = useState<any | null>(null);
  const [checkins, setCheckins] = useState<any[]>([]);

  const [form, setForm] = useState({
    title: "", description: "", goal_type: "okr", metric: "%",
    start_value: "0", target_value: "100", current_value: "0",
    weight: "1", status: "on_track", due_date: "", cycle_id: "",
  });
  const [check, setCheck] = useState({ progress_pct: 0, current_value: "", status: "on_track", notes: "" });

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("goals")
      .select("*, profile:profiles!goals_user_id_fkey(id,full_name,email), cycle:review_cycles(name)")
      .order("created_at", { ascending: false });
    if (tab === "mine") q = q.eq("user_id", user.id);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setGoals(data ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load();
    supabase.from("review_cycles").select("*").order("period_start", { ascending: false })
      .then(({ data }) => setCycles(data ?? []));
  }, [tab]);

  const save = async () => {
    if (!form.title) return toast.error("Title required");
    const payload: any = {
      user_id: user.id,
      title: form.title,
      description: form.description || null,
      goal_type: form.goal_type,
      metric: form.metric || null,
      start_value: parseFloat(form.start_value) || 0,
      target_value: parseFloat(form.target_value) || 100,
      current_value: parseFloat(form.current_value) || 0,
      weight: parseInt(form.weight) || 1,
      status: form.status,
      due_date: form.due_date || null,
      cycle_id: form.cycle_id || null,
      created_by: user.id,
      progress_pct: Math.round(((parseFloat(form.current_value) || 0) / (parseFloat(form.target_value) || 1)) * 100),
    };
    const { error } = await supabase.from("goals").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Goal created");
    setOpen(false);
    setForm({ title: "", description: "", goal_type: "okr", metric: "%", start_value: "0", target_value: "100", current_value: "0", weight: "1", status: "on_track", due_date: "", cycle_id: "" });
    load();
  };

  const openCheckin = async (g: any) => {
    setCheckinFor(g);
    setCheck({ progress_pct: g.progress_pct ?? 0, current_value: String(g.current_value ?? ""), status: g.status, notes: "" });
    const { data } = await supabase.from("goal_checkins").select("*").eq("goal_id", g.id).order("created_at");
    setCheckins(data ?? []);
  };

  const saveCheckin = async () => {
    if (!checkinFor) return;
    const pct = Math.max(0, Math.min(100, Number(check.progress_pct)));
    const cv = check.current_value ? parseFloat(check.current_value) : null;
    const { error } = await supabase.from("goal_checkins").insert({
      goal_id: checkinFor.id, user_id: user.id,
      progress_pct: pct, current_value: cv, status: check.status, notes: check.notes || null,
    });
    if (error) return toast.error(error.message);
    await supabase.from("goals").update({
      progress_pct: pct,
      current_value: cv ?? checkinFor.current_value,
      status: check.status,
    }).eq("id", checkinFor.id);
    toast.success("Check-in saved");
    setCheckinFor(null);
    load();
  };

  const chartData = useMemo(() => checkins.map((c) => ({
    date: new Date(c.created_at).toLocaleDateString([], { day: "2-digit", month: "short" }),
    progress: c.progress_pct,
  })), [checkins]);

  const myStats = useMemo(() => {
    const mine = goals.filter((g) => g.user_id === user.id);
    const avg = mine.length ? Math.round(mine.reduce((s, g) => s + (g.progress_pct ?? 0), 0) / mine.length) : 0;
    return {
      total: mine.length,
      onTrack: mine.filter((g) => g.status === "on_track").length,
      atRisk: mine.filter((g) => g.status === "at_risk" || g.status === "off_track").length,
      avg,
    };
  }, [goals, user.id]);

  return (
    <div>
      <PageHeader
        title="Goals & OKRs"
        subtitle="Set objectives, check in on progress, and stay aligned"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />New goal</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Create goal</DialogTitle></DialogHeader>
              <div className="space-y-3 max-h-[70vh] overflow-auto pr-1">
                <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Increase MAU by 30%" /></div>
                <div><Label>Description</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Type</Label>
                    <Select value={form.goal_type} onValueChange={(v) => setForm({ ...form, goal_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="okr">OKR</SelectItem>
                        <SelectItem value="kra">KRA</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Cycle</Label>
                    <Select value={form.cycle_id} onValueChange={(v) => setForm({ ...form, cycle_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Pick cycle" /></SelectTrigger>
                      <SelectContent>
                        {cycles.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Metric</Label><Input value={form.metric} onChange={(e) => setForm({ ...form, metric: e.target.value })} /></div>
                  <div><Label>Start</Label><Input type="number" value={form.start_value} onChange={(e) => setForm({ ...form, start_value: e.target.value })} /></div>
                  <div><Label>Target</Label><Input type="number" value={form.target_value} onChange={(e) => setForm({ ...form, target_value: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Current</Label><Input type="number" value={form.current_value} onChange={(e) => setForm({ ...form, current_value: e.target.value })} /></div>
                  <div><Label>Weight</Label><Input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} /></div>
                  <div><Label>Due</Label><Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={save}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="p-4"><div className="text-xs text-muted-foreground">My goals</div><div className="text-2xl font-semibold">{myStats.total}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">On track</div><div className="text-2xl font-semibold text-primary">{myStats.onTrack}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">At risk</div><div className="text-2xl font-semibold">{myStats.atRisk}</div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Avg progress</div><div className="text-2xl font-semibold">{myStats.avg}%</div></Card>
      </div>

      <Tabs value={tab} onValueChange={(v: any) => setTab(v)}>
        <TabsList>
          <TabsTrigger value="mine">My goals</TabsTrigger>
          {isManager && <TabsTrigger value="team">Team goals</TabsTrigger>}
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          {loading ? (
            <div className="p-10 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
          ) : goals.length === 0 ? (
            <Card className="p-10 text-center text-muted-foreground">
              <Target className="h-10 w-10 mx-auto mb-3 opacity-30" />No goals yet.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((g) => (
                <Card key={g.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="uppercase text-[10px]">{g.goal_type}</Badge>
                        <Badge variant={STATUS_COLORS[g.status] as any}>{g.status.replace("_", " ")}</Badge>
                        {g.cycle?.name && <span className="text-xs text-muted-foreground">{g.cycle.name}</span>}
                      </div>
                      <h3 className="font-medium mt-2">{g.title}</h3>
                      {tab === "team" && (
                        <div className="text-xs text-muted-foreground mt-1">{g.profile?.full_name || g.profile?.email}</div>
                      )}
                      {g.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{g.description}</p>}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{g.current_value} / {g.target_value} {g.metric}</span>
                      <span className="font-medium">{g.progress_pct}%</span>
                    </div>
                    <Progress value={g.progress_pct} className="h-2" />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{g.due_date ? `Due ${fmtDate(g.due_date)}` : "No due date"}</span>
                    {g.user_id === user.id && (
                      <Button size="sm" variant="outline" onClick={() => openCheckin(g)}>
                        <TrendingUp className="h-4 w-4 mr-1" />Check in
                      </Button>
                    )}
                    {g.user_id !== user.id && (
                      <Button size="sm" variant="ghost" onClick={() => openCheckin(g)}>View history</Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!checkinFor} onOpenChange={(o) => !o && setCheckinFor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{checkinFor?.title}</DialogTitle></DialogHeader>
          {chartData.length > 0 && (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis domain={[0, 100]} fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="progress" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {checkinFor?.user_id === user.id && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Progress %</Label><Input type="number" min={0} max={100} value={check.progress_pct} onChange={(e) => setCheck({ ...check, progress_pct: Number(e.target.value) })} /></div>
                <div><Label>Current value</Label><Input type="number" value={check.current_value} onChange={(e) => setCheck({ ...check, current_value: e.target.value })} /></div>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={check.status} onValueChange={(v) => setCheck({ ...check, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on_track">On track</SelectItem>
                    <SelectItem value="at_risk">At risk</SelectItem>
                    <SelectItem value="off_track">Off track</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="dropped">Dropped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Notes</Label><Textarea rows={2} value={check.notes} onChange={(e) => setCheck({ ...check, notes: e.target.value })} /></div>
            </div>
          )}
          {checkins.length > 0 && (
            <div className="border-t border-border pt-3 max-h-40 overflow-auto space-y-2">
              {checkins.slice().reverse().map((c) => (
                <div key={c.id} className="text-sm flex justify-between gap-3">
                  <div>
                    <div className="font-medium">{c.progress_pct}% · {c.status.replace("_", " ")}</div>
                    {c.notes && <div className="text-muted-foreground">{c.notes}</div>}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{fmtDate(c.created_at)}</div>
                </div>
              ))}
            </div>
          )}
          {checkinFor?.user_id === user.id && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setCheckinFor(null)}>Close</Button>
              <Button onClick={saveCheckin}>Save check-in</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}