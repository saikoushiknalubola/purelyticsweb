import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Download, FileText, Loader2, Trash2, Upload, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "./PeopleLayout";
import { fmtDate } from "./_hooks";

type Ctx = { user: any; profile: any; isAdmin: boolean; isManager: boolean };

const CATEGORIES = [
  { v: "offer_letter", l: "Offer letter" },
  { v: "contract", l: "Contract" },
  { v: "id_proof", l: "ID proof" },
  { v: "address_proof", l: "Address proof" },
  { v: "education", l: "Education" },
  { v: "experience", l: "Experience" },
  { v: "payslip", l: "Payslip" },
  { v: "tax", l: "Tax" },
  { v: "other", l: "Other" },
];

function catLabel(v: string) {
  return CATEGORIES.find((c) => c.v === v)?.l ?? v;
}

function humanSize(b?: number | null) {
  if (!b) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
}

export default function Documents() {
  const { user, isAdmin } = useOutletContext<Ctx>();
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [scope, setScope] = useState<"me" | "all">("me");
  const [filterEmp, setFilterEmp] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    employee_id: user.id,
    category: "other",
    title: "",
    description: "",
    file: null as File | null,
  });

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("documents")
      .select("*, employee:profiles!documents_employee_id_fkey(id,full_name,email)")
      .order("created_at", { ascending: false });
    if (!isAdmin || scope === "me") q = q.eq("employee_id", user.id);
    else if (filterEmp !== "all") q = q.eq("employee_id", filterEmp);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setDocs(data ?? []);
    setLoading(false);
  };

  const loadEmployees = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id,full_name,email")
      .order("full_name");
    setEmployees(data ?? []);
  };

  useEffect(() => {
    load();
    if (isAdmin) loadEmployees();
  }, [scope, filterEmp]);

  const upload = async () => {
    if (!form.file || !form.title) {
      toast.error("Title and file are required");
      return;
    }
    setUploading(true);
    try {
      const targetEmp = isAdmin ? form.employee_id : user.id;
      const cleanName = form.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${targetEmp}/${Date.now()}_${cleanName}`;
      const { error: upErr } = await supabase.storage
        .from("people-documents")
        .upload(path, form.file, { contentType: form.file.type });
      if (upErr) throw upErr;

      const { error: insErr } = await supabase.from("documents").insert({
        employee_id: targetEmp,
        uploaded_by: user.id,
        category: form.category as any,
        title: form.title,
        description: form.description || null,
        file_path: path,
        file_name: form.file.name,
        file_size: form.file.size,
        mime_type: form.file.type,
      });
      if (insErr) throw insErr;

      toast.success("Document uploaded");
      setOpen(false);
      setForm({ employee_id: user.id, category: "other", title: "", description: "", file: null });
      load();
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const download = async (d: any) => {
    const { data, error } = await supabase.storage
      .from("people-documents")
      .createSignedUrl(d.file_path, 60);
    if (error || !data?.signedUrl) {
      toast.error("Unable to download");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const remove = async (d: any) => {
    if (!confirm(`Delete "${d.title}"?`)) return;
    await supabase.storage.from("people-documents").remove([d.file_path]);
    const { error } = await supabase.from("documents").delete().eq("id", d.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      load();
    }
  };

  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle="Securely store offer letters, ID proofs, contracts and other HR records"
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" /> Upload document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload a document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {isAdmin && (
                  <div>
                    <Label>Employee</Label>
                    <Select
                      value={form.employee_id}
                      onValueChange={(v) => setForm({ ...form, employee_id: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {employees.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.full_name || e.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.v} value={c.v}>{c.l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Aadhaar card"
                  />
                </div>
                <div>
                  <Label>Description (optional)</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>File</Label>
                  <Input
                    type="file"
                    onChange={(e) => setForm({ ...form, file: e.target.files?.[0] ?? null })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, image, or document. Max 25 MB.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={upload} disabled={uploading}>
                  {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Upload
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {isAdmin && (
        <div className="flex flex-wrap gap-3 mb-4">
          <Select value={scope} onValueChange={(v: "me" | "all") => setScope(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="me">My documents</SelectItem>
              <SelectItem value="all">All employees</SelectItem>
            </SelectContent>
          </Select>
          {scope === "all" && (
            <Select value={filterEmp} onValueChange={setFilterEmp}>
              <SelectTrigger className="w-[240px]">
                <Users className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All employees</SelectItem>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.full_name || e.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <Card>
        {loading ? (
          <div className="p-10 text-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
          </div>
        ) : docs.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
            No documents yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Category</TableHead>
                {isAdmin && scope === "all" && <TableHead>Employee</TableHead>}
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <div className="font-medium">{d.title}</div>
                    <div className="text-xs text-muted-foreground">{d.file_name}</div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{catLabel(d.category)}</Badge></TableCell>
                  {isAdmin && scope === "all" && (
                    <TableCell className="text-sm">
                      {d.employee?.full_name || d.employee?.email}
                    </TableCell>
                  )}
                  <TableCell className="text-sm text-muted-foreground">{humanSize(d.file_size)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{fmtDate(d.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => download(d)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(d)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}