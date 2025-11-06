
import type { Severity } from "@/types/incident";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

// Map severity levels to the CSS classes defined in globals.css
const severityClasses: Record<Severity, string> = {
  Low: "badge-severity-low",
  Medium: "badge-severity-medium",
  High: "badge-severity-high",
};

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <Badge
      variant="outline" // Keep outline for structure
      className={cn(
        "font-medium px-2.5 py-0.5 text-xs rounded-full border", // Base styles
        severityClasses[severity], // Apply severity-specific class
        className
      )}
    >
      {severity}
    </Badge>
  );
}
