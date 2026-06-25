// Bootstraps the single root admin account (hello@purelytics.tech).
// Idempotent: creates the user only if missing, then ensures the admin role row exists.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ROOT_EMAIL = "hello@purelytics.tech";
const ROOT_PASSWORD = "Koushik@2330";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (email !== ROOT_EMAIL || password !== ROOT_PASSWORD) {
      return new Response(JSON.stringify({ ok: false, error: "Not authorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    // Try to find existing user by email via listUsers (paged)
    let existing: { id: string; email?: string } | null = null;
    for (let page = 1; page <= 5 && !existing; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;
      existing = data.users.find((u) => (u.email ?? "").toLowerCase() === ROOT_EMAIL) ?? null;
      if (data.users.length < 200) break;
    }

    let userId: string;
    if (!existing) {
      const { data, error } = await admin.auth.admin.createUser({
        email: ROOT_EMAIL,
        password: ROOT_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: "Root Admin" },
      });
      if (error) throw error;
      userId = data.user!.id;
    } else {
      userId = existing.id;
      // Ensure password matches the configured one
      await admin.auth.admin.updateUserById(userId, { password: ROOT_PASSWORD, email_confirm: true });
    }

    // Ensure profile + admin role
    await admin.from("profiles").upsert({
      id: userId,
      email: ROOT_EMAIL,
      full_name: "Root Admin",
      designation: "Founder",
      status: "active",
    }, { onConflict: "id" });

    await admin.from("user_roles").upsert({
      user_id: userId,
      role: "admin",
    }, { onConflict: "user_id,role" });

    return new Response(JSON.stringify({ ok: true, userId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String((e as Error).message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});