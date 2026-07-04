import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "./PeopleLayout";
import { usePeopleAuth, fmtDate } from "./_hooks";
import { toast } from "sonner";
import { Loader2, Plus, PlayCircle, CheckCircle2, IndianRupee, Users, FileCheck2 } from "lucide-react";
import { Navigate } from "react-router-dom";

interface Profile { id: string; full_name: string | null; email: string | null; employee_id?: string | null; }
interface Salary {
  id: string; employee_id: string; currency: string;
  basic: number; hra: number; special_allowance: number; other_allowances: number;
  pf_deduction: number; tax_deduction: number; other_deductions: number;
  ctc_annual: number; effective_from: string;
}
interface Run {
  id: string; period_month: number; period_year: number; status: string;
  total_gross: number; total_net: number; total_deductions: number; employee_count: number;
  created_at: string; finalized_at: string | null;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const money = (n: number, cur = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(Number(n || 0));

export default function Payroll() {
  const { isAdmin, loading: authLoading } = usePeopleAuth();
  const [tab, setTab] = useState("runs");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [salaryDlg, setSalaryDlg] = useState(false);
  const [runDlg, setRunDlg] = useState(false);
  const [editing, setEditing] = useState<Salary | null>(null);
  const [selEmp, setSelEmp] = useState<string>("");
  const [form, setForm] = useState({ basic: 0, hra: 0, special_allowance: 0, other_allowances: 0, pf_deduction: 0, tax_deduction: 0, other_deductions: 0, currency: "INR", effective_from: new Date().toISOString().slice(0, 10) });
  const [runForm, setRunForm] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear(), notes: "" });
  const [processing, setProcessing] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: p }, { data: s }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, employee_id").eq("status", "active").order("full_name"),
      supabase.from("salary_structures").select("*").order("effective_from", { ascending: false }),
      supabase.from("payroll_runs").select("*").order("period_year", { ascending: false }).order("period_month", { ascending: false }),
    ]);
    setProfiles((p as any) ?? []); setSalaries((s as any) ?? []); setRuns((r as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const gross = form.basic + form.hra + form.special_allowance + form.other_allowances;
  const ded = form.pf_deduction + form.tax_deduction + form.other_deductions;
  const netMonthly = gross - ded;
  const ctc = gross * 12;

  const openSalary = (s?: Salary) => {
    if (s) {
      setEditing(s); setSelEmp(s.employee_id);
      setForm({ basic: s.basic, hra: s.hra, special_allowance: s.special_allowance, other_allowances: s.other_allowances, pf_deduction: s.pf_deduction, tax_deduction: s.tax_deduction, other_deductions: s.other_deductions, currency: s.currency, effective_from: s.effective_from });
    } else {
      setEditing(null); setSelEmp("");
      setForm({ basic: 0, hra: 0, special_allowance: 0, other_allowances: 0, pf_deduction: 0, tax_deduction: 0, other_deductions: 0, currency: "INR", effective_from: new Date().toISOString().slice(0, 10) });
    }
    setSalaryDlg(true);
  };

  const saveSalary = async () => {
    if (!selEmp) return toast.error("Select an employee");
    const payload = { ...form, employee_id: selEmp, ctc_annual: ctc };
    const q = editing
      ? supabase.from("salary_structures").update(payload).eq("id", editing.id)
      : supabase.from("salary_structures").insert(payload);
    const { error } = await q;
    if (error) return toast.error(error.message);
    toast.success(editing ? "Salary updated" : "Salary structure saved");
    setSalaryDlg(false); load();
  };

  const createRun = async () => {
    const { data: existing } = await supabase.from("payroll_runs").select("id")
      .eq("period_year", runForm.year).eq("period_month", runForm.month).maybeSingle();
    if (existing) return toast.error("A run for this month already exists");
    const { data, error } = await supabase.from("payroll_runs").insert({
      period_month: runForm.month, period_year: runForm.year, status: "draft", notes: runForm.notes,
    }).select().single();
    if (error) return toast.error(error.message);
    toast.success("Payroll run created"); setRunDlg(false); load();
    // auto-generate draft payslips
    await generatePayslips((data as any).id, runForm.month, runForm.year);
  };

  const generatePayslips = async (runId: string, month: number, year: number) => {
    setProcessing(runId);
    // load latest salary per employee effective on or before period end
    const periodEnd = new Date(year, month, 0).toISOString().slice(0, 10);
    const { data: sals } = await supabase.from("salary_structures").select("*")
      .lte("effective_from", periodEnd).order("effective_from", { ascending: false });
    const latestByEmp = new Map<string, any>();
    (sals ?? []).forEach((s: any) => { if (!latestByEmp.has(s.employee_id)) latestByEmp.set(s.employee_id, s); });

    const workingDays = new Date(year, month, 0).getDate();
    const rows: any[] = [];
    let totGross = 0, totNet = 0, totDed = 0;
    latestByEmp.forEach((s) => {
      const earnings = { basic: s.basic, hra: s.hra, special_allowance: s.special_allowance, other_allowances: s.other_allowances };
      const deductions = { pf: s.pf_deduction, tax: s.tax_deduction, other: s.other_deductions };
      const gross = s.basic + s.hra + s.special_allowance + s.other_allowances;
      const totalDed = s.pf_deduction + s.tax_deduction + s.other_deductions;
      const net = gross - totalDed;
      totGross += gross; totNet += net; totDed += totalDed;
      rows.push({
        run_id: runId, employee_id: s.employee_id, period_month: month, period_year: year,
        currency: s.currency, working_days: workingDays, lop_days: 0,
        earnings, deductions, gross, total_deductions: totalDed, net_pay: net, status: "draft",
      });
    });
    if (rows.length) {
      const { error } = await supabase.from("payslips").upsert(rows, { onConflict: "run_id,employee_id" });
      if (error) { toast.error(error.message); setProcessing(null); return; }
    }
    await supabase.from("payroll_runs").update({
      total_gross: totGross, total_net: totNet, total_deductions: totDed,
      employee_count: rows.length, status: "processing",
    }).eq("id", runId);
    toast.success(`Generated ${rows.length} payslips`);
    setProcessing(null); load();
  };

  const finalizeRun = async (runId: string) => {
    setProcessing(runId);
    await supabase.from("payslips").update({ status: "issued", issued_at: new Date().toISOString() }).eq("run_id", runId);
    await supabase.from("payroll_runs").update({ status: "finalized", finalized_at: new Date().toISOString() }).eq("id", runId);
    toast.success("Payroll finalized — payslips issued");
    setProcessing(null); load();
  };

  const empName = (id: string) => profiles.find(p => p.id === id)?.full_name || profiles.find(p => p.id === id)?.email || "—";

  const summary = useMemo(() => {
    const covered = new Set(salaries.map(s => s.employee_id)).size;
    const monthly = salaries.reduce((acc: Record<string, number>, s) => {
      if (!acc[s.employee_id]) acc[s.employee_id] = s.basic + s.hra + s.special_allowance + s.other_allowances;
      return acc;
    }, {});
    const monthlyTotal = Object.values(monthly).reduce((a, b) => a + b, 0);
    return { covered, uncovered: profiles.length - covered, monthlyTotal };
  }, [salaries, profiles]);

  if (authLoading) return <div className="flex justify-center p-12"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!isAdmin) return <Navigate to="/people" replace />;

  return (
    <div>
      <PageHeader title="Payroll" subtitle="Manage salary structures, run monthly payroll and issue payslips." />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4"><div className="flex items-center gap-3"><Users className="h-5 w-5 text-primary" /><div><div className="text-2xl font-semibold">{summary.covered}</div><div className="text-xs text-muted-foreground">Employees on payroll</div></div></div></Card>
        <Card className="p-4"><div className="flex items-center gap-3"><IndianRupee className="h-5 w-5 text-primary" /><div><div className="text-2xl font-semibold">{money(summary.monthlyTotal)}</div><div className="text-xs text-muted-foreground">Monthly gross (current)</div></div></div></Card>
        <Card className="p-4"><div className="flex items-center gap-3"><FileCheck2 className="h-5 w-5 text-primary" /><div><div className="text-2xl font-semibold">{runs.filter(r => r.status === "finalized").length}</div><div className="text-xs text-muted-foreground">Runs finalized</div></div></div></Card>
        <Card className="p-4"><div className="flex items-center gap-3"><PlayCircle className="h-5 w-5 text-primary" /><div><div className="text-2xl font-semibold">{runs.filter(r => r.status !== "finalized").length}</div><div className="text-xs text-muted-foreground">Runs in progress</div></div></div></Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList><TabsTrigger value="runs">Payroll Runs</TabsTrigger><TabsTrigger value="salaries">Salary Structures</TabsTrigger></TabsList>

        <TabsContent value="runs" className="mt-4">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">{runs.length} run(s)</div>
              <Button onClick={() => setRunDlg(true)}><Plus className="h-4 w-4 mr-1" /> New Run</Button>
            </div>
            {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (
              <Table>
                <TableHeader><TableRow><TableHead>Period</TableHead><TableHead>Employees</TableHead><TableHead>Gross</TableHead><TableHead>Deductions</TableHead><TableHead>Net Payout</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {runs.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{MONTHS[r.period_month - 1]} {r.period_year}</TableCell>
                      <TableCell>{r.employee_count}</TableCell>
                      <TableCell>{money(r.total_gross)}</TableCell>
                      <TableCell>{money(r.total_deductions)}</TableCell>
                      <TableCell className="font-semibold">{money(r.total_net)}</TableCell>
                      <TableCell><Badge variant={r.status === "finalized" ? "default" : r.status === "processing" ? "secondary" : "outline"}>{r.status}</Badge></TableCell>
                      <TableCell className="text-right space-x-2">
                        {r.status === "draft" && <Button size="sm" variant="outline" disabled={processing === r.id} onClick={() => generatePayslips(r.id, r.period_month, r.period_year)}>{processing === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Generate"}</Button>}
                        {r.status === "processing" && <Button size="sm" disabled={processing === r.id} onClick={() => finalizeRun(r.id)}><CheckCircle2 className="h-3 w-3 mr-1" /> Finalize</Button>}
                        {r.status === "processing" && <Button size="sm" variant="outline" disabled={processing === r.id} onClick={() => generatePayslips(r.id, r.period_month, r.period_year)}>Regenerate</Button>}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!runs.length && <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No payroll runs yet.</TableCell></TableRow>}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="salaries" className="mt-4">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-muted-foreground">{summary.uncovered} employee(s) without a salary structure</div>
              <Button onClick={() => openSalary()}><Plus className="h-4 w-4 mr-1" /> Add Structure</Button>
            </div>
            {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (
              <Table>
                <TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>CTC (Annual)</TableHead><TableHead>Monthly Gross</TableHead><TableHead>Deductions</TableHead><TableHead>Effective From</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {salaries.map(s => {
                    const g = s.basic + s.hra + s.special_allowance + s.other_allowances;
                    const d = s.pf_deduction + s.tax_deduction + s.other_deductions;
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{empName(s.employee_id)}</TableCell>
                        <TableCell>{money(s.ctc_annual, s.currency)}</TableCell>
                        <TableCell>{money(g, s.currency)}</TableCell>
                        <TableCell>{money(d, s.currency)}</TableCell>
                        <TableCell>{fmtDate(s.effective_from)}</TableCell>
                        <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => openSalary(s)}>Edit</Button></TableCell>
                      </TableRow>
                    );
                  })}
                  {!salaries.length && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No salary structures configured.</TableCell></TableRow>}
                </TableBody>
              </Table>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* Salary Dialog */}
      <Dialog open={salaryDlg} onOpenChange={setSalaryDlg}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Salary Structure</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Employee</Label>
              <Select value={selEmp} onValueChange={setSelEmp} disabled={!!editing}>
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>{profiles.map(p => <SelectItem key={p.id} value={p.id}>{p.full_name || p.email}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Currency</Label><Input value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value.toUpperCase() })} /></div>
            <div><Label>Effective From</Label><Input type="date" value={form.effective_from} onChange={e => setForm({ ...form, effective_from: e.target.value })} /></div>

            <div className="col-span-2 mt-2 text-sm font-semibold text-foreground">Earnings (monthly)</div>
            <div><Label>Basic</Label><Input type="number" value={form.basic} onChange={e => setForm({ ...form, basic: +e.target.value })} /></div>
            <div><Label>HRA</Label><Input type="number" value={form.hra} onChange={e => setForm({ ...form, hra: +e.target.value })} /></div>
            <div><Label>Special Allowance</Label><Input type="number" value={form.special_allowance} onChange={e => setForm({ ...form, special_allowance: +e.target.value })} /></div>
            <div><Label>Other Allowances</Label><Input type="number" value={form.other_allowances} onChange={e => setForm({ ...form, other_allowances: +e.target.value })} /></div>

            <div className="col-span-2 mt-2 text-sm font-semibold text-foreground">Deductions (monthly)</div>
            <div><Label>PF</Label><Input type="number" value={form.pf_deduction} onChange={e => setForm({ ...form, pf_deduction: +e.target.value })} /></div>
            <div><Label>Tax (TDS)</Label><Input type="number" value={form.tax_deduction} onChange={e => setForm({ ...form, tax_deduction: +e.target.value })} /></div>
            <div className="col-span-2"><Label>Other Deductions</Label><Input type="number" value={form.other_deductions} onChange={e => setForm({ ...form, other_deductions: +e.target.value })} /></div>

            <div className="col-span-2 rounded-lg bg-secondary/50 p-3 grid grid-cols-3 gap-4 text-sm">
              <div><div className="text-muted-foreground">Gross / mo</div><div className="font-semibold">{money(gross, form.currency)}</div></div>
              <div><div className="text-muted-foreground">Net / mo</div><div className="font-semibold">{money(netMonthly, form.currency)}</div></div>
              <div><div className="text-muted-foreground">CTC / yr</div><div className="font-semibold">{money(ctc, form.currency)}</div></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setSalaryDlg(false)}>Cancel</Button><Button onClick={saveSalary}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Run Dialog */}
      <Dialog open={runDlg} onOpenChange={setRunDlg}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Payroll Run</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Month</Label>
              <Select value={String(runForm.month)} onValueChange={v => setRunForm({ ...runForm, month: +v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{MONTHS.map((m, i) => <SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Year</Label><Input type="number" value={runForm.year} onChange={e => setRunForm({ ...runForm, year: +e.target.value })} /></div>
            <div className="col-span-2"><Label>Notes</Label><Textarea value={runForm.notes} onChange={e => setRunForm({ ...runForm, notes: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setRunDlg(false)}>Cancel</Button><Button onClick={createRun}>Create & Generate</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}