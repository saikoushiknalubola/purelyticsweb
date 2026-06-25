import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import CheckInCard from "./CheckInCard";
import { PageHeader } from "./PeopleLayout";
import { durationHours, fmtHM, fmtDate } from "./_hooks";
import { Users, Clock, CalendarDays, Megaphone } from "lucide-react";

interface Ctx { user: { id: string; email: string }; profile: any; isAdmin: boolean; isManager: boolean; }

function Stat({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="font-serif text-2xl mt-1">{value}</div>
        </div>
        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </Card>
  );
}

export default function PeopleDashboard() {
  const ctx = useOutletContext<Ctx>();
  const [todayHours, setTodayHours] = useState(0);
  const [weekHours, setWeekHours] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [empCount, setEmpCount] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [onLeaveToday, setOnLeaveToday] = useState(0);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const run = async () => {
      const now = new Date();
      const startOfDay = new Date(now); startOfDay.setHours(0,0,0,0);
      const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0,0,0,0);

      // My today / week hours
      const { data: my } = await supabase
        .from("attendance_sessions")
        .select("check_in_at, check_out_at")
        .eq("user_id", ctx.user.id)
        .gte("check_in_at", startOfWeek.toISOString());

      let td = 0, wk = 0;
      (my ?? []).forEach((s: any) => {
        const h = durationHours(s.check_in_at, s.check_out_at);
        wk += h;
        if (new Date(s.check_in_at) >= startOfDay) td += h;
      });
      setTodayHours(td); setWeekHours(wk);

      // Pending leaves: mine pending if employee; all pending if manager/admin
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
          .from("profiles").select("id", { count: "exact", head: true }).eq("status","active");
        setEmpCount(ec ?? 0);

        const { data: todayAtt } = await supabase
          .from("attendance_sessions").select("user_id")
          .gte("check_in_at", startOfDay.toISOString());
        setPresentToday(new Set((todayAtt ?? []).map((x: any) => x.user_id)).size);

        const dateStr = startOfDay.toISOString().slice(0,10);
        const { count: ol } = await supabase
          .from("leave_requests").select("id", { count: "exact", head: true })
          .eq("status","approved").lte("from_date", dateStr).gte("to_date", dateStr);
        setOnLeaveToday(ol ?? 0);
      }

      const { data: anns } = await supabase
        .from("announcements").select("*")
        .order("created_at", { ascending: false }).limit(3);
      setAnnouncements(anns ?? []);
    };
    run();
  }, [ctx, reloadKey]);

  return (
    <div>
      <PageHeader
        title={`Welcome, ${ctx.profile?.full_name?.split(" ")[0] || "there"}`}
        subtitle={new Date().toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <CheckInCard userId={ctx.user.id} onChange={() => setReloadKey((k) => k + 1)} />
        </div>

        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
          <Stat label="Today" value={fmtHM(todayHours)} icon={Clock} />
          <Stat label="This week" value={fmtHM(weekHours)} icon={Clock} />
          <Stat label={ctx.isManager ? "Pending approvals" : "My pending leaves"} value={pendingLeaves} icon={CalendarDays} />
          {ctx.isAdmin ? (
            <Stat label="Active employees" value={empCount} icon={Users} />
          ) : (
            <Stat label="Status" value={ctx.profile?.status === "active" ? "Active" : "—"} icon={Users} />
          )}
        </div>
      </div>

      {ctx.isAdmin && (
        <div className="grid sm:grid-cols-3 gap-5 mt-5">
          <Stat label="Present today" value={presentToday} icon={Users} />
          <Stat label="On leave today" value={onLeaveToday} icon={CalendarDays} />
          <Stat label="Headcount" value={empCount} icon={Users} />
        </div>
      )}

      <div className="mt-8">
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