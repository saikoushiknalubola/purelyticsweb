import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "./PeopleLayout";
import { fmtDate } from "./_hooks";

type Ctx = { user: any; isAdmin: boolean };

export default function TimesheetApprovals() {
  const { user } = useOutletContext<Ctx>();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [reviewing, setReviewing] = useState<any | null>(null);
  const [decision, setDecision] = useState<"approved" | "rejected">("approved");
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("timesheet_weeks")
      .select("*, profile:profiles!timesheet_weeks_user_id_profiles_fkey(id,full_name,email)")
      .in("status", ["submitted", "approved", "rejected"])
      .order("submitted_at", { ascending: false })
      .limit(50);
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openReview = async (r: any) => {
    setReviewing(r);
    setNotes("");
    setDecision("approved");
    const { data } = await supabase
      .from("timesheet_entries")
      .select("*, project:projects(name,billable)")
      .eq("user_id", r.user_id)
      .gte("entry_date", r.week_start)
      .lte("entry_date", new Date(new Date(r.week_start).getTime() + 6 * 86400000).toISOString().slice(0, 10))
      .order("entry_date");
    setEntries(data ?? []);
  };

  const submitReview = async () => {
    const { error } = await supabase.from("timesheet_weeks").update({
      status: decision, reviewed_by: user.id, reviewed_at: new Date().toISOString(), review_notes: notes,
    }).eq("id", reviewing.id);
    if (error) return toast.error(error.message);
    toast.success(`Timesheet ${decision}`);
    setReviewing(null);
    load();
  };

  return (
    <div>
      <PageHeader title="Timesheet approvals" subtitle="Review and approve submitted weekly timesheets" />
      <Card>
        {loading ? (
          <div className="p-10 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">No timesheets to review.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Week of</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Billable</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.profile?.full_name || r.profile?.email}</TableCell>
                  <TableCell>{fmtDate(r.week_start)}</TableCell>
                  <TableCell>{Number(r.total_hours || 0).toFixed(2)}h</TableCell>
                  <TableCell>{Number(r.billable_hours || 0).toFixed(2)}h</TableCell>
                  <TableCell><Badge variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"}>{r.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.submitted_at ? fmtDate(r.submitted_at) : "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => openReview(r)}>Review</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={!!reviewing} onOpenChange={(o) => !o && setReviewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{reviewing?.profile?.full_name} · week of {reviewing && fmtDate(reviewing.week_start)}</DialogTitle>
          </DialogHeader>
          <div className="max-h-72 overflow-auto border border-border rounded">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Billable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell>{fmtDate(e.entry_date)}</TableCell>
                    <TableCell>{e.project?.name || "—"}</TableCell>
                    <TableCell>{e.task || "—"}</TableCell>
                    <TableCell>{Number(e.hours).toFixed(2)}</TableCell>
                    <TableCell>{e.billable ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <Textarea placeholder="Review notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDecision("rejected"); setTimeout(submitReview, 0); }}>
              <XCircle className="h-4 w-4 mr-1" />Reject
            </Button>
            <Button onClick={() => { setDecision("approved"); setTimeout(submitReview, 0); }}>
              <CheckCircle2 className="h-4 w-4 mr-1" />Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}