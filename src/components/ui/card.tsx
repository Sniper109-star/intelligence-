import { cn } from "@/lib/utils";
import { ScoreRing } from "@/components/wallet/score-ring";

export { ScoreRing };

interface CardProps {
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "stat" | "gradient";
}

export function Card({ className, children, variant = "default" }: CardProps) {
  const base = "rounded-lg border bg-surface";
  const variants = {
    default: "border-border",
    stat: "border-border bg-gradient-to-br from-surface to-surface/80",
    gradient: "border-border",
  };
  return <div className={cn(base, variants[variant], className)}>{children}</div>;
}

export function CardHeader({ title, description, className }: { title: string; description?: string; className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {description && <p className="text-xs text-foreground-muted">{description}</p>}
    </div>
  );
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
}: {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
}) {
  const changeColors = {
    positive: "text-success",
    negative: "text-danger",
    neutral: "text-foreground-muted",
  };
  return (
    <Card variant="stat" className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground-muted">{title}</p>
          <p className="text-xl lg:text-2xl font-bold text-foreground">{value}</p>
          {change && <p className={cn("text-xs font-medium", changeColors[changeType])}>{change}</p>}
        </div>
        {icon && <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>}
      </div>
    </Card>
  );
}
