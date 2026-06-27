import { ReactNode, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Clock, Users, CalendarDays, CheckSquare, Building2, Settings, UserCircle2,
  LogOut, Menu, X, Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { usePeopleAuth, initials } from "./_hooks";
import { Loader2 } from "lucide-react";

function NavItem({ to, icon: Icon, label, end }: { to: string; icon: any; label: string; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-foreground/70 hover:bg-secondary hover:text-foreground"
        }`
      }
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </NavLink>
  );
}

export default function PeopleLayout() {
  const { user, profile, isAdmin, isManager, loading } = usePeopleAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Not signed in → redirect to login
    if (location.pathname !== "/people/login") {
      navigate("/people/login", { replace: true });
    }
    return <Outlet />;
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/people/login", { replace: true });
  };

  const displayName = profile?.full_name || user.email;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 border-r border-border bg-card flex-col">
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Link to="/people" className="flex flex-col leading-none">
            <span className="font-display text-2xl text-primary tracking-tight">
              Purelytics<span className="text-accent">.</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">
              People · Workspace
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavItem to="/people" icon={LayoutDashboard} label="Dashboard" end />
          <NavItem to="/people/attendance" icon={Clock} label="My Attendance" />
          {isManager && <NavItem to="/people/attendance/all" icon={Users} label="Team Attendance" />}
          <NavItem to="/people/leaves" icon={CalendarDays} label="My Leaves" />
          {isManager && <NavItem to="/people/leaves/approvals" icon={CheckSquare} label="Approvals" />}
          <NavItem to="/people/directory" icon={Building2} label="Directory" />
          {isAdmin && <NavItem to="/people/employees" icon={Users} label="Employees" />}
          {isAdmin && <NavItem to="/people/announcements" icon={Megaphone} label="Announcements" />}
          {isAdmin && <NavItem to="/people/settings" icon={Settings} label="Settings" />}
          <div className="pt-4 mt-4 border-t border-border space-y-1">
            <NavItem to="/people/profile" icon={UserCircle2} label="My Profile" />
          </div>
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {initials(profile?.full_name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{displayName}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <header className="lg:hidden h-14 flex items-center justify-between px-4 border-b border-border bg-card sticky top-0 z-30">
        <Link to="/people" className="font-display text-xl text-primary tracking-tight">
          Purelytics<span className="text-accent">.</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground ml-2">People</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
          <aside className="absolute inset-y-0 left-0 w-72 bg-card p-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-xl text-primary">
                Purelytics<span className="text-accent">.</span>
              </span>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div onClick={() => setOpen(false)} className="space-y-1">
              <NavItem to="/people" icon={LayoutDashboard} label="Dashboard" end />
              <NavItem to="/people/attendance" icon={Clock} label="My Attendance" />
              {isManager && <NavItem to="/people/attendance/all" icon={Users} label="Team Attendance" />}
              <NavItem to="/people/leaves" icon={CalendarDays} label="My Leaves" />
              {isManager && <NavItem to="/people/leaves/approvals" icon={CheckSquare} label="Approvals" />}
              <NavItem to="/people/directory" icon={Building2} label="Directory" />
              {isAdmin && <NavItem to="/people/employees" icon={Users} label="Employees" />}
              {isAdmin && <NavItem to="/people/announcements" icon={Megaphone} label="Announcements" />}
              {isAdmin && <NavItem to="/people/settings" icon={Settings} label="Settings" />}
              <NavItem to="/people/profile" icon={UserCircle2} label="My Profile" />
            </div>
            <div className="mt-auto pt-4 border-t border-border">
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </Button>
            </div>
          </aside>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
          <Outlet context={{ user, profile, isAdmin, isManager }} />
        </div>
      </main>
    </div>
  );
}

// Section heading helper
export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <h1 className="font-serif text-2xl lg:text-3xl text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}