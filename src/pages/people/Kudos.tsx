import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Award, Heart, Trophy, Zap, Coffee, Handshake, Send } from "lucide-react";
import { PageHeader } from "./PeopleLayout";
import { LoadingCards, EmptyState } from "./_ui";
import { fmtDate, initials } from "./_hooks";

interface Ctx { user: { id: string; email: string }; profile: any }

const BADGES = [
  { key: "thanks", label: "Thanks!", icon: Heart },
  { key: "team_player", label: "Team Player", icon: Handshake },
  { key: "above_beyond", label: "Above & Beyond", icon: Trophy },
  { key: "quick_help", label: "Quick Help", icon: Zap },
  { key: "great_energy", label: "Great Energy", icon: Coffee },
  { key: "excellence", label: "Excellence", icon: Award },
];

const BADGE_MAP = Object.fromEntries(BADGES.map((b) => [b.key, b]));

export default function Kudos() {
  const ctx = useOutletContext<Ctx>();
  const [feed, setFeed] = useState<any[] | null>(null);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [teammates, setTeammates] = useState<any[]>([]);
  const [toUser, setToUser] = useState("");
  const [badge, setBadge] = useState("thanks");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("kudos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(40);
    const rows = data ?? [];
    setFeed(rows);
    const ids = Array.from(new Set(rows.flatMap((k: any) => [k.from_user, k.to_user])));
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, email, designation")
        .in("id", ids);
      const map: Record<string, any> = {};
      (profs ?? []).forEach((p: any) => (map[p.id] = p));
      setProfiles(map);
    }
  };

  useEffect(() => {
    load();
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .neq("id", ctx.user.id)
      .order("full_name", { ascending: true })
      .limit(200)
      .then(({ data }) => setTeammates(data ?? []));
  }, [ctx.user.id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toUser || !message.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("kudos").insert({
      from_user: ctx.user.id,
      to_user: toUser,
      badge,
      message: message.trim(),
    });
    setSaving(false);
    if (error) {
      toast.error("Couldn't send kudos", { description: error.message });
      return;
    }
    toast.success("Kudos sent 🎉");
    setMessage("");
    setToUser("");
    setBadge("thanks");
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kudos"
        subtitle="Recognize your teammates for great work — publicly."
      />

      <div className="grid lg:grid-cols-[380px,1fr] gap-6">
        <Card className="p-5 h-fit">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label>Give kudos to</Label>
              <Select value={toUser} onValueChange={setToUser}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Pick a teammate" />
                </SelectTrigger>
                <SelectContent>
                  {teammates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.full_name || t.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Badge</Label>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {BADGES.map((b) => {
                  const Icon = b.icon;
                  const active = badge === b.key;
                  return (
                    <button
                      key={b.key}
                      type="button"
                      onClick={() => setBadge(b.key)}
                      className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-xs transition-colors ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-secondary"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-[11px] leading-tight text-center">{b.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label htmlFor="msg">Message</Label>
              <Textarea
                id="msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Say why they deserve it…"
                rows={4}
                maxLength={400}
                className="mt-1.5"
                required
              />
              <div className="text-[11px] text-muted-foreground mt-1 text-right">
                {message.length}/400
              </div>
            </div>
            <Button type="submit" disabled={saving || !toUser || !message.trim()} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {saving ? "Sending…" : "Send kudos"}
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold">
            Recent recognition
          </div>
          {feed === null ? (
            <LoadingCards count={3} />
          ) : feed.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No kudos yet"
              description="Be the first to recognize a teammate — a quick thank you goes a long way."
            />
          ) : (
            <div className="space-y-3">
              {feed.map((k) => {
                const from = profiles[k.from_user];
                const to = profiles[k.to_user];
                const b = BADGE_MAP[k.badge] ?? BADGE_MAP.thanks;
                const Icon = b.icon;
                return (
                  <Card key={k.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {initials(from?.full_name, from?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm">
                          <span className="font-medium">{from?.full_name || from?.email || "Someone"}</span>
                          <span className="text-muted-foreground"> gave kudos to </span>
                          <span className="font-medium">{to?.full_name || to?.email || "a teammate"}</span>
                        </div>
                        <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-accent/15 text-accent px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
                          <Icon className="h-3 w-3" />
                          {b.label}
                        </div>
                        <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{k.message}</p>
                        <div className="mt-2 text-[11px] text-muted-foreground">{fmtDate(k.created_at)}</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}