import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "./PeopleLayout";
import { usePeopleAuth, fmtDate } from "./_hooks";
import { Loader2, Download, Eye, Wallet } from "lucide-react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const money = (n: number, cur = "INR") =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(Number(n || 0));

interface Payslip {
  id: string; period_month: number; period_year: number; currency: string;
  gross: number; total_deductions: number; net_pay: number; status: string;
  working_days: number; lop_days: number; issued_at: string | null;
  earnings: Record<string, number>; deductions: Record<string, number>;
}

export default function Payslips() {
  const { user, profile } = usePeopleAuth();
  const [rows, setRows] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<Payslip | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("payslips").select("*")
        .eq("employee_id", user.id).eq("status", "issued")
        .order("period_year", { ascending: false }).order("period_month", { ascending: false });
      setRows((data as any) ?? []); setLoading(false);
    })();
  }, [user]);

  const ytd = useMemo(() => {
    const y = new Date().getFullYear();
    return rows.filter(r => r.period_year === y).reduce((a, r) => a + Number(r.net_pay), 0);
  }, [rows]);

  const download = (p: Payslip) => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rowsHtml = (obj: Record<string, number>) =>
      Object.entries(obj || {}).map(([k, v]) => `<tr><td style="padding:6px 0;text-transform:capitalize">${k.replace(/_/g, " ")}</td><td style="text-align:right">${money(Number(v), p.currency)}</td></tr>`).join("");
    w.document.write(`<!doctype html><html><head><title>Payslip ${MONTHS[p.period_month-1]} ${p.period_year}</title>
      <style>body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:24px;color:#111}h1{margin:0;font-size:22px}.muted{color:#666;font-size:13px}table{width:100%;border-collapse:collapse}.card{border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-top:16px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.total{border-top:2px solid #111;margin-top:12px;padding-top:8px;display:flex;justify-content:space-between;font-weight:700}</style></head><body>
      <div style="display:flex;justify-content:space-between;align-items:start"><div><h1>Purelytics</h1><div class="muted">Payslip · ${MONTHS[p.period_month-1]} ${p.period_year}</div></div>
      <div style="text-align:right"><div><b>${profile?.full_name ?? ""}</b></div><div class="muted">${profile?.email ?? ""}</div><div class="muted">${profile?.designation ?? ""}</div></div></div>
      <div class="card"><div class="grid"><div><div class="muted">Working Days</div><b>${p.working_days}</b></div><div><div class="muted">LOP Days</div><b>${p.lop_days}</b></div></div></div>
      <div class="grid" style="margin-top:16px">
        <div class="card"><b>Earnings</b><table>${rowsHtml(p.earnings)}</table><div class="total"><span>Gross</span><span>${money(p.gross, p.currency)}</span></div></div>
        <div class="card"><b>Deductions</b><table>${rowsHtml(p.deductions)}</table><div class="total"><span>Total</span><span>${money(p.total_deductions, p.currency)}</span></div></div>
      </div>
      <div class="card" style="background:#f9fafb"><div class="total" style="border:0;padding:0;font-size:18px"><span>Net Pay</span><span>${money(p.net_pay, p.currency)}</span></div></div>
      <div class="muted" style="margin-top:24px;text-align:center">This is a system-generated payslip. Issued on ${p.issued_at ? fmtDate(p.issued_at) : "—"}.</div>
      <script>window.print()</script></body></html>`);
    w.document.close();
  };

  return (
    <div>
      <PageHeader title="My Payslips" subtitle="Download your monthly pay statements." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4"><div className="flex items-center gap-3"><Wallet className="h-5 w-5 text-primary" /><div><div className="text-2xl font-semibold">{rows.length}</div><div className="text-xs text-muted-foreground">Payslips issued</div></div></div></Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Latest Net Pay</div><div className="text-2xl font-semibold mt-1">{rows[0] ? money(rows[0].net_pay, rows[0].currency) : "—"}</div>{rows[0] && <div className="text-xs text-muted-foreground">{MONTHS[rows[0].period_month-1]} {rows[0].period_year}</div>}</Card>
        <Card className="p-4"><div className="text-xs text-muted-foreground">Year-to-date (net)</div><div className="text-2xl font-semibold mt-1">{money(ytd)}</div></Card>
      </div>

      <Card className="p-4">
        {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (
          <Table>
            <TableHeader><TableRow><TableHead>Period</TableHead><TableHead>Gross</TableHead><TableHead>Deductions</TableHead><TableHead>Net Pay</TableHead><TableHead>Issued</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{MONTHS[p.period_month-1]} {p.period_year}</TableCell>
                  <TableCell>{money(p.gross, p.currency)}</TableCell>
                  <TableCell>{money(p.total_deductions, p.currency)}</TableCell>
                  <TableCell className="font-semibold">{money(p.net_pay, p.currency)}</TableCell>
                  <TableCell>{p.issued_at ? fmtDate(p.issued_at) : "—"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="ghost" onClick={() => setView(p)}><Eye className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => download(p)}><Download className="h-4 w-4 mr-1" /> PDF</Button>
                  </TableCell>
                </TableRow>
              ))}
              {!rows.length && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No payslips issued yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={!!view} onOpenChange={o => !o && setView(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{view && `${MONTHS[view.period_month-1]} ${view.period_year}`}</DialogTitle></DialogHeader>
          {view && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2"><div className="text-muted-foreground">Working days</div><div className="text-right">{view.working_days}</div><div className="text-muted-foreground">LOP</div><div className="text-right">{view.lop_days}</div></div>
              <div><div className="font-semibold mb-1">Earnings</div>{Object.entries(view.earnings || {}).map(([k, v]) => <div key={k} className="flex justify-between capitalize"><span>{k.replace(/_/g," ")}</span><span>{money(Number(v), view.currency)}</span></div>)}<div className="flex justify-between font-semibold border-t pt-1 mt-1"><span>Gross</span><span>{money(view.gross, view.currency)}</span></div></div>
              <div><div className="font-semibold mb-1">Deductions</div>{Object.entries(view.deductions || {}).map(([k, v]) => <div key={k} className="flex justify-between capitalize"><span>{k.replace(/_/g," ")}</span><span>{money(Number(v), view.currency)}</span></div>)}<div className="flex justify-between font-semibold border-t pt-1 mt-1"><span>Total</span><span>{money(view.total_deductions, view.currency)}</span></div></div>
              <div className="flex justify-between text-lg font-semibold border-t-2 pt-2"><span>Net Pay</span><span>{money(view.net_pay, view.currency)}</span></div>
              <Badge>{view.status}</Badge>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}