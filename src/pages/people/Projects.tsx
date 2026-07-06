import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Briefcase, Loader2, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "./PeopleLayout";
import { fmtDate } from "./_hooks";

type Ctx = { user: any; isAdmin: boolean; isManager: boolean };

export default function Projects() {
  const { user, isManager } = useOutletContext<Ctx>();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState<any | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [addMember, setAddMember] = useState<string>("");

  const [form, setForm] = useState({
    name: "", code: "", client: "", description: "",
    billable: true, status: "active", start_date: "", end_date: "",
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*, project_members(count)")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setProjects(data ?? []);
    setLoading(false);
  };
  const loadEmployees = async () => {
    const { data } = await supabase.from("profiles").select("id,full_name,email").order("full_name");
    setEmployees(data ?? []);
  };
  useEffect(() => { load(); loadEmployees(); }, []);

  const save = async () => {
    if (!form.name) return toast.error("Name required");
    const payload: any = {
      ...form,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      created_by: user.id,
    };
    const { error } = await supabase.from("projects").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Project created");
    setOpen(false);
    setForm({ name: "", code: "", client: "", description: "", billable: true, status: "active", start_date: "", end_date: "" });
    load();
  };

  const openMembers = async (p: any) => {
    setMemberOpen(p);
    const { data } = await supabase
      .from("project_members")
      .select("*, profile:profiles!project_members_user_id_profiles_fkey(id,full_name,email)")
      .eq("project_id", p.id);
    setMembers(data ?? []);
  };
  const addMemberSave = async () => {
    if (!addMember || !memberOpen) return;
    const { error } = await supabase.from("project_members").insert({
      project_id: memberOpen.id, user_id: addMember, project_role: "member",
    });
    if (error) return toast.error(error.message);
    setAddMember("");
    openMembers(memberOpen);
  };
  const removeMember = async (id: string) => {
    await supabase.from("project_members").delete().eq("id", id);
    if (memberOpen) openMembers(memberOpen);
  };

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Track client and internal work. Assign members and toggle billable."
        actions={isManager && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />New project</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Create project</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  <div><Label>Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="PRJ-001" /></div>
                </div>
                <div><Label>Client</Label><Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></div>
                <div><Label>Description</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Start</Label><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
                  <div><Label>End</Label><Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3 items-end">
                  <div>
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on_hold">On hold</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3 pb-2">
                    <Switch checked={form.billable} onCheckedChange={(v) => setForm({ ...form, billable: v })} />
                    <Label>Billable</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={save}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      />

      <Card>
        {loading ? (
          <div className="p-10 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" /></div>
        ) : projects.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            <Briefcase className="h-10 w-10 mx-auto mb-3 opacity-30" />No projects yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Billable</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead className="text-right">Members</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.code || "—"}</div>
                  </TableCell>
                  <TableCell>{p.client || "—"}</TableCell>
                  <TableCell><Badge variant="secondary">{p.status}</Badge></TableCell>
                  <TableCell>{p.billable ? <Badge>Billable</Badge> : <Badge variant="outline">Non-billable</Badge>}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {p.start_date ? fmtDate(p.start_date) : "—"} → {p.end_date ? fmtDate(p.end_date) : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openMembers(p)}>
                      <Users className="h-4 w-4 mr-1" />Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={!!memberOpen} onOpenChange={(o) => !o && setMemberOpen(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Members · {memberOpen?.name}</DialogTitle></DialogHeader>
          {isManager && (
            <div className="flex gap-2">
              <Select value={addMember} onValueChange={setAddMember}>
                <SelectTrigger><SelectValue placeholder="Add employee" /></SelectTrigger>
                <SelectContent>
                  {employees.filter((e) => !members.some((m) => m.user_id === e.id)).map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.full_name || e.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addMemberSave} disabled={!addMember}>Add</Button>
            </div>
          )}
          <div className="space-y-2 max-h-64 overflow-auto">
            {members.length === 0 && <p className="text-sm text-muted-foreground">No members yet.</p>}
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-2 rounded border border-border">
                <div>
                  <div className="text-sm font-medium">{m.profile?.full_name || m.profile?.email}</div>
                  <div className="text-xs text-muted-foreground">{m.project_role}</div>
                </div>
                {isManager && (
                  <Button variant="ghost" size="sm" onClick={() => removeMember(m.id)}>Remove</Button>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}