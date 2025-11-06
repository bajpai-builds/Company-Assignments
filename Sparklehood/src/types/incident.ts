
export type Severity = "Low" | "Medium" | "High";
export type IncidentStatus = "New" | "Investigating" | "Mitigated" | "Closed";

export interface User {
    id: string;
    name: string;
    avatarUrl?: string; // Optional avatar URL
}

export interface Comment {
  id: string;
  author: string; // For simplicity, keep as string, could be User['id']
  text: string;
  timestamp: Date;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: IncidentStatus;
  reportedDate: Date;
  dueDate?: Date | null;
  tags?: string[];
  regions?: string[];
  comments?: Comment[];
  assigneeId?: User['id'] | null; // Link to User ID
}

// Define user roles
export type UserRole = "Admin" | "Viewer";

// Define notification type
export interface Notification {
    id: string;
    message: string;
    timestamp: Date;
    read: boolean;
    incidentId?: string; // Optional link to related incident
}
