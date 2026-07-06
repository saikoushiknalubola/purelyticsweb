import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageHeader } from "./PeopleLayout";
import { LoadingCards, EmptyState } from "./_ui";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function LearningAdmin() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<any>({ title: "", description: "", category: "", duration_minutes: 30, is_published: true });
  const [modulesFor, setModulesFor] = useState<any | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [mForm, setMForm] = useState<any>({ title: "", content: "", video_url: "", duration_minutes: 15 });

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    setCourses(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: "", description: "", category: "", duration_minutes: 30, is_published: true }); setOpen(true); };
  const openEdit = (c: any) => { setEditing(c); setForm({ title: c.title, description: c.description ?? "", category: c.category ?? "", duration_minutes: c.duration_minutes ?? 30, is_published: c.is_published }); setOpen(true); };

  const save = async () => {
    if (!form.title) return toast.error("Title required");
    const payload = { ...form, duration_minutes: Number(form.duration_minutes) || 0 };
    const { error } = editing
      ? await supabase.from("courses").update(payload).eq("id", editing.id)
      : await supabase.from("courses").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setOpen(false); load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const openModules = async (c: any) => {
    setModulesFor(c);
    const { data } = await supabase.from("course_modules").select("*").eq("course_id", c.id).order("position");
    setModules(data ?? []);
  };

  const addModule = async () => {
    if (!mForm.title) return toast.error("Module title required");
    const { error } = await supabase.from("course_modules").insert({
      ...mForm, course_id: modulesFor.id, position: modules.length,
      duration_minutes: Number(mForm.duration_minutes) || 0,
    });
    if (error) return toast.error(error.message);
    setMForm({ title: "", content: "", video_url: "", duration_minutes: 15 });
    const { data } = await supabase.from("course_modules").select("*").eq("course_id", modulesFor.id).order("position");
    setModules(data ?? []);
  };

  const delModule = async (id: string) => {
    await supabase.from("course_modules").delete().eq("id", id);
    setModules(modules.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Courses" subtitle="Create and publish learning content"
        actions={<Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> New course</Button>} />

      {loading ? <LoadingCards /> : courses.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses yet" description="Create your first course to get started."
          action={<Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> New course</Button>} />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="font-serif text-lg truncate">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.category ?? "Uncategorized"} · {c.duration_minutes ?? 0} min</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openModules(c)}>Modules</Button>
                  <Button size="sm" variant="outline" onClick={() => openEdit(c)}>Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => del(c.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{c.description}</p>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit course" : "New course"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              <div><Label>Duration (min)</Label><Input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} /></div>
            </div>
            <div className="flex items-center gap-2"><Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} /><Label>Published</Label></div>
          </div>
          <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!modulesFor} onOpenChange={(v) => !v && setModulesFor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{modulesFor?.title} — Modules</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {modules.map((m, i) => (
              <div key={m.id} className="p-3 rounded border border-border flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{i + 1}. {m.title}</div>
                  {m.content && <div className="text-xs text-muted-foreground line-clamp-2">{m.content}</div>}
                </div>
                <Button size="sm" variant="ghost" onClick={() => delModule(m.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 space-y-2">
            <Input placeholder="Module title" value={mForm.title} onChange={(e) => setMForm({ ...mForm, title: e.target.value })} />
            <Textarea placeholder="Content / notes" value={mForm.content} onChange={(e) => setMForm({ ...mForm, content: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Video URL (optional)" value={mForm.video_url} onChange={(e) => setMForm({ ...mForm, video_url: e.target.value })} />
              <Input type="number" placeholder="Minutes" value={mForm.duration_minutes} onChange={(e) => setMForm({ ...mForm, duration_minutes: e.target.value })} />
            </div>
            <Button size="sm" onClick={addModule}><Plus className="h-4 w-4 mr-2" /> Add module</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}