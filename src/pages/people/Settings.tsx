import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "./PeopleLayout";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export default function PeopleSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [depts, setDepts] = useState<any[]>([]);
  const [newDept, setNewDept] = useState("");
  const [types, setTypes] = useState<any[]>([]);

  const load = async () => {
    const [s, d, t] = await Promise.all([
      supabase.from("org_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("departments").select("*").order("name"),
      supabase.from("leave_types").select("*").order("name"),
    ]);
    setSettings(s.data ?? null);
    setDepts(d.data ?? []);
    setTypes(t.data ?? []);
  };

  useEffect(() => { load(); }, []);

  const saveSettings = async () => {
    const { error } = await supabase.from("org_settings").update({
      working_hours: settings.working_hours,
      full_day_threshold_hours: settings.full_day_threshold_hours,
      half_day_threshold_hours: settings.half_day_threshold_hours,
      updated_at: new Date().toISOString(),
    }).eq("id", 1);
    if (error) return toast.error(error.message);
    toast.success("Saved");
  };

  const addDept = async () => {
    if (!newDept.trim()) return;
    const { error } = await supabase.from("departments").insert({ name: newDept.trim() });
    if (error) return toast.error(error.message);
    setNewDept(""); load();
  };

  const removeDept = async (id: string) => {
    const { error } = await supabase.from("departments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const saveType = async (t: any) => {
    const { error } = await supabase.from("leave_types").update({
      default_annual_quota: t.default_annual_quota,
    }).eq("id", t.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
  };

  if (!settings) return null;

  return (
    <div>
      <PageHeader title="Settings" subtitle="Organization-wide HR settings." />

      <Card className="p-6 mb-6">
        <h2 className="font-serif text-lg mb-4">Working hours</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div><Label>Standard hours / day</Label><Input type="number" step="0.5" value={settings.working_hours} onChange={(e)=>setSettings({...settings, working_hours: Number(e.target.value)})}/></div>
          <div><Label>Full-day threshold</Label><Input type="number" step="0.5" value={settings.full_day_threshold_hours} onChange={(e)=>setSettings({...settings, full_day_threshold_hours: Number(e.target.value)})}/></div>
          <div><Label>Half-day threshold</Label><Input type="number" step="0.5" value={settings.half_day_threshold_hours} onChange={(e)=>setSettings({...settings, half_day_threshold_hours: Number(e.target.value)})}/></div>
        </div>
        <Button className="mt-4" onClick={saveSettings}>Save</Button>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="font-serif text-lg mb-4">Departments</h2>
        <div className="flex gap-2 mb-4">
          <Input placeholder="New department name" value={newDept} onChange={(e)=>setNewDept(e.target.value)} />
          <Button onClick={addDept}><Plus className="h-4 w-4"/></Button>
        </div>
        <div className="space-y-2">
          {depts.map((d) => (
            <div key={d.id} className="flex justify-between items-center bg-secondary/50 px-3 py-2 rounded">
              <span>{d.name}</span>
              <Button variant="ghost" size="icon" onClick={()=>removeDept(d.id)}><Trash2 className="h-4 w-4"/></Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-serif text-lg mb-4">Leave types (default annual quota)</h2>
        <div className="space-y-3">
          {types.map((t, i) => (
            <div key={t.id} className="flex items-center gap-3">
              <div className="flex-1 font-medium">{t.name}</div>
              <Input type="number" step="0.5" className="w-32"
                value={t.default_annual_quota}
                onChange={(e)=>{ const next=[...types]; next[i] = { ...t, default_annual_quota: Number(e.target.value) }; setTypes(next); }}/>
              <Button size="sm" variant="outline" onClick={()=>saveType(types[i])}>Save</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}