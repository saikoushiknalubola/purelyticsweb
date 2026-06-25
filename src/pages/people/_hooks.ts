import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type AppRole = "admin" | "manager" | "employee";

export interface PeopleProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  designation: string | null;
  department_id: string | null;
  manager_id: string | null;
  avatar_url: string | null;
  joining_date: string | null;
  status: string;
  phone: string | null;
  address: string | null;
  emergency_contact: string | null;
}

export function usePeopleAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [profile, setProfile] = useState<PeopleProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (u: User | null) => {
    if (!u) {
      setRoles([]);
      setProfile(null);
      return;
    }
    const [{ data: roleRows }, { data: prof }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", u.id),
      supabase.from("profiles").select("*").eq("id", u.id).maybeSingle(),
    ]);
    setRoles((roleRows ?? []).map((r: any) => r.role as AppRole));
    setProfile((prof as any) ?? null);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // defer to avoid recursive lock
      setTimeout(() => refresh(session?.user ?? null), 0);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      refresh(data.session?.user ?? null).finally(() => setLoading(false));
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  const isAdmin = roles.includes("admin");
  const isManager = roles.includes("manager") || isAdmin;
  const reload = () => refresh(user);

  return { user, roles, profile, loading, isAdmin, isManager, reload };
}

export function initials(name?: string | null, email?: string | null) {
  const src = (name || email || "?").trim();
  const parts = src.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return src.slice(0, 2).toUpperCase();
}

export function fmtTime(d: Date | string | null | undefined) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function fmtDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });
}

export function durationHours(fromIso: string, toIso?: string | null) {
  const a = new Date(fromIso).getTime();
  const b = toIso ? new Date(toIso).getTime() : Date.now();
  return Math.max(0, (b - a) / 3_600_000);
}

export function fmtHM(hours: number) {
  const total = Math.max(0, Math.round(hours * 60));
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}