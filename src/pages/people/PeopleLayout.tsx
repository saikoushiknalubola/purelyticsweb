import { ReactNode, useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Clock, Users, CalendarDays, CheckSquare, Building2, Settings, UserCircle2,
  LogOut, Menu, X, Megaphone, FileText, ListChecks, Briefcase, Timer, Target, Star, Wallet, Receipt,
  BookOpen, Laptop, LifeBuoy, Plane, Award,
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
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-foreground/70 hover:bg-secondary hover:text-foreground"
        }`
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

function NavGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="pt-3 first:pt-0">
      <div className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
        {label}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export default function PeopleLayout() {
  const { user, profile, isAdmin, isManager, loading } = usePeopleAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLElement | null>(null);
  const openBtnRef = useRef<HTMLButtonElement | null>(null);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Mobile drawer: focus trap, Escape, body scroll lock, restore focus
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    // Focus the first focusable element in the drawer
    const focusables = () =>
      Array.from(
        drawerRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => !el.hasAttribute("data-focus-skip"));
    const first = focusables()[0];
    first?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key === "Tab") {
        const list = focusables();
        if (list.length === 0) return;
        const firstEl = list[0];
        const lastEl = list[list.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [open]);

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

  const NavContents = (
    <>
      <NavGroup label="Overview">
        <NavItem to="/people" icon={LayoutDashboard} label="Dashboard" end />
      </NavGroup>

      <NavGroup label="Time & Leave">
        <NavItem to="/people/attendance" icon={Clock} label="My Attendance" end />
        {isManager && <NavItem to="/people/attendance/all" icon={Users} label="Team Attendance" />}
        <NavItem to="/people/leaves" icon={CalendarDays} label="My Leaves" end />
        {isManager && <NavItem to="/people/leaves/approvals" icon={CheckSquare} label="Leave Approvals" />}
        <NavItem to="/people/timesheets" icon={Timer} label="Timesheets" end />
        {isManager && <NavItem to="/people/timesheets/approvals" icon={CheckSquare} label="Timesheet Approvals" />}
      </NavGroup>

      <NavGroup label="Work">
        {isManager && <NavItem to="/people/projects" icon={Briefcase} label="Projects" />}
        <NavItem to="/people/goals" icon={Target} label="Goals & OKRs" />
        <NavItem to="/people/reviews" icon={Star} label="Reviews" />
        <NavItem to="/people/learning" icon={BookOpen} label="Learning" end />
        <NavItem to="/people/kudos" icon={Award} label="Kudos" />
      </NavGroup>

      <NavGroup label="Services">
        <NavItem to="/people/assets" icon={Laptop} label="Assets" end />
        <NavItem to="/people/helpdesk" icon={LifeBuoy} label="Helpdesk" end />
        <NavItem to="/people/expenses" icon={Wallet} label="Expenses" end />
        {isManager && <NavItem to="/people/expenses/approvals" icon={CheckSquare} label="Expense Approvals" />}
        <NavItem to="/people/travel" icon={Plane} label="Travel" end />
        {isManager && <NavItem to="/people/travel/approvals" icon={CheckSquare} label="Travel Approvals" />}
      </NavGroup>

      <NavGroup label="Company">
        <NavItem to="/people/payslips" icon={Receipt} label="My Payslips" />
        <NavItem to="/people/directory" icon={Building2} label="Directory" />
        <NavItem to="/people/documents" icon={FileText} label="Documents" />
        <NavItem to="/people/onboarding" icon={ListChecks} label="Onboarding" />
      </NavGroup>

      {isAdmin && (
        <NavGroup label="Admin">
          <NavItem to="/people/employees" icon={Users} label="Employees" />
          <NavItem to="/people/payroll" icon={Wallet} label="Payroll" />
          <NavItem to="/people/announcements" icon={Megaphone} label="Announcements" />
          <NavItem to="/people/settings" icon={Settings} label="Settings" />
        </NavGroup>
      )}

      <NavGroup label="Account">
        <NavItem to="/people/profile" icon={UserCircle2} label="My Profile" />
      </NavGroup>
    </>
  );

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
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">{NavContents}</nav>
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
      <header className="lg:hidden h-14 flex items-center justify-between px-4 border-b border-border bg-card/95 backdrop-blur sticky top-0 z-30">
        <Link to="/people" className="flex items-baseline gap-2 font-display text-xl text-primary tracking-tight">
          Purelytics<span className="text-accent">.</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">People</span>
        </Link>
        <div className="flex items-center gap-1">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {initials(profile?.full_name, user.email)}
            </AvatarFallback>
          </Avatar>
          <Button
            ref={openBtnRef}
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="people-mobile-drawer"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          <aside
            ref={drawerRef as any}
            id="people-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="People navigation"
            className="absolute inset-y-0 left-0 w-[86%] max-w-[320px] bg-card flex flex-col shadow-2xl animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
              <Link to="/people" onClick={() => setOpen(false)} className="flex flex-col leading-none">
                <span className="font-display text-xl text-primary">
                  Purelytics<span className="text-accent">.</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">People</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {initials(profile?.full_name, user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{displayName}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
            </div>
            <nav
              className="flex-1 overflow-y-auto p-3 space-y-1"
              onClick={(e) => {
                const t = e.target as HTMLElement;
                if (t.closest("a")) setOpen(false);
              }}
            >
              {NavContents}
            </nav>
            <div className="p-3 border-t border-border">
              <Button variant="outline" size="sm" className="w-full justify-start" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </Button>
            </div>
          </aside>
        </div>
      )}

      <main className="lg:pl-64 min-h-screen">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
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