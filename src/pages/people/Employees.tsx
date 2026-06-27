import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "./PeopleLayout";
import { fmtDate, initials } from "./_hooks";
import { toast } from "sonner";
import { Plus, Copy, Search, Loader2, UserPlus } from "lucide-react";

type Role = "employee" | "manager" | "admin";

interface FormState {
  full_name: string;
  email: string;
  employee_id: string;
  designation: string;
  department_id: string;
  role: Role;
  joining_date: string;
  manager_id: string;
  employment_type: string;
  work_mode: string;
  location: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  address: string;
  blood_group: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  use_custom_password: boolean;
  password: string;
}

const emptyForm: FormState = {
  full_name: "", email: "", employee_id: "", designation: "", department_id: "",
  role: "employee", joining_date: new Date().toISOString().slice(0, 10), manager_id: "",
  employment_type: "full_time", work_mode: "office", location: "",
  phone: "", gender: "", date_of_birth: "", address: "", blood_group: "",
  emergency_contact_name: "", emergency_contact_phone: "",
  use_custom_password: false, password: "",
};

export default function Employees() {
  const [rows, setRows] = useState<any[]>([]);
  const [depts, setDepts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState("");
  const [provisioned, setProvisioned] = useState<{ email: string; tempPassword: string } | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const load = async () => {
    const [{ data: p }, { data: d }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("departments").select("*").order("name"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const roleMap: Record<string, string[]> = {};
    (r ?? []).forEach((x: any) => { roleMap[x.user_id] = [...(roleMap[x.user_id] ?? []), x.role]; });
    setRows((p ?? []).map((x: any) => ({ ...x, roles: roleMap[x.id] ?? [] })));
    setDepts(d ?? []);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const s = q.toLowerCase();
    return rows.filter((r) =>
      [r.full_name, r.email, r.designation, r.employee_id, r.location]
        .filter(Boolean).some((v: string) => v.toLowerCase().includes(s)));
  }, [rows, q]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.full_name.trim() || !form.email.trim()) return toast.error("Name and work email are required");
    if (form.use_custom_password && form.password.length < 8) return toast.error("Password must be at least 8 characters");

    setBusy(true);
    const payload: any = { ...form };
    if (!payload.manager_id) delete payload.manager_id;
    if (!payload.department_id) delete payload.department_id;
    if (!payload.use_custom_password) delete payload.password;
    delete payload.use_custom_password;
    Object.keys(payload).forEach((k) => { if (payload[k] === "") delete payload[k]; });

    const { data, error } = await supabase.functions.invoke("provision-employee", { body: payload });
    setBusy(false);
    if (error) return toast.error(error.message || "Could not create account");
    if ((data as any)?.error) return toast.error((data as any).error);
    setProvisioned({ email: form.email, tempPassword: (data as any).tempPassword });
    setOpen(false);
    setForm(emptyForm);
    load();
  };

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const deptName = (id?: string) => depts.find((d) => d.id === id)?.name ?? "—";

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle="Provision accounts, set roles, and manage your workforce."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><UserPlus className="h-4 w-4 mr-2" />Add employee</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">New employee</DialogTitle>
                <p className="text-sm text-muted-foreground">Create their account and seed their profile in one step.</p>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Identity */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2"><Label>Full name *</Label>
                    <Input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Anita Sharma" /></div>
                  <div><Label>Work email *</Label>
                    <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="anita@purelytics.tech" /></div>
                  <div><Label>Employee ID</Label>
                    <Input value={form.employee_id} onChange={(e) => set("employee_id", e.target.value)} placeholder="PUR-0024" /></div>
                  <div>
                    <Label>Role</Label>
                    <Select value={form.role} onValueChange={(v: Role) => set("role", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Joining date</Label>
                    <Input type="date" value={form.joining_date} onChange={(e) => set("joining_date", e.target.value)} /></div>
                  <div><Label>Designation</Label>
                    <Input value={form.designation} onChange={(e) => set("designation", e.target.value)} placeholder="Product Designer" /></div>
                  <div>
                    <Label>Department</Label>
                    <Select value={form.department_id} onValueChange={(v) => set("department_id", v)}>
                      <SelectTrigger><SelectValue placeholder="Pick department" /></SelectTrigger>
                      <SelectContent>
                        {depts.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Employment type</Label>
                    <Select value={form.employment_type} onValueChange={(v) => set("employment_type", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_time">Full-time</SelectItem>
                        <SelectItem value="part_time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Work mode</Label>
                    <Select value={form.work_mode} onValueChange={(v) => set("work_mode", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="office">In office</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Location</Label>
                    <Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Hyderabad, IN" /></div>
                  <div className="col-span-2">
                    <Label>Reports to</Label>
                    <Select value={form.manager_id} onValueChange={(v) => set("manager_id", v)}>
                      <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                      <SelectContent>
                        {rows.map((r) => <SelectItem key={r.id} value={r.id}>{r.full_name ?? r.email}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Phone</Label>
                    <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 ..." /></div>
                  <div><Label>Date of birth</Label>
                    <Input type="date" value={form.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} /></div>
                  <div>
                    <Label>Gender</Label>
                    <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                      <SelectTrigger><SelectValue placeholder="Pick" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="non_binary">Non-binary</SelectItem>
                        <SelectItem value="prefer_not">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Blood group</Label>
                    <Input value={form.blood_group} onChange={(e) => set("blood_group", e.target.value)} placeholder="O+" /></div>
                  <div className="col-span-2"><Label>Address</Label>
                    <Textarea rows={2} value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
                  <div><Label>Emergency contact name</Label>
                    <Input value={form.emergency_contact_name} onChange={(e) => set("emergency_contact_name", e.target.value)} /></div>
                  <div><Label>Emergency contact phone</Label>
                    <Input value={form.emergency_contact_phone} onChange={(e) => set("emergency_contact_phone", e.target.value)} /></div>
                </div>

                {/* Password */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Set a password manually</Label>
                      <p className="text-xs text-muted-foreground">If off, a secure temporary password is generated.</p>
                    </div>
                    <Switch checked={form.use_custom_password} onCheckedChange={(v) => set("use_custom_password", v)} />
                  </div>
                  {form.use_custom_password && (
                    <Input
                      type="text"
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      placeholder="Min 8 characters"
                      className="mt-2 font-mono"
                    />
                  )}
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
                <Button onClick={submit} disabled={busy}>
                  {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Create account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Dialog open={!!provisioned} onOpenChange={(o) => !o && setProvisioned(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif text-xl">Account created</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Share these credentials with the employee. They can change their password after first sign-in.
          </p>
          <Card className="p-4 space-y-2 mt-2 bg-secondary/40">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Email</span>
              <span className="font-mono">{provisioned?.email}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Password</span>
              <div className="flex items-center gap-2">
                <span className="font-mono">{provisioned?.tempPassword}</span>
                <Button size="icon" variant="ghost" onClick={() => { navigator.clipboard.writeText(provisioned!.tempPassword); toast.success("Copied"); }}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
          <DialogFooter><Button onClick={() => setProvisioned(null)}>Done</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, designation, ID..."
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">{filtered.length} of {rows.length}</div>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {initials(r.full_name, r.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{r.full_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground truncate">{r.designation ?? r.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{r.employee_id ?? "—"}</TableCell>
                <TableCell className="text-sm">{deptName(r.department_id)}</TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {r.roles.length === 0 && <Badge variant="outline">employee</Badge>}
                    {r.roles.map((x: string) => <Badge key={x} variant="secondary">{x}</Badge>)}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{r.joining_date ? fmtDate(r.joining_date) : "—"}</TableCell>
                <TableCell>
                  <Badge variant={r.status === "active" ? "default" : "outline"}>{r.status}</Badge>
                </TableCell>
                <TableCell>
                  {r.status === "active"
                    ? <Button size="sm" variant="outline" onClick={() => setStatus(r.id, "inactive")}>Deactivate</Button>
                    : <Button size="sm" onClick={() => setStatus(r.id, "active")}>Activate</Button>}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-12">
                  No employees match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}