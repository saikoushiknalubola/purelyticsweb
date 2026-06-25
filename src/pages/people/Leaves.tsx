import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "./PeopleLayout";
import { fmtDate } from "./_hooks";
import { toast } from "sonner";
import { Plus } from "lucide-react";

function daysBetween(a: string, b: string) {
  const d1 = new Date(a), d2 = new Date(b);
  return Math.max(1, Math.round((+d2 - +d1) / 86400000) + 1);
}

export default function Leaves() {
  const { user } = useOutletContext<{ user: { id: string } }>();
  const [requests, setRequests] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ leave_type_id: "", from_date: "", to_date: "", reason: "" });

  const load = async () => {
    const year = new Date().getFullYear();
    const [r, t, b] = await Promise.all([
      supabase.from("leave_requests").select("*, leave_types(name)").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("leave_types").select("*").order("name"),
      supabase.from("leave_balances").select("*, leave_types(name)").eq("user_id", user.id).eq("year", year),
    ]);
    setRequests(r.data ?? []);
    setTypes(t.data ?? []);
    setBalances(b.data ?? []);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const submit = async () => {
    if (!form.leave_type_id || !form.from_date || !form.to_date) {
      return toast.error("Fill leave type and dates");
    }
    const days = daysBetween(form.from_date, form.to_date);
    const { error } = await supabase.from("leave_requests").insert({
      user_id: user.id,
      leave_type_id: form.leave_type_id,
      from_date: form.from_date,
      to_date: form.to_date,
      days,
      reason: form.reason || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Leave request submitted");
    setOpen(false);
    setForm({ leave_type_id: "", from_date: "", to_date: "", reason: "" });
    load();
  };

  const cancel = async (id: string) => {
    const { error } = await supabase.from("leave_requests").update({ status: "cancelled" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Cancelled");
    load();
  };

  return (
    <div>
      <PageHeader
        title="My Leaves"
        subtitle="Apply for time off and track your balances."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Apply leave</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Apply for leave</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Leave type</Label>
                  <Select value={form.leave_type_id} onValueChange={(v) => setForm({ ...form, leave_type_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Pick a leave type" /></SelectTrigger>
                    <SelectContent>
                      {types.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>From</Label><Input type="date" value={form.from_date} onChange={(e)=>setForm({...form, from_date: e.target.value})}/></div>
                  <div><Label>To</Label><Input type="date" value={form.to_date} onChange={(e)=>setForm({...form, to_date: e.target.value})}/></div>
                </div>
                <div>
                  <Label>Reason (optional)</Label>
                  <Textarea rows={3} value={form.reason} onChange={(e)=>setForm({...form, reason: e.target.value})}/>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={submit}>Submit</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {balances.length === 0 && <Card className="p-4 col-span-full text-sm text-muted-foreground">No balances yet — your admin will provision them.</Card>}
        {balances.map((b) => (
          <Card key={b.id} className="p-5">
            <div className="text-sm text-muted-foreground">{b.leave_types?.name}</div>
            <div className="font-serif text-2xl mt-1 tabular-nums">{Number(b.total) - Number(b.used)}</div>
            <div className="text-xs text-muted-foreground mt-1">of {b.total} used {b.used}</div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-border font-medium">Requests</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead><TableHead>From</TableHead><TableHead>To</TableHead>
              <TableHead>Days</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No requests yet.</TableCell></TableRow>
            )}
            {requests.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.leave_types?.name}</TableCell>
                <TableCell>{fmtDate(r.from_date)}</TableCell>
                <TableCell>{fmtDate(r.to_date)}</TableCell>
                <TableCell>{r.days}</TableCell>
                <TableCell className="max-w-xs truncate">{r.reason || "—"}</TableCell>
                <TableCell>
                  <Badge variant={
                    r.status === "approved" ? "default"
                    : r.status === "rejected" ? "destructive"
                    : r.status === "cancelled" ? "outline" : "secondary"
                  }>{r.status}</Badge>
                </TableCell>
                <TableCell>
                  {r.status === "pending" && (
                    <Button variant="ghost" size="sm" onClick={() => cancel(r.id)}>Cancel</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}