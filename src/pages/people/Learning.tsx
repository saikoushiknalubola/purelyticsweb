import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "./PeopleLayout";
import { LoadingCards, EmptyState } from "./_ui";
import { BookOpen, Search, Clock, GraduationCap } from "lucide-react";
import { toast } from "sonner";

type Ctx = { user: any; isAdmin: boolean };

export default function Learning() {
  const { user, isAdmin } = useOutletContext<Ctx>();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolls, setEnrolls] = useState<Record<string, any>>({});
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    const [{ data: cs }, { data: es }] = await Promise.all([
      supabase.from("courses").select("*").eq("is_published", true).order("created_at", { ascending: false }),
      supabase.from("course_enrollments").select("*").eq("user_id", user.id),
    ]);
    setCourses(cs ?? []);
    const map: Record<string, any> = {};
    (es ?? []).forEach((e: any) => (map[e.course_id] = e));
    setEnrolls(map);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const enroll = async (courseId: string) => {
    const { error } = await supabase.from("course_enrollments").insert({
      course_id: courseId, user_id: user.id, status: "in_progress",
    });
    if (error) return toast.error(error.message);
    toast.success("Enrolled");
    load();
  };

  const filtered = courses.filter((c) =>
    !q || c.title.toLowerCase().includes(q.toLowerCase()) || (c.category ?? "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning"
        subtitle="Grow your skills with courses curated by your team"
        actions={isAdmin ? <Button asChild><Link to="/people/learning/admin">Manage courses</Link></Button> : undefined}
      />
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search courses…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <LoadingCards key={i} count={1} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses yet"
          description="Ask an admin to publish courses to start learning." />
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const e = enrolls[c.id];
            return (
              <Card key={c.id} className="p-5 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-10 w-10 rounded-lg bg-accent/15 text-accent flex items-center justify-center">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  {c.category && <Badge variant="secondary">{c.category}</Badge>}
                </div>
                <div className="font-serif text-lg mt-2">{c.title}</div>
                <div className="text-sm text-muted-foreground line-clamp-3 mt-1 flex-1">{c.description}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                  <Clock className="h-3.5 w-3.5" /> {c.duration_minutes || 0} min
                </div>
                {e ? (
                  <div className="mt-3 space-y-2">
                    <Progress value={e.progress ?? 0} className="h-2" />
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/people/learning/${c.id}`}>
                        {e.status === "completed" ? "View certificate" : "Continue"}
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <Button className="mt-3 w-full" onClick={() => enroll(c.id)}>
                    <GraduationCap className="h-4 w-4 mr-2" /> Enroll
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}