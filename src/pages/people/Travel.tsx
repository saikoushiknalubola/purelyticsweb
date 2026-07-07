import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader } from "./PeopleLayout";
import { LoadingCards, EmptyState, StatusBadge } from "./_ui";
import { Plane, Plus, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";
import { fmtDate } from "./_hooks";

type Ctx = { user: any };

export default function Travel() {
  const { user } = useOutletContext<Ctx>();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    destination: "",
    from_date: "",
    to_date: "",
    purpose: "",
    estimated_cost: "",
    currency: "USD",
  });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("travel_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.destination || !form.from_date || !form.to_date || !form.purpose) {
      return toast.error("Fill destination, dates and purpose");
    }
    if (form.to_date < form.from_date) return toast.error("End date must be after start");
    const { error } = await supabase.from("travel_requests").insert({
      user_id: user.id,
      destination: form.destination,
      from_date: form.from_date,
      to_date: form.to_date,
      purpose: form.purpose,
      estimated_cost: form.estimated_cost ? Number(form.estimated_cost) : 0,
      currency: form.currency,
    });
    if (error) return toast.error(error.message);
    toast.success("Travel request submitted");
    setOpen(false);
    setForm({ destination: "", from_date: "", to_date: "", purpose: "", estimated_cost: "", currency: "USD" });
    load();
  };

  const cancel = async (id: string) => {
    if (!confirm("Cancel this pending request?")) return;
    await supabase.from("travel_requests").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Travel"
        subtitle="Request business travel and track approvals."
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />New request</Button>}
      />
      {loading ? (
        <LoadingCards />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Plane}
          title="No travel requests yet"
          description="Submit a travel request with dates and purpose — your manager will approve."
          action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" />New request</Button>}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {rows.map((r) => (
            <Card key={r.id} className="p-5 space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 text-primary" /> {r.destination}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3.5 w-3.5" /> {fmtDate(r.from_date)} → {fmtDate(r.to_date)}
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="text-sm">{r.purpose}</div>
              <div className="text-sm text-muted-foreground">
                Est. cost: <b>{r.currency} {Number(r.estimated_cost ?? 0).toFixed(2)}</b>
              </div>
              {r.decision_note && (
                <div className="text-xs bg-muted p-2 rounded">Note: {r.decision_note}</div>
              )}
              {r.status === "pending" && (
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => cancel(r.id)}>Cancel request</Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New travel request</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Destination</Label>
              <Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="London, UK" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>From</Label>
                <Input type="date" value={form.from_date} onChange={(e) => setForm({ ...form, from_date: e.target.value })} />
              </div>
              <div>
                <Label>To</Label>
                <Input type="date" value={form.to_date} onChange={(e) => setForm({ ...form, to_date: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Purpose</Label>
              <Textarea rows={3} value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label>Estimated cost</Label>
                <Input type="number" step="0.01" value={form.estimated_cost} onChange={(e) => setForm({ ...form, estimated_cost: e.target.value })} />
              </div>
              <div>
                <Label>Currency</Label>
                <Input maxLength={3} value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="text-xs text-muted-foreground">
        Manager? Review team requests on <Link to="/people/travel/approvals" className="underline">the approvals page</Link>.
      </div>
    </div>
  );
}