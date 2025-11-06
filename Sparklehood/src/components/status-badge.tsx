
"use client";

import type { IncidentStatus } from "@/types/incident";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Circle, CheckCircle, AlertCircle, XCircle, ShieldQuestion } from "lucide-react"; // Added ShieldQuestion

interface StatusBadgeProps {
  status: IncidentStatus;
  className?: string;
}

// Define icons and CSS classes for each status using classes from globals.css
const statusConfig: Record<IncidentStatus, { cssClass: string; icon: React.ElementType; animation?: string }> = {
  New: {
    cssClass: "badge-status-new",
    icon: Circle,
  },
  Investigating: {
    cssClass: "badge-status-investigating badge-info", // Includes base and info style
    icon: ShieldQuestion, // More indicative icon
    animation: "animate-scale-badge" // Add animation for changes
  },
  Mitigated: {
    cssClass: "badge-status-mitigated badge-success", // Includes base and success style
    icon: CheckCircle,
    animation: "animate-scale-badge" // Add animation for changes
  },
  Closed: {
    cssClass: "badge-status-closed",
    icon: XCircle, // Indicating closed/resolved
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline" // Use outline as base, styles overridden by cssClass
      className={cn(
        "font-normal px-2 py-0.5 text-xs rounded-full border flex items-center gap-1 capitalize", // Base styles
        config.cssClass, // Apply status-specific class
        config.animation, // Apply animation if defined
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{status}</span>
    </Badge>
  );
}
