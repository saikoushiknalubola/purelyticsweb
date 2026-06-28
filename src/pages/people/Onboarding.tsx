import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ListChecks, Sparkles, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "./PeopleLayout";
import { fmtDate } from "./_hooks";

type Ctx = { user: any; profile: any; isAdmin: boolean; isManager: boolean };

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_offset_days: number;
  sort_order: number;
  category: string | null;
}

export default function Onboarding() {
  const { user, isAdmin } = useOutletContext<Ctx>();
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<Record<string, any>>({});
  // admin view
  const [allAssignments, setAllAssignments] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [assignDialog, setAssignDialog] = useState(false);
  const [assignForm, setAssignForm] = useState({
    employee_id: "",
    template_id: "",
    start_date: new Date().toISOString().slice(0, 10),
  });

  const loadMine = async () => {
    const { data: a } = await supabase
      .from("employee_onboarding")
      .select("*, template:onboarding_templates(id,name,description)")
      .eq("employee_id", user.id)
      .maybeSingle();
    setAssignment(a);
    if (a?.template_id) {
      const { data: t } = await supabase
        .from("onboarding_tasks")
        .select("*")
        .eq("template_id", a.template_id)
        .order("sort_order");
      setTasks(t ?? []);
      const { data: p } = await supabase
        .from("employee_onboarding_progress")
        .select("*")
        .eq("employee_id", user.id);
      const map: Record<string, any> = {};
      (p ?? []).forEach((r) => { map[r.task_id] = r; });
      setProgress(map);
    } else {
      setTasks([]);
      setProgress({});
    }
  };

  const loadAdmin = async () => {
    const [{ data: assignments }, { data: tpls }, { data: emps }] = await Promise.all([
      supabase
        .from("employee_onboarding")
        .select("*, employee:profiles!employee_onboarding_employee_id_fkey(id,full_name,email,joining_date), template:onboarding_templates(id,name)")
        .order("created_at", { ascending: false }),
      supabase.from("onboarding_templates").select("*").order("name"),
      supabase.from("profiles").select("id,full_name,email").order("full_name"),
    ]);
    setAllAssignments(assignments ?? []);
    setTemplates(tpls ?? []);
    setEmployees(emps ?? []);
    // Pull progress counts
    if (assignments?.length) {
      const ids = assignments.map((a: any) => a.employee_id);
      const { data: prog } = await supabase
        .from("employee_onboarding_progress")
        .select("employee_id,is_completed")
        .in("employee_id", ids);
      const stats: Record<string, { done: number; total: number }> = {};
      (prog ?? []).forEach((r: any) => {
        if (!stats[r.employee_id]) stats[r.employee_id] = { done: 0, total: 0 };
        stats[r.employee_id].total++;
        if (r.is_completed) stats[r.employee_id].done++;
      });
      setAllAssignments(
        (assignments ?? []).map((a: any) => ({ ...a, _stats: stats[a.employee_id] }))
      );
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadMine();
      if (isAdmin) await loadAdmin();
      setLoading(false);
    })();
  }, [isAdmin]);

  const toggleTask = async (task: Task, done: boolean) => {
    const existing = progress[task.id];
    if (existing) {
      const { error } = await supabase
        .from("employee_onboarding_progress")
        .update({ is_completed: done, completed_at: done ? new Date().toISOString() : null })
        .eq("id", existing.id);
      if (error) { toast.error(error.message); return; }
    } else {
      const { error } = await supabase.from("employee_onboarding_progress").insert({
        employee_id: user.id,
        task_id: task.id,
        is_completed: done,
        completed_at: done ? new Date().toISOString() : null,
      });
      if (error) { toast.error(error.message); return; }
    }
    loadMine();
  };

  const assignTemplate = async () => {
    if (!assignForm.employee_id || !assignForm.template_id) {
      toast.error("Pick an employee and a template");
      return;
    }
    const { error } = await supabase
      .from("employee_onboarding")
      .upsert(
        {
          employee_id: assignForm.employee_id,
          template_id: assignForm.template_id,
          start_date: assignForm.start_date,
          assigned_by: user.id,
          status: "in_progress",
        },
        { onConflict: "employee_id" }
      );
    if (error) { toast.error(error.message); return; }
    // Seed empty progress rows
    const { data: ts } = await supabase
      .from("onboarding_tasks")
      .select("id")
      .eq("template_id", assignForm.template_id);
    if (ts?.length) {
      await supabase.from("employee_onboarding_progress").upsert(
        ts.map((t: any) => ({
          employee_id: assignForm.employee_id,
          task_id: t.id,
          is_completed: false,
        })),
        { onConflict: "employee_id,task_id" }
      );
    }
    toast.success("Onboarding assigned");
    setAssignDialog(false);
    loadAdmin();
    loadMine();
  };

  const completion = useMemo(() => {
    if (!tasks.length) return 0;
    const done = tasks.filter((t) => progress[t.id]?.is_completed).length;
    return Math.round((done / tasks.length) * 100);
  }, [tasks, progress]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Onboarding"
        subtitle="Welcome aboard — track your joining checklist"
        actions={
          isAdmin ? (
            <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
              <DialogTrigger asChild>
                <Button><UserPlus className="h-4 w-4 mr-2" /> Assign template</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign onboarding template</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Employee</Label>
                    <Select
                      value={assignForm.employee_id}
                      onValueChange={(v) => setAssignForm({ ...assignForm, employee_id: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                      <SelectContent>
                        {employees.map((e) => (
                          <SelectItem key={e.id} value={e.id}>{e.full_name || e.email}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Template</Label>
                    <Select
                      value={assignForm.template_id}
                      onValueChange={(v) => setAssignForm({ ...assignForm, template_id: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
                      <SelectContent>
                        {templates.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Start date</Label>
                    <Input
                      type="date"
                      value={assignForm.start_date}
                      onChange={(e) => setAssignForm({ ...assignForm, start_date: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAssignDialog(false)}>Cancel</Button>
                  <Button onClick={assignTemplate}>Assign</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ) : undefined
        }
      />

      {/* My checklist */}
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <h2 className="font-display text-xl text-foreground">My checklist</h2>
            </div>
            {assignment?.template?.name && (
              <p className="text-sm text-muted-foreground mt-1">
                {assignment.template.name} · started {fmtDate(assignment.start_date)}
              </p>
            )}
          </div>
          {tasks.length > 0 && (
            <div className="text-right">
              <div className="text-2xl font-display text-primary">{completion}%</div>
              <div className="text-xs text-muted-foreground">complete</div>
            </div>
          )}
        </div>
        {tasks.length > 0 && <Progress value={completion} className="mb-6" />}
        {!assignment ? (
          <div className="text-center py-10 text-muted-foreground">
            <ListChecks className="h-10 w-10 mx-auto mb-3 opacity-30" />
            No onboarding assigned yet.
            {isAdmin && <p className="mt-2 text-sm">Use "Assign template" to start one.</p>}
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => {
              const p = progress[t.id];
              const done = !!p?.is_completed;
              return (
                <li
                  key={t.id}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-secondary/40 transition-colors"
                >
                  <Checkbox
                    checked={done}
                    onCheckedChange={(v) => toggleTask(t, !!v)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className={`font-medium ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {t.title}
                    </div>
                    {t.description && (
                      <div className="text-sm text-muted-foreground mt-0.5">{t.description}</div>
                    )}
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {t.category || "general"}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {/* Admin: all hires */}
      {isAdmin && (
        <Card className="p-6">
          <h2 className="font-display text-xl text-foreground mb-4">Team onboarding</h2>
          {allAssignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No employees onboarding right now.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allAssignments.map((a) => {
                const stats = a._stats ?? { done: 0, total: 0 };
                const pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;
                return (
                  <div key={a.id} className="p-4 rounded-lg border border-border">
                    <div className="font-medium text-foreground">
                      {a.employee?.full_name || a.employee?.email}
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                      {a.template?.name} · started {fmtDate(a.start_date)}
                    </div>
                    <Progress value={pct} className="mb-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{stats.done}/{stats.total} tasks done</span>
                      <Badge variant={pct === 100 ? "default" : "secondary"}>
                        {pct === 100 ? "Completed" : a.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}