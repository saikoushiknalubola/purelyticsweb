import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "./PeopleLayout";
import { LoadingCards, EmptyState, StatusBadge } from "./_ui";
import { Plane, Check, X, MapPin, Calendar, Inbox } from "lucide-react";
import { toast } from "sonner";
import { fmtDate } from "./_hooks";

type Ctx = { user: any; isManager: boolean };

export default function TravelApprovals() {
  const { user, isManager } = useOutletContext<Ctx>();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("travel_requests")
      .select("*")
      .neq("user_id", user.id)
      .order("created_at", { ascending: false });
    const ids = Array.from(new Set((data ?? []).map((r: any) => r.user_id)));
    const { data: profs } = ids.length
      ? await supabase.from("profiles").select("id, full_name, email").in("id", ids)
      : { data: [] as any[] };
    const pmap = Object.fromEntries((profs ?? []).map((p: any) => [p.id, p]));
    setRows((data ?? []).map((r: any) => ({ ...r, person: pmap[r.user_id] })));
    setLoading(false);
  };

  useEffect(() => { if (isManager) load(); else setLoading(false); }, [isManager]);

  const decide = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("travel_requests")
      .update({
        status,
        approver_id: user.id,
        decided_at: new Date().toISOString(),
        decision_note: noteMap[id] || null,
      })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Request ${status}`);
    load();
  };

  if (!isManager) {
    return (
      <EmptyState
        icon={Plane}
        title="Managers only"
        description="You need a manager or admin role to review travel requests."
      />
    );
  }

  const pending = rows.filter((r) => r.status === "pending");
  const done = rows.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-6">
      <PageHeader title="Travel approvals" subtitle="Approve or reject team travel requests." />
      {loading ? (
        <LoadingCards />
      ) : (
        <>
          <h2 className="font-medium">Pending ({pending.length})</h2>
          {pending.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Nothing to review"
              description="No pending travel requests from your team right now. New submissions will appear here for approval."
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {pending.map((r) => (
                <Card key={r.id} className="p-5 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-medium">{r.person?.full_name ?? r.person?.email ?? "Unknown"}</div>
                      <div className="flex items-center gap-2 text-sm mt-1"><MapPin className="h-3.5 w-3.5" />{r.destination}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1"><Calendar className="h-3.5 w-3.5" />{fmtDate(r.from_date)} → {fmtDate(r.to_date)}</div>
                    </div>
                    <div className="text-right text-sm">{r.currency} {Number(r.estimated_cost ?? 0).toFixed(2)}</div>
                  </div>
                  <div className="text-sm">{r.purpose}</div>
                  <Textarea rows={2} placeholder="Note (optional)" value={noteMap[r.id] ?? ""} onChange={(e) => setNoteMap({ ...noteMap, [r.id]: e.target.value })} />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => decide(r.id, "rejected")}><X className="h-4 w-4 mr-2" />Reject</Button>
                    <Button onClick={() => decide(r.id, "approved")}><Check className="h-4 w-4 mr-2" />Approve</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {done.length > 0 && (
            <>
              <h2 className="font-medium pt-4">Recent decisions</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {done.slice(0, 10).map((r) => (
                  <Card key={r.id} className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{r.destination}</div>
                      <div className="text-xs text-muted-foreground">{r.person?.full_name ?? r.person?.email} · {fmtDate(r.from_date)}</div>
                    </div>
                    <StatusBadge status={r.status} />
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}