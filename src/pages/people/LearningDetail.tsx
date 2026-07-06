import { useEffect, useState } from "react";
import { useParams, useOutletContext, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "./PeopleLayout";
import { LoadingCards } from "./_ui";
import { ArrowLeft, Award, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type Ctx = { user: any };

export default function LearningDetail() {
  const { id } = useParams();
  const { user } = useOutletContext<Ctx>();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [enroll, setEnroll] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: c }, { data: m }, { data: e }] = await Promise.all([
      supabase.from("courses").select("*").eq("id", id!).maybeSingle(),
      supabase.from("course_modules").select("*").eq("course_id", id!).order("position"),
      supabase.from("course_enrollments").select("*").eq("course_id", id!).eq("user_id", user.id).maybeSingle(),
    ]);
    setCourse(c); setModules(m ?? []); setEnroll(e);
    setLoading(false);
  };
  useEffect(() => { load(); }, [id]);

  const toggleModule = async (moduleId: string) => {
    if (!enroll) return;
    const done: string[] = enroll.completed_modules ?? [];
    const next = done.includes(moduleId) ? done.filter((x) => x !== moduleId) : [...done, moduleId];
    const progress = modules.length ? Math.round((next.length / modules.length) * 100) : 0;
    const completed = progress >= 100;
    const patch: any = {
      completed_modules: next,
      progress,
      status: completed ? "completed" : "in_progress",
      completed_at: completed ? new Date().toISOString() : null,
      certificate_no: completed ? (enroll.certificate_no ?? `CERT-${Date.now().toString(36).toUpperCase()}`) : null,
    };
    const { error, data } = await supabase.from("course_enrollments").update(patch).eq("id", enroll.id).select().maybeSingle();
    if (error) return toast.error(error.message);
    setEnroll(data);
    if (completed) toast.success("Course complete — certificate issued");
  };

  if (loading) return <LoadingCards count={3} />;
  if (!course) return <div>Course not found.</div>;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="w-fit">
        <Link to="/people/learning"><ArrowLeft className="h-4 w-4 mr-2" /> Back to courses</Link>
      </Button>
      <PageHeader title={course.title} subtitle={course.description ?? undefined} />

      {enroll && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Your progress</div>
            <div className="text-sm tabular-nums">{enroll.progress ?? 0}%</div>
          </div>
          <Progress value={enroll.progress ?? 0} className="h-2" />
          {enroll.status === "completed" && enroll.certificate_no && (
            <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <Award className="h-5 w-5 text-emerald-600" />
              <div className="text-sm">
                <div className="font-medium">Certificate issued</div>
                <div className="text-muted-foreground">#{enroll.certificate_no}</div>
              </div>
            </div>
          )}
        </Card>
      )}

      <Card className="p-5">
        <div className="font-serif text-lg mb-4">Modules</div>
        {modules.length === 0 ? (
          <div className="text-sm text-muted-foreground">No modules yet.</div>
        ) : (
          <div className="space-y-2">
            {modules.map((m, i) => {
              const done = (enroll?.completed_modules ?? []).includes(m.id);
              return (
                <div key={m.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/40 transition-colors">
                  <Checkbox checked={done} disabled={!enroll} onCheckedChange={() => toggleModule(m.id)} className="mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{i + 1}. {m.title} {done && <CheckCircle2 className="h-4 w-4 inline text-emerald-600" />}</div>
                    {m.content && <div className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{m.content}</div>}
                    {m.video_url && (
                      <a href={m.video_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">
                        Watch video →
                      </a>
                    )}
                  </div>
                  {m.duration_minutes ? <div className="text-xs text-muted-foreground">{m.duration_minutes}m</div> : null}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}