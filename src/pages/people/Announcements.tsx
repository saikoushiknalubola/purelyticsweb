import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "./PeopleLayout";
import { fmtDate } from "./_hooks";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function Announcements() {
  const { user } = useOutletContext<{ user: { id: string } }>();
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", body: "" });

  const load = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setRows(data ?? []);
  };

  useEffect(() => { load(); }, []);

  const post = async () => {
    if (!form.title || !form.body) return toast.error("Title and body required");
    const { error } = await supabase.from("announcements").insert({ ...form, posted_by: user.id });
    if (error) return toast.error(error.message);
    toast.success("Posted");
    setForm({ title: "", body: "" }); load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div>
      <PageHeader title="Announcements" subtitle="Share updates with the whole company." />
      <Card className="p-6 mb-6 space-y-3">
        <Input placeholder="Title" value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})}/>
        <Textarea rows={4} placeholder="Write your announcement…" value={form.body} onChange={(e)=>setForm({...form, body: e.target.value})}/>
        <Button onClick={post}>Post</Button>
      </Card>
      <div className="space-y-3">
        {rows.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="text-xs text-muted-foreground">{fmtDate(r.created_at)}</div>
              </div>
              <Button size="icon" variant="ghost" onClick={()=>remove(r.id)}><Trash2 className="h-4 w-4"/></Button>
            </div>
            <p className="text-sm text-foreground/80 mt-2 whitespace-pre-wrap">{r.body}</p>
          </Card>
        ))}
        {rows.length === 0 && <Card className="p-6 text-sm text-muted-foreground">No announcements yet.</Card>}
      </div>
    </div>
  );
}