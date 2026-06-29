import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "./PeopleLayout";
import { fmtDate } from "./_hooks";

type Ctx = { user: any; isAdmin: boolean; isManager: boolean };

export default function Reviews() {
  const { user, isManager } = useOutletContext<Ctx>();
  const [tab, setTab] = useState<"self" | "team">("self");
  const [cycles, setCycles] = useState<any[]>([]);
  const [cycleId, setCycleId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [mySelfReview, setMySelfReview] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [editing, setEditing] = useState<{ type: "self" | "manager"; employee_id: string; record?: any } | null>(null);
  const [form, setForm] = useState({ rating: "4", strengths: "", improvements: "", comments: "" });

  const loadCycles = async () => {
    const { data } = await supabase.from("review_cycles").select("*").order("period_start", { ascending: false });
    setCycles(data ?? []);
    if (data && data.length && !cycleId) setCycleId(data[0].id);
  };
  useEffect(() => { loadCycles(); }, []);

  const load = async () => {
    if (!cycleId) return;
    setLoading(true);
    const { data: my } = await supabase.from("performance_reviews")
      .select("*").eq("cycle_id", cycleId).eq("employee_id", user.id);
    setMySelfReview((my ?? []).find((r: any) => r.review_type === "self") || null);

    if (isManager) {
      const { data: team } = await supabase.from("profiles")
        .select("id,full_name,email").eq("manager_id", user.id);
      const teamIds = (team ?? []).map((t) => t.id);
      let teamReviews: any[] = [];
      if (teamIds.length) {
        const { data: tr } = await supabase.from("performance_reviews")
          .select("*").eq("cycle_id", cycleId).in("employee_id", teamIds);
        teamReviews = tr ?? [];
      }
      setReports((team ?? []).map((t) => ({
        ...t,
        self: teamReviews.find((r: any) => r.employee_id === t.id && r.review_type === "self"),
        manager: teamReviews.find((r: any) => r.employee_id === t.id && r.review_type === "manager"),
      })));
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, [cycleId, tab]);

  const openEdit = (type: "self" | "manager", employee_id: string, record?: any) => {
    setEditing({ type, employee_id, record });
    setForm({
      rating: String(record?.rating ?? 4),
      strengths: record?.strengths ?? "",
      improvements: record?.improvements ?? "",
      comments: record?.comments ?? "",
    });
  };

  const save = async (submit: boolean) => {
    if (!editing) return;
    const payload: any = {
      cycle_id: cycleId,
      employee_id: editing.employee_id,
      review_type: editing.type,
      reviewer_id: editing.type === "manager" ? user.id : null,
      rating: parseInt(form.rating),
      strengths: form.strengths || null,
      improvements: form.improvements || null,
      comments: form.comments || null,
      status: submit ? "submitted" : "draft",
      submitted_at: submit ? new Date().toISOString() : null,
    };
    const { error } = await supabase.from("performance_reviews")
      .upsert(payload, { onConflict: "cycle_id,employee_id,review_type" });
    if (error) return toast.error(error.message);
    toast.success(submit ? "Review submitted" : "Saved as draft");
    setEditing(null);
    load();
  };

  return (
    <div>
      <PageHeader
        title="Performance reviews"
        subtitle="Self & manager reviews for each review cycle"
        actions={
          <Select value={cycleId} onValueChange={setCycleId}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Cycle" /></SelectTrigger>
            <SelectContent>
              {cycles.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />

      <Tabs value={tab} onValueChange={(v: any) => setTab(v)}>
        <TabsList>
          <TabsTrigger value="self">My self-review</TabsTrigger>
          {isManager && <TabsTrigger value="team">My team</TabsTrigger>}
        </TabsList>
        <TabsContent value="self" className="mt-4">
          {loading ? (
            <div className="p-10"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
          ) : (
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-medium">Self review</div>
                  <div className="text-sm text-muted-foreground">
                    {mySelfReview ? <>Status: <Badge variant={mySelfReview.status === "submitted" ? "default" : "secondary"}>{mySelfReview.status}</Badge></> : "Not started"}
                  </div>
                </div>
                <Button onClick={() => openEdit("self", user.id, mySelfReview)}>
                  {mySelfReview ? "Edit" : "Start"} self review
                </Button>
              </div>
              {mySelfReview && (
                <div className="space-y-2 text-sm">
                  <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < (mySelfReview.rating ?? 0) ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                  ))}</div>
                  {mySelfReview.strengths && <div><span className="font-medium">Strengths:</span> {mySelfReview.strengths}</div>}
                  {mySelfReview.improvements && <div><span className="font-medium">Improvements:</span> {mySelfReview.improvements}</div>}
                </div>
              )}
            </Card>
          )}
        </TabsContent>

        {isManager && (
          <TabsContent value="team" className="mt-4">
            {loading ? (
              <div className="p-10"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
            ) : reports.length === 0 ? (
              <Card className="p-10 text-center text-muted-foreground">No direct reports.</Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map((r) => (
                  <Card key={r.id} className="p-5">
                    <div className="font-medium">{r.full_name || r.email}</div>
                    <div className="text-xs text-muted-foreground mb-3">{r.email}</div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-xs text-muted-foreground">Self</div>
                        <Badge variant={r.self?.status === "submitted" ? "default" : "outline"}>{r.self?.status ?? "not started"}</Badge>
                        {r.self?.rating && <div className="mt-1">★ {r.self.rating}/5</div>}
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Manager</div>
                        <Badge variant={r.manager?.status === "submitted" ? "default" : "outline"}>{r.manager?.status ?? "not started"}</Badge>
                        {r.manager?.rating && <div className="mt-1">★ {r.manager.rating}/5</div>}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => openEdit("manager", r.id, r.manager)}>
                      {r.manager ? "Edit" : "Start"} manager review
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.type === "self" ? "Self review" : "Manager review"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Rating (1–5)</Label>
              <Select value={form.rating} onValueChange={(v) => setForm({ ...form, rating: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => <SelectItem key={n} value={String(n)}>{n} ★</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Strengths</Label><Textarea rows={3} value={form.strengths} onChange={(e) => setForm({ ...form, strengths: e.target.value })} /></div>
            <div><Label>Areas to improve</Label><Textarea rows={3} value={form.improvements} onChange={(e) => setForm({ ...form, improvements: e.target.value })} /></div>
            <div><Label>Additional comments</Label><Textarea rows={2} value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => save(false)}>Save draft</Button>
            <Button onClick={() => save(true)}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}