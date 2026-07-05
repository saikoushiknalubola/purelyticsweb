import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "./PeopleLayout";
import { initials } from "./_hooks";
import { Search, Mail, Building2 } from "lucide-react";

export default function Directory() {
  const [rows, setRows] = useState<any[]>([]);
  const [depts, setDepts] = useState<Record<string, string>>({});
  const [q, setQ] = useState("");

  useEffect(() => {
    Promise.all([
      supabase
        .from("employee_directory")
        .select("id, full_name, email, avatar_url, department_id, designation, manager_id, joining_date, status, employee_id, location, work_mode, employment_type")
        .eq("status", "active")
        .order("full_name"),
      supabase.from("departments").select("id, name"),
    ]).then(([p, d]) => {
      setRows(p.data ?? []);
      const m: Record<string,string> = {};
      (d.data ?? []).forEach((x:any) => m[x.id] = x.name);
      setDepts(m);
    });
  }, []);

  const filtered = rows.filter((r) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (r.full_name ?? "").toLowerCase().includes(s)
      || (r.email ?? "").toLowerCase().includes(s)
      || (r.designation ?? "").toLowerCase().includes(s);
  });

  return (
    <div>
      <PageHeader title="Directory" subtitle="Find anyone on the team." />
      <div className="relative mb-5 max-w-md">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by name, email, or role" value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">{initials(p.full_name, p.email)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{p.full_name ?? "—"}</div>
                <div className="text-xs text-muted-foreground truncate">{p.designation ?? "Team member"}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2"><Mail className="h-3 w-3" />{p.email}</div>
                {p.department_id && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1"><Building2 className="h-3 w-3" />{depts[p.department_id]}</div>
                )}
              </div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="p-8 col-span-full text-center text-sm text-muted-foreground">No matches.</Card>
        )}
      </div>
    </div>
  );
}