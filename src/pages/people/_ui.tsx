import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

export function LoadingCards({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-5">
          <Skeleton className="h-4 w-1/3 mb-3" />
          <Skeleton className="h-3 w-2/3 mb-2" />
          <Skeleton className="h-3 w-1/2" />
        </Card>
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: any;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="p-10 flex flex-col items-center text-center">
      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="font-serif text-lg mb-1">{title}</div>
      {description && (
        <div className="text-sm text-muted-foreground max-w-md">{description}</div>
      )}
      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}

const STATUS_TONE: Record<string, string> = {
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  resolved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  available: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  submitted: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  in_progress: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  open: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  assigned: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  draft: "bg-muted text-muted-foreground border-border",
  not_started: "bg-muted text-muted-foreground border-border",
  rejected: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
  closed: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  const key = (status || "").toLowerCase().replace(/\s+/g, "_");
  const cls = STATUS_TONE[key] ?? "bg-muted text-muted-foreground border-border";
  return (
    <Badge variant="outline" className={cls + " capitalize font-medium"}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function SectionShell({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}