import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ROOT_EMAIL = "hello@purelytics.tech";

export default function PeopleLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/people", { replace: true });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const trimmed = email.trim().toLowerCase();

      // Try sign in first
      let { error } = await supabase.auth.signInWithPassword({ email: trimmed, password });

      // If root admin and not yet bootstrapped, call edge function then retry.
      if (error && trimmed === ROOT_EMAIL) {
        const { error: bootErr } = await supabase.functions.invoke("bootstrap-root-admin", {
          body: { email: trimmed, password },
        });
        if (!bootErr) {
          ({ error } = await supabase.auth.signInWithPassword({ email: trimmed, password }));
        }
      }

      if (error) {
        toast.error(error.message || "Invalid credentials");
        return;
      }
      toast.success("Signed in");
      navigate("/people", { replace: true });
    } catch (err: any) {
      toast.error(err.message ?? "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-primary">
            Purelytics <span className="text-accent">People</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to your company workspace
          </p>
        </div>
        <Card className="p-6 lg:p-8">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email" type="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@purelytics.tech"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password" type="password" autoComplete="current-password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
            </Button>
            <p className="text-xs text-muted-foreground text-center pt-2">
              Account access is provisioned by your admin.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}