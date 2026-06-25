import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "./PeopleLayout";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { fmtDate } from "./_hooks";

export default function Profile() {
  const { user, profile } = useOutletContext<{ user: any; profile: any }>();
  const [form, setForm] = useState<any>(null);
  const [pw, setPw] = useState("");

  useEffect(() => { setForm(profile); }, [profile]);

  if (!form) return null;

  const save = async () => {
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name, phone: form.phone, address: form.address, emergency_contact: form.emergency_contact,
    }).eq("id", user.id);
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
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="font-serif text-lg">Details</h2>
          <div><Label>Full name</Label><Input value={form.full_name ?? ""} onChange={(e)=>setForm({...form, full_name: e.target.value})}/></div>
          <div><Label>Email</Label><Input value={user.email} disabled/></div>
          <div><Label>Phone</Label><Input value={form.phone ?? ""} onChange={(e)=>setForm({...form, phone: e.target.value})}/></div>
          <div><Label>Address</Label><Textarea value={form.address ?? ""} onChange={(e)=>setForm({...form, address: e.target.value})}/></div>
          <div><Label>Emergency contact</Label><Input value={form.emergency_contact ?? ""} onChange={(e)=>setForm({...form, emergency_contact: e.target.value})}/></div>
          <Button onClick={save}>Save</Button>
        </Card>
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-serif text-lg mb-4">Employment</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-muted-foreground">Designation</div><div>{form.designation ?? "—"}</div></div>
              <div><div className="text-muted-foreground">Joined</div><div>{form.joining_date ? fmtDate(form.joining_date) : "—"}</div></div>
              <div><div className="text-muted-foreground">Status</div><div className="capitalize">{form.status}</div></div>
            </div>
          </Card>
          <Card className="p-6 space-y-4">
            <h2 className="font-serif text-lg">Change password</h2>
            <Input type="password" placeholder="New password" value={pw} onChange={(e)=>setPw(e.target.value)}/>
            <Button onClick={changePassword}>Update password</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}