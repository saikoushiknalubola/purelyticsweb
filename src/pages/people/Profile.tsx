import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "./PeopleLayout";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { fmtDate } from "./_hooks";

export default function Profile() {
  const { user, profile } = useOutletContext<{ user: any; profile: any }>();
  const [form, setForm] = useState<any>(null);
  const [pw, setPw] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
    else {
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
        .then(({ data }) => setForm(data ?? {}));
    }
  }, [profile, user.id]);

  if (!form) return null;

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name,
      phone: form.phone,
      address: form.address,
      date_of_birth: form.date_of_birth || null,
      gender: form.gender || null,
      blood_group: form.blood_group || null,
      location: form.location || null,
      emergency_contact_name: form.emergency_contact_name,
      emergency_contact_phone: form.emergency_contact_phone,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
  };

  const changePassword = async () => {
    if (pw.length < 8) return toast.error("At least 8 characters");
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return toast.error(error.message);
    toast.success("Password updated"); setPw("");
  };

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Keep your details up to date." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6 space-y-4 xl:col-span-2">
          <h2 className="font-serif text-lg">Personal details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Full name</Label><Input value={form.full_name ?? ""} onChange={(e)=>setForm({...form, full_name: e.target.value})}/></div>
            <div><Label>Email</Label><Input value={user.email} disabled/></div>
            <div><Label>Phone</Label><Input value={form.phone ?? ""} onChange={(e)=>setForm({...form, phone: e.target.value})}/></div>
            <div><Label>Date of birth</Label><Input type="date" value={form.date_of_birth ?? ""} onChange={(e)=>setForm({...form, date_of_birth: e.target.value})}/></div>
            <div>
              <Label>Gender</Label>
              <Select value={form.gender ?? ""} onValueChange={(v)=>setForm({...form, gender: v})}>
                <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="non_binary">Non-binary</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Blood group</Label>
              <Select value={form.blood_group ?? ""} onValueChange={(v)=>setForm({...form, blood_group: v})}>
                <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                <SelectContent>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b)=>(
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Location</Label><Input value={form.location ?? ""} onChange={(e)=>setForm({...form, location: e.target.value})}/></div>
          </div>
          <div><Label>Address</Label><Textarea rows={2} value={form.address ?? ""} onChange={(e)=>setForm({...form, address: e.target.value})}/></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Emergency contact name</Label><Input value={form.emergency_contact_name ?? ""} onChange={(e)=>setForm({...form, emergency_contact_name: e.target.value})}/></div>
            <div><Label>Emergency contact phone</Label><Input value={form.emergency_contact_phone ?? ""} onChange={(e)=>setForm({...form, emergency_contact_phone: e.target.value})}/></div>
          </div>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-serif text-lg mb-4">Employment</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-muted-foreground">Employee ID</div><div>{form.employee_id ?? "—"}</div></div>
              <div><div className="text-muted-foreground">Designation</div><div>{form.designation ?? "—"}</div></div>
              <div><div className="text-muted-foreground">Joined</div><div>{form.joining_date ? fmtDate(form.joining_date) : "—"}</div></div>
              <div><div className="text-muted-foreground">Status</div><div className="capitalize">{form.status ?? "—"}</div></div>
              <div><div className="text-muted-foreground">Type</div><div className="capitalize">{(form.employment_type ?? "—").replace("_"," ")}</div></div>
              <div><div className="text-muted-foreground">Work mode</div><div className="capitalize">{form.work_mode ?? "—"}</div></div>
            </div>
          </Card>
          <Card className="p-6 space-y-4">
            <h2 className="font-serif text-lg">Change password</h2>
            <Input type="password" placeholder="New password (min 8 chars)" value={pw} onChange={(e)=>setPw(e.target.value)}/>
            <Button onClick={changePassword}>Update password</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}