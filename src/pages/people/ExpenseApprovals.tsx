import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "./PeopleLayout";
import { LoadingCards, EmptyState, StatusBadge } from "./_ui";
import { Wallet, Check, X } from "lucide-react";
import { toast } from "sonner";
import { fmtDate } from "./_hooks";

type Ctx = { user: any; isManager: boolean };

export default function ExpenseApprovals() {
  const { user, isManager } = useOutletContext<Ctx>();
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<any[]>([]);
  const [decided, setDecided] = useState<any[]>([]);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("expense_reports")
      .select("*")
      .neq("submitter_id", user.id)
      .in("status", ["submitted", "approved", "rejected"])
      .order("submitted_at", { ascending: false, nullsFirst: false });

    const rows = data ?? [];
    // Attach submitter names
    const ids = Array.from(new Set(rows.map((r: any) => r.submitter_id)));
    const { data: profs } = ids.length
      ? await supabase.from("profiles").select("id, full_name, email").in("id", ids)
      : { data: [] as any[] };
    const pmap = Object.fromEntries((profs ?? []).map((p: any) => [p.id, p]));
    const withNames = rows.map((r: any) => ({ ...r, submitter: pmap[r.submitter_id] }));

    setPending(withNames.filter((r) => r.status === "submitted"));
    setDecided(withNames.filter((r) => r.status !== "submitted"));
    setLoading(false);
  };

  useEffect(() => {
    if (isManager) load();
    else setLoading(false);
  }, [isManager]);

  const decide = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("expense_reports")
      .update({
        status,
        approver_id: user.id,
        decided_at: new Date().toISOString(),
        decision_note: noteMap[id] || null,
      })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Report ${status}`);
    await load();
  };

  if (!isManager) {
    return (
      <EmptyState
        icon={Wallet}
        title="Managers only"
        description="You need a manager or admin role to review expense reports."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Expense approvals" subtitle="Review and decide on submitted expense reports." />
      {loading ? (
        <LoadingCards />
      ) : (
        <>
          <div className="space-y-3">
            <h2 className="font-medium">Pending ({pending.length})</h2>
            {pending.length === 0 ? (
              <Card className="p-6 text-sm text-muted-foreground text-center">All caught up.</Card>
            ) : (
              pending.map((r) => (
                <Card key={r.id} className="p-5 space-y-3">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <div className="font-medium">{r.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {r.submitter?.full_name ?? r.submitter?.email ?? "Unknown"} · submitted {fmtDate(r.submitted_at)}
                      </div>
                      {r.purpose && <div className="text-sm mt-2">{r.purpose}</div>}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-serif">{r.currency} {Number(r.total).toFixed(2)}</div>
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                  <Textarea
                    placeholder="Optional decision note"
                    value={noteMap[r.id] ?? ""}
                    onChange={(e) => setNoteMap({ ...noteMap, [r.id]: e.target.value })}
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => decide(r.id, "rejected")}>
                      <X className="h-4 w-4 mr-2" /> Reject
                    </Button>
                    <Button onClick={() => decide(r.id, "approved")}>
                      <Check className="h-4 w-4 mr-2" /> Approve
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {decided.length > 0 && (
            <Card className="overflow-hidden">
              <div className="p-4 font-medium border-b">Recent decisions</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Decided</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {decided.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.title}</TableCell>
                      <TableCell>{r.submitter?.full_name ?? r.submitter?.email ?? "—"}</TableCell>
                      <TableCell>{r.currency} {Number(r.total).toFixed(2)}</TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell>{fmtDate(r.decided_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </>
      )}
    </div>
  );
}