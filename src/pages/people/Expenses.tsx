import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "./PeopleLayout";
import { LoadingCards, EmptyState, StatusBadge } from "./_ui";
import { Wallet, Plus, Trash2, Send, Upload } from "lucide-react";
import { toast } from "sonner";
import { fmtDate } from "./_hooks";

type Ctx = { user: any };

export default function Expenses() {
  const { user } = useOutletContext<Ctx>();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [activeReport, setActiveReport] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [openNew, setOpenNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newForm, setNewForm] = useState({ purpose: "", currency: "USD" });
  const [itemForm, setItemForm] = useState({
    spent_on: new Date().toISOString().slice(0, 10),
    amount: "",
    category_id: "",
    merchant: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data: r }, { data: c }] = await Promise.all([
      supabase
        .from("expense_reports")
        .select("*")
        .eq("submitter_id", user.id)
        .order("created_at", { ascending: false }),
      supabase.from("expense_categories").select("*").eq("is_active", true).order("name"),
    ]);
    setReports(r ?? []);
    setCats(c ?? []);
    setLoading(false);
  };

  const loadItems = async (reportId: string) => {
    const { data } = await supabase
      .from("expense_items")
      .select("*, expense_categories(name)")
      .eq("report_id", reportId)
      .order("spent_on", { ascending: false });
    setItems(data ?? []);
  };

  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    if (activeReport) loadItems(activeReport.id);
    else setItems([]);
  }, [activeReport?.id]);

  const createReport = async () => {
    if (!newTitle.trim()) return toast.error("Title required");
    const { data, error } = await supabase
      .from("expense_reports")
      .insert({ submitter_id: user.id, title: newTitle.trim(), purpose: newForm.purpose || null, currency: newForm.currency })
      .select()
      .single();
    if (error) return toast.error(error.message);
    toast.success("Report created");
    setOpenNew(false);
    setNewTitle("");
    setNewForm({ purpose: "", currency: "USD" });
    await load();
    setActiveReport(data);
  };

  const addItem = async () => {
    if (!activeReport) return;
    const amount = Number(itemForm.amount);
    if (!amount || amount <= 0) return toast.error("Enter a valid amount");

    let receipt_url: string | null = null;
    if (file) {
      const path = `${user.id}/expenses/${activeReport.id}/${Date.now()}_${file.name}`;
      const up = await supabase.storage.from("people-documents").upload(path, file);
      if (up.error) return toast.error(up.error.message);
      receipt_url = up.data.path;
    }

    const { error } = await supabase.from("expense_items").insert({
      report_id: activeReport.id,
      spent_on: itemForm.spent_on,
      amount,
      currency: activeReport.currency,
      category_id: itemForm.category_id || null,
      merchant: itemForm.merchant || null,
      description: itemForm.description || null,
      receipt_url,
    });
    if (error) return toast.error(error.message);

    // update report total
    const newTotal = items.reduce((s, i) => s + Number(i.amount), 0) + amount;
    await supabase.from("expense_reports").update({ total: newTotal }).eq("id", activeReport.id);

    toast.success("Item added");
    setItemForm({ spent_on: new Date().toISOString().slice(0, 10), amount: "", category_id: "", merchant: "", description: "" });
    setFile(null);
    await loadItems(activeReport.id);
    await load();
  };

  const removeItem = async (id: string, amount: number) => {
    await supabase.from("expense_items").delete().eq("id", id);
    const newTotal = items.filter((i) => i.id !== id).reduce((s, i) => s + Number(i.amount), 0);
    await supabase.from("expense_reports").update({ total: newTotal }).eq("id", activeReport.id);
    await loadItems(activeReport.id);
    await load();
  };

  const submitReport = async () => {
    if (!activeReport) return;
    if (items.length === 0) return toast.error("Add at least one item");
    const { error } = await supabase
      .from("expense_reports")
      .update({ status: "submitted", submitted_at: new Date().toISOString() })
      .eq("id", activeReport.id);
    if (error) return toast.error(error.message);
    toast.success("Report submitted for approval");
    setActiveReport(null);
    await load();
  };

  const deleteReport = async (id: string) => {
    if (!confirm("Delete this draft report?")) return;
    const { error } = await supabase.from("expense_reports").delete().eq("id", id);
    if (error) return toast.error(error.message);
    if (activeReport?.id === id) setActiveReport(null);
    await load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        subtitle="Create expense reports, attach receipts and submit for approval."
        actions={
          <Button onClick={() => setOpenNew(true)}>
            <Plus className="h-4 w-4 mr-2" /> New report
          </Button>
        }
      />

      {loading ? (
        <LoadingCards />
      ) : reports.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No expense reports yet"
          description="Track business expenses, upload receipts, and submit for reimbursement."
          action={<Button onClick={() => setOpenNew(true)}><Plus className="h-4 w-4 mr-2" />Create your first report</Button>}
        />
      ) : (
        <div className="grid lg:grid-cols-[minmax(260px,340px)_1fr] gap-4">
          <Card className="p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground px-2 pb-2">Reports</div>
            <div className="space-y-1">
              {reports.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setActiveReport(r)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    activeReport?.id === r.id
                      ? "bg-primary/10 border-primary/40"
                      : "border-transparent hover:bg-secondary"
                  }`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="font-medium truncate">{r.title}</div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {r.currency} {Number(r.total).toFixed(2)} · {fmtDate(r.created_at)}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            {!activeReport ? (
              <Card className="p-10 text-center text-muted-foreground">
                Select a report on the left to view items.
              </Card>
            ) : (
              <>
                <Card className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="font-serif text-xl">{activeReport.title}</div>
                      {activeReport.purpose && (
                        <div className="text-sm text-muted-foreground mt-1">{activeReport.purpose}</div>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <StatusBadge status={activeReport.status} />
                        <span className="text-sm text-muted-foreground">
                          Total: <b>{activeReport.currency} {Number(activeReport.total).toFixed(2)}</b>
                        </span>
                      </div>
                    </div>
                    {activeReport.status === "draft" && (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => deleteReport(activeReport.id)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                        <Button onClick={submitReport}>
                          <Send className="h-4 w-4 mr-2" /> Submit
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>

                {activeReport.status === "draft" && (
                  <Card className="p-5">
                    <div className="font-medium mb-3">Add expense item</div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <Label>Date</Label>
                        <Input type="date" value={itemForm.spent_on} onChange={(e) => setItemForm({ ...itemForm, spent_on: e.target.value })} />
                      </div>
                      <div>
                        <Label>Amount</Label>
                        <Input type="number" step="0.01" value={itemForm.amount} onChange={(e) => setItemForm({ ...itemForm, amount: e.target.value })} />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Select value={itemForm.category_id} onValueChange={(v) => setItemForm({ ...itemForm, category_id: v })}>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>
                            {cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Merchant</Label>
                        <Input value={itemForm.merchant} onChange={(e) => setItemForm({ ...itemForm, merchant: e.target.value })} />
                      </div>
                      <div className="sm:col-span-2">
                        <Label>Description</Label>
                        <Textarea rows={2} value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} />
                      </div>
                      <div className="sm:col-span-2 lg:col-span-3">
                        <Label>Receipt (optional)</Label>
                        <Input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button onClick={addItem}><Upload className="h-4 w-4 mr-2" />Add item</Button>
                    </div>
                  </Card>
                )}

                <Card className="overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Merchant</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        {activeReport.status === "draft" && <TableHead />}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No items yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        items.map((it) => (
                          <TableRow key={it.id}>
                            <TableCell>{fmtDate(it.spent_on)}</TableCell>
                            <TableCell>{it.expense_categories?.name ?? "—"}</TableCell>
                            <TableCell>{it.merchant ?? "—"}</TableCell>
                            <TableCell className="text-right font-medium">
                              {activeReport.currency} {Number(it.amount).toFixed(2)}
                            </TableCell>
                            {activeReport.status === "draft" && (
                              <TableCell className="text-right">
                                <Button size="icon" variant="ghost" onClick={() => removeItem(it.id, Number(it.amount))}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Card>
              </>
            )}
          </div>
        </div>
      )}

      <Dialog open={openNew} onOpenChange={setOpenNew}>
        <DialogContent>
          <DialogHeader><DialogTitle>New expense report</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Client visit — Berlin" />
            </div>
            <div>
              <Label>Purpose</Label>
              <Textarea rows={2} value={newForm.purpose} onChange={(e) => setNewForm({ ...newForm, purpose: e.target.value })} />
            </div>
            <div>
              <Label>Currency</Label>
              <Input value={newForm.currency} onChange={(e) => setNewForm({ ...newForm, currency: e.target.value.toUpperCase() })} maxLength={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenNew(false)}>Cancel</Button>
            <Button onClick={createReport}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="text-xs text-muted-foreground">
        Manager? Review team submissions on <Link to="/people/expenses/approvals" className="underline">the approvals page</Link>.
      </div>
    </div>
  );
}