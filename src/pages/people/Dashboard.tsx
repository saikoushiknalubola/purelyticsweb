import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import CheckInCard from "./CheckInCard";
import { PageHeader } from "./PeopleLayout";
import { durationHours, fmtHM, fmtDate } from "./_hooks";
import { Users, Clock, CalendarDays, Megaphone, TrendingUp, Calendar as CalIcon } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface Ctx { user: { id: string; email: string }; profile: any; isAdmin: boolean; isManager: boolean; }

function Stat({ label, value, icon: Icon, hint }: { label: string; value: string | number; icon: any; hint?: string }) {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="font-serif text-3xl mt-1.5 tabular-nums">{value}</div>
          {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </Card>
  );
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PeopleDashboard() {
  const ctx = useOutletContext<Ctx>();
  const [weekHours, setWeekHours] = useState(0);
  const [todayHours, setTodayHours] = useState(0);
  const [perDay, setPerDay] = useState<{ day: string; hours: number }[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [empCount, setEmpCount] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [onLeaveToday, setOnLeaveToday] = useState(0);
  const [balances, setBalances] = useState<{ name: string; total: number; used: number }[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const run = async () => {
      const now = new Date();
      const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
      const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0, 0, 0, 0);

      const { data: my } = await supabase
        .from("attendance_sessions")
        .select("check_in_at, check_out_at")
        .eq("user_id", ctx.user.id)
        .gte("check_in_at", startOfWeek.toISOString());

      const buckets = [0, 0, 0, 0, 0, 0, 0];
      let td = 0, wk = 0;
      (my ?? []).forEach((s: any) => {
        const h = durationHours(s.check_in_at, s.check_out_at);
        wk += h;
        const d = new Date(s.check_in_at).getDay();
        buckets[d] += h;
        if (new Date(s.check_in_at) >= startOfDay) td += h;
      });
      setTodayHours(td); setWeekHours(wk);
      setPerDay(dayLabels.map((day, i) => ({ day, hours: +buckets[i].toFixed(2) })));

      // Leave balances (current year)
      const year = new Date().getFullYear();
      const { data: bals } = await supabase
        .from("leave_balances")
        .select("total, used, leave_type_id, leave_types ( name )")
        .eq("user_id", ctx.user.id).eq("year", year);
      setBalances(((bals ?? []) as any[]).map((b) => ({
        name: b.leave_types?.name ?? "Leave", total: Number(b.total ?? 0), used: Number(b.used ?? 0),
      })));

      // Upcoming holidays
      const today = startOfDay.toISOString().slice(0, 10);
      const { data: hols } = await supabase
        .from("holidays").select("*").gte("holiday_date", today)
        .order("holiday_date").limit(4);
      setHolidays(hols ?? []);

      if (ctx.isManager) {
        const { count } = await supabase
          .from("leave_requests").select("id", { count: "exact", head: true })
          .eq("status", "pending");
        setPendingLeaves(count ?? 0);
      } else {
        const { count } = await supabase
          .from("leave_requests").select("id", { count: "exact", head: true })
          .eq("user_id", ctx.user.id).eq("status", "pending");
        setPendingLeaves(count ?? 0);
      }

      if (ctx.isAdmin) {
        const { count: ec } = await supabase
          .from("profiles").select("id", { count: "exact", head: true }).eq("status", "active");
        setEmpCount(ec ?? 0);

        const { data: todayAtt } = await supabase
          .from("attendance_sessions").select("user_id")
          .gte("check_in_at", startOfDay.toISOString());
        setPresentToday(new Set((todayAtt ?? []).map((x: any) => x.user_id)).size);

        const { count: ol } = await supabase
          .from("leave_requests").select("id", { count: "exact", head: true })
          .eq("status", "approved").lte("from_date", today).gte("to_date", today);
        setOnLeaveToday(ol ?? 0);
      }

      const { data: anns } = await supabase
        .from("announcements").select("*")
        .order("created_at", { ascending: false }).limit(3);
      setAnnouncements(anns ?? []);
    };
    run();
  }, [ctx, reloadKey]);

  const firstName = ctx.profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        subtitle={new Date().toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <CheckInCard userId={ctx.user.id} onChange={() => setReloadKey((k) => k + 1)} />
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="grid sm:grid-cols-3 gap-4">
            <Stat label="Today" value={fmtHM(todayHours)} icon={Clock} />
            <Stat label="This week" value={fmtHM(weekHours)} icon={TrendingUp} hint="Sun → today" />
            <Stat
              label={ctx.isManager ? "Pending approvals" : "Pending requests"}
              value={pendingLeaves}
              icon={CalendarDays}
            />
          </div>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-serif text-lg">Weekly hours</div>
                <div className="text-xs text-muted-foreground">Net working hours per day</div>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={perDay} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: any) => [`${v}h`, "Hours"]}
                  />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {ctx.isAdmin && (
        <div className="grid sm:grid-cols-3 gap-4">
          <Stat label="Headcount" value={empCount} icon={Users} hint="Active employees" />
          <Stat label="Present today" value={presentToday} icon={Clock} />
          <Stat label="On leave today" value={onLeaveToday} icon={CalendarDays} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-serif text-lg">Leave balances</div>
              <div className="text-xs text-muted-foreground">Year {new Date().getFullYear()}</div>
            </div>
          </div>
          <div className="space-y-4">
            {balances.length === 0 && (
              <div className="text-sm text-muted-foreground">No leave balances configured yet.</div>
            )}
            {balances.map((b) => {
              const remaining = Math.max(0, b.total - b.used);
              const pct = b.total > 0 ? (b.used / b.total) * 100 : 0;
              return (
                <div key={b.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{b.name}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {remaining} left <span className="opacity-60">/ {b.total}</span>
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="font-serif text-lg">Upcoming holidays</div>
            <CalIcon className="h-4 w-4 text-accent" />
          </div>
          <div className="space-y-3">
            {holidays.length === 0 && (
              <div className="text-sm text-muted-foreground">No holidays added yet.</div>
            )}
            {holidays.map((h) => (
              <div key={h.id} className="flex items-center gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase leading-none">
                    {new Date(h.holiday_date).toLocaleDateString([], { month: "short" })}
                  </span>
                  <span className="text-base font-serif leading-none mt-0.5">
                    {new Date(h.holiday_date).getDate()}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{h.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(h.holiday_date).toLocaleDateString([], { weekday: "long" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <h2 className="font-serif text-lg mb-3 flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-accent" /> Announcements
        </h2>
        {announcements.length === 0 ? (
          <Card className="p-5 text-sm text-muted-foreground">No announcements yet.</Card>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <Card key={a.id} className="p-5">
                <div className="flex justify-between items-start gap-3">
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{fmtDate(a.created_at)}</div>
                </div>
                <p className="text-sm text-foreground/80 mt-2 whitespace-pre-wrap">{a.body}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}