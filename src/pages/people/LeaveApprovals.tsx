import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "./PeopleLayout";
import { fmtDate } from "./_hooks";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";

export default function LeaveApprovals() {
  const { user } = useOutletContext<{ user: { id: string } }>();
  const [rows, setRows] = useState<any[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"pending"|"all">("pending");

  const load = async () => {
    let q = supabase.from("leave_requests").select("*, leave_types(name), profiles!leave_requests_user_id_fkey(full_name,email)").order("created_at", { ascending: false });
    if (filter === "pending") q = q.eq("status", "pending");
    const { data, error } = await q;
    if (error) {
      // Fallback without join if FK name differs
      const { data: d2 } = await supabase.from("leave_requests").select("*, leave_types(name)").order("created_at", { ascending: false });
      const ids = Array.from(new Set((d2 ?? []).map((r:any)=>r.user_id)));
      const { data: profs } = ids.length ? await supabase.from("profiles").select("id, full_name, email").in("id", ids) : { data: [] as any };
      const map: Record<string, any> = {};
      (profs ?? []).forEach((p:any)=>map[p.id]=p);
      setRows((d2 ?? []).filter((r:any)=> filter==="all" || r.status==="pending").map((r:any)=>({ ...r, profiles: map[r.user_id] })));
      return;
    }
    setRows(data ?? []);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  const decide = async (r: any, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("leave_requests")
      .update({
        status, reviewer_id: user.id, reviewed_at: new Date().toISOString(),
        reviewer_note: notes[r.id] || null,
      })
      .eq("id", r.id);
    if (error) return toast.error(error.message);

    // If approved, increment used balance
    if (status === "approved") {
      const year = new Date(r.from_date).getFullYear();
      const { data: bal } = await supabase
        .from("leave_balances").select("*")
        .eq("user_id", r.user_id).eq("leave_type_id", r.leave_type_id).eq("year", year).maybeSingle();
      if (bal) {
        await supabase.from("leave_balances")
          .update({ used: Number(bal.used) + Number(r.days) })
          .eq("id", bal.id);
      }
    }
    toast.success(`Request ${status}`);
    load();
  };

  return (
    <div>
      <PageHeader
        title="Leave Approvals"
        subtitle="Review pending leave requests."
        actions={
          <div className="flex gap-2">
            <Button variant={filter==="pending"?"default":"outline"} size="sm" onClick={()=>setFilter("pending")}>Pending</Button>
            <Button variant={filter==="all"?"default":"outline"} size="sm" onClick={()=>setFilter("all")}>All</Button>
          </div>
        }
      />
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Reason / Note</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Nothing here.</TableCell></TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="font-medium">{r.profiles?.full_name ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">{r.profiles?.email}</div>
                </TableCell>
                <TableCell>{r.leave_types?.name}</TableCell>
                <TableCell>{fmtDate(r.from_date)} → {fmtDate(r.to_date)}</TableCell>
                <TableCell>{r.days}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="text-sm">{r.reason || "—"}</div>
                  {r.status === "pending" && (
                    <Textarea className="mt-2" rows={1} placeholder="Note (optional)"
                      value={notes[r.id] ?? ""}
                      onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })} />
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    r.status === "approved" ? "default"
                    : r.status === "rejected" ? "destructive"
                    : r.status === "cancelled" ? "outline" : "secondary"
                  }>{r.status}</Badge>
                </TableCell>
                <TableCell>
                  {r.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => decide(r, "approved")}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => decide(r, "rejected")}>Reject</Button>
                    </div>
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