import { useEffect, useState } from "react";
import { useParams, useOutletContext, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "./PeopleLayout";
import { LoadingCards, StatusBadge } from "./_ui";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { fmtDate } from "./_hooks";

type Ctx = { user: any; isAdmin: boolean };
const STATUSES = ["open", "pending", "in_progress", "resolved", "closed"];

export default function HelpdeskTicket() {
  const { id } = useParams();
  const { user, isAdmin } = useOutletContext<Ctx>();
  const [t, setT] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: tk }, { data: cs }] = await Promise.all([
      supabase.from("helpdesk_tickets").select("*, helpdesk_categories(name)").eq("id", id!).maybeSingle(),
      supabase.from("helpdesk_comments").select("*").eq("ticket_id", id!).order("created_at"),
    ]);
    setT(tk); setComments(cs ?? []); setLoading(false);
  };
  useEffect(() => { load(); }, [id]);

  const post = async () => {
    if (!body.trim()) return;
    const { error } = await supabase.from("helpdesk_comments").insert({ ticket_id: id, author_id: user.id, body });
    if (error) return toast.error(error.message);
    setBody(""); load();
  };

  const setStatus = async (status: string) => {
    const patch: any = { status };
    if (status === "resolved") patch.resolved_at = new Date().toISOString();
    const { error } = await supabase.from("helpdesk_tickets").update(patch).eq("id", id!);
    if (error) return toast.error(error.message);
    load();
  };

  if (loading) return <LoadingCards />;
  if (!t) return <div>Ticket not found.</div>;
  const canManage = isAdmin || t.assignee_id === user.id;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="w-fit">
        <Link to="/people/helpdesk"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Link>
      </Button>
      <PageHeader title={t.subject}
        subtitle={`${t.helpdesk_categories?.name ?? "—"} · ${t.priority} priority · ${fmtDate(t.created_at)}`}
        actions={<StatusBadge status={t.status} />} />
      <Card className="p-5"><p className="text-sm whitespace-pre-wrap">{t.description}</p></Card>

      {canManage && (
        <Card className="p-4 flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Update status:</span>
          <Select value={t.status} onValueChange={setStatus}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
          </Select>
        </Card>
      )}

      <div>
        <div className="font-serif text-lg mb-3">Conversation</div>
        <div className="space-y-2">
          {comments.length === 0 && <Card className="p-4 text-sm text-muted-foreground">No comments yet.</Card>}
          {comments.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="text-xs text-muted-foreground mb-1">{c.author_id === user.id ? "You" : "Support"} · {fmtDate(c.created_at)}</div>
              <div className="text-sm whitespace-pre-wrap">{c.body}</div>
            </Card>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Add a reply…" rows={3} />
          <Button onClick={post}>Send</Button>
        </div>
      </div>
    </div>
  );
}