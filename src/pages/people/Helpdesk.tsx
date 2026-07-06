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
import { LifeBuoy, Plus } from "lucide-react";
import { toast } from "sonner";
import { fmtDate } from "./_hooks";

type Ctx = { user: any; isAdmin: boolean };

export default function Helpdesk() {
  const { user, isAdmin } = useOutletContext<Ctx>();
  const [tickets, setTickets] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", description: "", category_id: "", priority: "medium" });

  const load = async () => {
    setLoading(true);
    const [{ data: t }, { data: c }] = await Promise.all([
      supabase.from("helpdesk_tickets").select("*, helpdesk_categories(name)").eq("requester_id", user.id).order("created_at", { ascending: false }),
      supabase.from("helpdesk_categories").select("*").order("name"),
    ]);
    setTickets(t ?? []); setCats(c ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.subject || !form.description) return toast.error("Subject and description required");
    const cat = cats.find((c) => c.id === form.category_id);
    const sla = cat ? new Date(Date.now() + (cat.default_sla_hours ?? 48) * 3600 * 1000).toISOString() : null;
    const { error } = await supabase.from("helpdesk_tickets").insert({
      subject: form.subject, description: form.description,
      category_id: form.category_id || null, priority: form.priority,
      requester_id: user.id, sla_due_at: sla,
    });
    if (error) return toast.error(error.message);
    toast.success("Ticket created"); setOpen(false);
    setForm({ subject: "", description: "", category_id: "", priority: "medium" }); load();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Helpdesk" subtitle="Raise and track HR & IT support tickets"
        actions={
          <div className="flex gap-2">
            {isAdmin && <Button asChild variant="outline"><Link to="/people/helpdesk/queue">Queue</Link></Button>}
            <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> New ticket</Button>
          </div>
        }
      />
      {loading ? <LoadingCards /> : tickets.length === 0 ? (
        <EmptyState icon={LifeBuoy} title="No tickets yet" description="Create a ticket to get help from HR or IT."
          action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> New ticket</Button>} />
      ) : (
        <div className="space-y-2">
          {tickets.map((t) => (
            <Card key={t.id} className="p-4 hover:bg-secondary/40 transition-colors">
              <Link to={`/people/helpdesk/${t.id}`} className="flex flex-wrap justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{t.subject}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {t.helpdesk_categories?.name ?? "—"} · {t.priority} · {fmtDate(t.created_at)}
                  </div>
                </div>
                <StatusBadge status={t.status} />
              </Link>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New ticket</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Subject</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["low","medium","high","urgent"].map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter><Button onClick={submit}>Submit</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}