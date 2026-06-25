// Admin-only: creates a new auth user with a temporary password, seeds profile + role + leave balances.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function tempPassword() {
  const a = "ABCDEFGHJKMNPQRSTUVWXYZ";
  const b = "abcdefghjkmnpqrstuvwxyz";
  const c = "23456789";
  const s = "!@#$%";
  const pick = (pool: string, n: number) =>
    Array.from({ length: n }, () => pool[Math.floor(Math.random() * pool.length)]).join("");
  return pick(a, 2) + pick(b, 4) + pick(c, 3) + pick(s, 1);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.slice(7);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const callerId = userData.user.id;
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: callerId, _role: "admin" });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden — admin only" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const full_name = String(body.full_name ?? "").trim();
    const designation = body.designation ? String(body.designation) : null;
    const department_id = body.department_id ? String(body.department_id) : null;
    const manager_id = body.manager_id ? String(body.manager_id) : null;
    const joining_date = body.joining_date ? String(body.joining_date) : null;
    const role = (["admin", "manager", "employee"].includes(body.role) ? body.role : "employee") as
      "admin" | "manager" | "employee";

    if (!email || !full_name) {
      return new Response(JSON.stringify({ error: "email and full_name required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const password = tempPassword();
    const { data: created, error: cErr } = await admin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { full_name },
    });
    if (cErr) {
      return new Response(JSON.stringify({ error: cErr.message }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const newId = created.user!.id;

    await admin.from("profiles").upsert({
      id: newId, email, full_name, designation, department_id, manager_id, joining_date,
      status: "active",
    }, { onConflict: "id" });

    await admin.from("user_roles").upsert({ user_id: newId, role }, { onConflict: "user_id,role" });

    // Seed leave balances for current year using default_annual_quota
    const { data: types } = await admin.from("leave_types").select("id, default_annual_quota");
    const year = new Date().getFullYear();
    if (types?.length) {
      const rows = types.map((t) => ({
        user_id: newId, leave_type_id: t.id, year, total: t.default_annual_quota, used: 0,
      }));
      await admin.from("leave_balances").upsert(rows, { onConflict: "user_id,leave_type_id,year" });
    }

    return new Response(JSON.stringify({ ok: true, userId: newId, tempPassword: password }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});