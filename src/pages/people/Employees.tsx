import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Copy } from "lucide-react";

export default function Employees() {
  const [rows, setRows] = useState<any[]>([]);
  const [depts, setDepts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [provisioned, setProvisioned] = useState<{ email: string; tempPassword: string } | null>(null);
  const [form, setForm] = useState({
    full_name: "", email: "", designation: "", department_id: "", role: "employee" as "employee"|"manager"|"admin",
    joining_date: new Date().toISOString().slice(0,10), manager_id: "",
  });

  const load = async () => {
    const [{ data: p }, { data: d }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("departments").select("*").order("name"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const roleMap: Record<string, string[]> = {};
    (r ?? []).forEach((x:any) => { roleMap[x.user_id] = [...(roleMap[x.user_id] ?? []), x.role]; });
    setRows((p ?? []).map((x:any) => ({ ...x, roles: roleMap[x.id] ?? [] })));
    setDepts(d ?? []);
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.full_name || !form.email) return toast.error("Name and email required");
    const payload: any = { ...form };
    if (!payload.manager_id) delete payload.manager_id;
    if (!payload.department_id) delete payload.department_id;
    const { data, error } = await supabase.functions.invoke("provision-employee", { body: payload });
    if (error) return toast.error(error.message);
    if ((data as any)?.error) return toast.error((data as any).error);
    setProvisioned({ email: form.email, tempPassword: (data as any).tempPassword });
    setOpen(false);
    setForm({ full_name:"", email:"", designation:"", department_id:"", role:"employee", joining_date: new Date().toISOString().slice(0,10), manager_id:"" });
    load();
  };

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle="Provision and manage company accounts."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2"/>Add employee</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add employee</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Full name</Label><Input value={form.full_name} onChange={(e)=>setForm({...form, full_name: e.target.value})}/></div>
                  <div><Label>Work email</Label><Input type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})}/></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Designation</Label><Input value={form.designation} onChange={(e)=>setForm({...form, designation: e.target.value})}/></div>
                  <div>
                    <Label>Department</Label>
                    <Select value={form.department_id} onValueChange={(v)=>setForm({...form, department_id: v})}>
                      <SelectTrigger><SelectValue placeholder="Pick"/></SelectTrigger>
                      <SelectContent>
                        {depts.map((d)=> <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Role</Label>
                    <Select value={form.role} onValueChange={(v: any)=>setForm({...form, role: v})}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Joining date</Label><Input type="date" value={form.joining_date} onChange={(e)=>setForm({...form, joining_date: e.target.value})}/></div>
                </div>
                <div>
                  <Label>Reports to</Label>
                  <Select value={form.manager_id} onValueChange={(v)=>setForm({...form, manager_id: v})}>
                    <SelectTrigger><SelectValue placeholder="None"/></SelectTrigger>
                    <SelectContent>
                      {rows.map((r)=> <SelectItem key={r.id} value={r.id}>{r.full_name ?? r.email}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
                <Button onClick={submit}>Create account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Dialog open={!!provisioned} onOpenChange={(o)=>!o && setProvisioned(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Account created</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Share these credentials with the employee. They can change their password after first sign-in.
          </p>
          <Card className="p-4 space-y-2 mt-2">
            <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Email</span><span className="font-mono">{provisioned?.email}</span></div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Temp password</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">{provisioned?.tempPassword}</span>
                <Button size="icon" variant="ghost" onClick={()=>{navigator.clipboard.writeText(provisioned!.tempPassword); toast.success("Copied")}}><Copy className="h-4 w-4"/></Button>
              </div>
            </div>
          </Card>
          <DialogFooter><Button onClick={()=>setProvisioned(null)}>Done</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Designation</TableHead>
              <TableHead>Role</TableHead><TableHead>Joined</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.full_name ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.email}</TableCell>
                <TableCell>{r.designation ?? "—"}</TableCell>
                <TableCell><div className="flex gap-1 flex-wrap">{r.roles.map((x:string)=><Badge key={x} variant="secondary">{x}</Badge>)}</div></TableCell>
                <TableCell>{r.joining_date ? fmtDate(r.joining_date) : "—"}</TableCell>
                <TableCell><Badge variant={r.status==="active"?"default":"outline"}>{r.status}</Badge></TableCell>
                <TableCell>
                  {r.status === "active"
                    ? <Button size="sm" variant="outline" onClick={()=>setStatus(r.id, "inactive")}>Deactivate</Button>
                    : <Button size="sm" onClick={()=>setStatus(r.id, "active")}>Activate</Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}