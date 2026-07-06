import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "./PeopleLayout";
import { LoadingCards, EmptyState, StatusBadge } from "./_ui";
import { Package, Plus } from "lucide-react";
import { toast } from "sonner";
import { fmtDate } from "./_hooks";

const CATEGORIES = ["laptop", "monitor", "phone", "headset", "access_card", "other"];

export default function AssetsAdmin() {
  const [assets, setAssets] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<Record<string, any>>({});
  const [reqs, setReqs] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [assignFor, setAssignFor] = useState<any | null>(null);
  const [assignUser, setAssignUser] = useState<string>("");
  const [form, setForm] = useState({ tag: "", name: "", category: "laptop", serial_no: "", condition: "good", notes: "" });

  const load = async () => {
    setLoading(true);
    const [{ data: a }, { data: aa }, { data: r }, { data: emp }] = await Promise.all([
      supabase.from("assets").select("*").order("created_at", { ascending: false }),
      supabase.from("asset_assignments").select("*, profiles!asset_assignments_user_id_fkey(full_name,email)").is("returned_at", null),
      supabase.from("asset_requests").select("*, profiles!asset_requests_user_id_fkey(full_name,email)").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id,full_name,email").eq("status", "active").order("full_name"),
    ]);
    setAssets(a ?? []);
    const map: Record<string, any> = {};
    (aa ?? []).forEach((x: any) => (map[x.asset_id] = x));
    setAssignments(map);
    setReqs(r ?? []);
    setEmployees(emp ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.tag || !form.name) return toast.error("Tag and name required");
    const { error } = await supabase.from("assets").insert(form);
    if (error) return toast.error(error.message);
    toast.success("Asset added"); setOpen(false); setForm({ tag: "", name: "", category: "laptop", serial_no: "", condition: "good", notes: "" }); load();
  };

  const assign = async () => {
    if (!assignUser) return toast.error("Pick an employee");
    const { error } = await supabase.from("asset_assignments").insert({ asset_id: assignFor.id, user_id: assignUser });
    if (error) return toast.error(error.message);
    await supabase.from("assets").update({ status: "assigned" }).eq("id", assignFor.id);
    setAssignFor(null); setAssignUser(""); toast.success("Assigned"); load();
  };

  const returnAsset = async (assetId: string) => {
    const a = assignments[assetId];
    if (!a) return;
    await supabase.from("asset_assignments").update({ returned_at: new Date().toISOString() }).eq("id", a.id);
    await supabase.from("assets").update({ status: "available" }).eq("id", assetId);
    load();
  };

  const decide = async (r: any, decision: "approved" | "rejected") => {
    const { error } = await supabase.from("asset_requests").update({
      status: decision, decided_at: new Date().toISOString(),
    }).eq("id", r.id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Asset Inventory" subtitle="Manage company equipment"
        actions={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Add asset</Button>} />

      <Tabs defaultValue="inv">
        <TabsList>
          <TabsTrigger value="inv">Inventory ({assets.length})</TabsTrigger>
          <TabsTrigger value="req">Requests ({reqs.filter((r) => r.status === "pending").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="inv">
          {loading ? <LoadingCards /> : assets.length === 0 ? (
            <EmptyState icon={Package} title="No assets yet" description="Add your first asset to start tracking." />
          ) : (
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag</TableHead><TableHead>Name</TableHead><TableHead>Category</TableHead>
                    <TableHead>Status</TableHead><TableHead>Assigned to</TableHead><TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((a) => {
                    const cur = assignments[a.id];
                    return (
                      <TableRow key={a.id}>
                        <TableCell className="font-mono text-xs">{a.tag}</TableCell>
                        <TableCell>{a.name}</TableCell>
                        <TableCell className="capitalize">{a.category}</TableCell>
                        <TableCell><StatusBadge status={a.status} /></TableCell>
                        <TableCell className="text-sm">{cur?.profiles?.full_name ?? "—"}</TableCell>
                        <TableCell className="text-right">
                          {cur ? (
                            <Button size="sm" variant="outline" onClick={() => returnAsset(a.id)}>Return</Button>
                          ) : (
                            <Button size="sm" onClick={() => setAssignFor(a)}>Assign</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="req">
          {reqs.length === 0 ? (
            <EmptyState icon={Package} title="No requests" />
          ) : (
            <div className="space-y-2">
              {reqs.map((r) => (
                <Card key={r.id} className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{r.profiles?.full_name} · <span className="capitalize">{r.category}</span></div>
                      <div className="text-sm text-muted-foreground mt-1">{r.reason}</div>
                      <div className="text-xs text-muted-foreground mt-1">{fmtDate(r.created_at)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={r.status} />
                      {r.status === "pending" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => decide(r, "rejected")}>Reject</Button>
                          <Button size="sm" onClick={() => decide(r, "approved")}>Approve</Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add asset</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Tag</Label><Input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} placeholder="LT-001" /></div>
              <div><Label>Serial No.</Label><Input value={form.serial_no} onChange={(e) => setForm({ ...form, serial_no: e.target.value })} /></div>
            </div>
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="MacBook Pro 14" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c.replace("_", " ")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Condition</Label>
                <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["new","good","fair","poor"].map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter><Button onClick={create}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!assignFor} onOpenChange={(v) => !v && setAssignFor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign {assignFor?.name}</DialogTitle></DialogHeader>
          <div>
            <Label>Employee</Label>
            <Select value={assignUser} onValueChange={setAssignUser}>
              <SelectTrigger><SelectValue placeholder="Pick an employee" /></SelectTrigger>
              <SelectContent>{employees.map((e) => <SelectItem key={e.id} value={e.id}>{e.full_name ?? e.email}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter><Button onClick={assign}>Assign</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}