import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "./PeopleLayout";
import { LoadingCards, EmptyState, StatusBadge } from "./_ui";
import { Laptop, Plus } from "lucide-react";
import { toast } from "sonner";
import { fmtDate } from "./_hooks";

type Ctx = { user: any; isAdmin: boolean };

const CATEGORIES = ["laptop", "monitor", "phone", "headset", "access_card", "other"];

export default function Assets() {
  const { user, isAdmin } = useOutletContext<Ctx>();
  const [loading, setLoading] = useState(true);
  const [assigned, setAssigned] = useState<any[]>([]);
  const [reqs, setReqs] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: "laptop", reason: "" });

  const load = async () => {
    setLoading(true);
    const [{ data: a }, { data: r }] = await Promise.all([
      supabase.from("asset_assignments").select("*, assets(*)").eq("user_id", user.id).is("returned_at", null),
      supabase.from("asset_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    setAssigned(a ?? []); setReqs(r ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.reason.trim()) return toast.error("Please add a reason");
    const { error } = await supabase.from("asset_requests").insert({
      user_id: user.id, category: form.category, reason: form.reason,
    });
    if (error) return toast.error(error.message);
    toast.success("Request submitted"); setOpen(false); setForm({ category: "laptop", reason: "" }); load();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Assets" subtitle="Company equipment assigned to you"
        actions={
          <div className="flex gap-2">
            {isAdmin && <Button asChild variant="outline"><Link to="/people/assets/admin">Inventory</Link></Button>}
            <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Request asset</Button>
          </div>
        }
      />

      <div>
        <h2 className="font-serif text-lg mb-3">Currently assigned</h2>
        {loading ? <LoadingCards count={2} /> : assigned.length === 0 ? (
          <EmptyState icon={Laptop} title="No assets assigned" description="Assets assigned to you will appear here." />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {assigned.map((a) => (
              <Card key={a.id} className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{a.assets?.name}</div>
                    <div className="text-xs text-muted-foreground">Tag: {a.assets?.tag} · {a.assets?.category}</div>
                    {a.assets?.serial_no && <div className="text-xs text-muted-foreground">SN: {a.assets.serial_no}</div>}
                  </div>
                  <StatusBadge status={a.assets?.condition ?? "good"} />
                </div>
                <div className="text-xs text-muted-foreground mt-3">Assigned {fmtDate(a.assigned_at)}</div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-serif text-lg mb-3">My requests</h2>
        {reqs.length === 0 ? (
          <Card className="p-5 text-sm text-muted-foreground">No requests yet.</Card>
        ) : (
          <div className="space-y-2">
            {reqs.map((r) => (
              <Card key={r.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium capitalize">{r.category}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.reason}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-xs text-muted-foreground hidden sm:block">{fmtDate(r.created_at)}</div>
                  <StatusBadge status={r.status} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Request an asset</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Reason</Label><Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Why do you need this?" /></div>
          </div>
          <DialogFooter><Button onClick={submit}>Submit</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}