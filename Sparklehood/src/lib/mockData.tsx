import type { Incident, Comment, User, Notification } from "@/types/incident";

// Mock Users
export const mockUsers: User[] = [
    { id: "user-1", name: "Alice Johnson", avatarUrl: "https://i.pravatar.cc/40?u=user-1" },
    { id: "user-2", name: "Bob Williams", avatarUrl: "https://i.pravatar.cc/40?u=user-2" },
    { id: "user-3", name: "Charlie Brown", avatarUrl: "https://i.pravatar.cc/40?u=user-3" },
    { id: "user-4", name: "Diana Davis", avatarUrl: "https://i.pravatar.cc/40?u=user-4" },
    { id: "unassigned", name: "Unassigned" } // For filtering purposes
];

const generateComments = (count: number): Comment[] => {
  const comments: Comment[] = [];
  // Use mockUsers for author names for better consistency
  const authors = mockUsers.filter(u => u.id !== 'unassigned').map(u => u.name);
  for (let i = 0; i < count; i++) {
    comments.push({
      id: `cmt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${i}`,
      author: authors[Math.floor(Math.random() * authors.length)],
      text: `This is comment number ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 5), // Random time in last 5 days
    });
  }
  return comments.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};


export const mockIncidents: Incident[] = [
  {
    id: "inc-001",
    title: "Minor UI Glitch in Reporting Module",
    description: "Users reported a minor visual misalignment in the reporting module when viewed on older browsers. Does not affect functionality.",
    severity: "Low",
    status: "Closed",
    reportedDate: new Date(), // Set to current date
    dueDate: null, // Remove predefined due date
    tags: ["ui", "bug", "frontend"],
    comments: generateComments(1),
    assigneeId: "user-1", // Alice assigned
  },
  {
    id: "inc-002",
    title: "Incorrect Data Aggregation in Summary",
    description: "The summary dashboard occasionally shows incorrect counts for medium severity incidents. Requires investigation into the aggregation logic.",
    severity: "Medium",
    status: "Investigating",
    reportedDate: new Date(), // Set to current date
    dueDate: null, // Remove predefined due date
    tags: ["data", "backend", "bug", "dashboard"],
    comments: generateComments(3),
    assigneeId: "user-2", // Bob assigned
  },
  {
    id: "inc-003",
    title: "Critical Authentication Bypass Vulnerability",
    description: "A severe vulnerability allows unauthorized access under specific conditions. Immediate patching required.",
    severity: "High",
    status: "Mitigated",
    reportedDate: new Date(), // Set to current date
    dueDate: null, // Remove predefined due date
    tags: ["security", "auth", "critical", "backend"],
    comments: generateComments(5),
    assigneeId: "user-3", // Charlie assigned
  },
  {
    id: "inc-004",
    title: "Slow API Response Time",
    description: "The main data retrieval API is experiencing intermittent slowdowns during peak hours, affecting user experience.",
    severity: "Medium",
    status: "Investigating",
    reportedDate: new Date(), // Set to current date
    dueDate: null, // Remove predefined due date
    tags: ["performance", "api", "backend"],
    comments: generateComments(2),
    assigneeId: "user-2", // Bob assigned
  },
  {
    id: "inc-005",
    title: "Inconsistent Severity Tagging",
    description: "Some automatically tagged incidents have inconsistent severity levels compared to manual assessments. Review tagging rules.",
    severity: "Low",
    status: "New",
    reportedDate: new Date(), // Set to current date
    dueDate: null, // Remove predefined due date
    tags: ["ai", "tagging", "data-quality"],
    comments: [], // No comments yet
    assigneeId: null, // Unassigned
  },
];


// Mock Notifications
export const mockNotifications: Notification[] = [
    {
        id: "notif-1",
        message: "Incident 'inc-003' status changed to Mitigated.",
        timestamp: new Date(2024, 5, 22, 10, 0, 0),
        read: true,
        incidentId: "inc-003",
    },
    {
        id: "notif-2",
        message: "New comment added to incident 'inc-002'.",
        timestamp: new Date(2024, 5, 21, 17, 30, 0),
        read: true,
        incidentId: "inc-002",
    },
    {
        id: "notif-3",
        message: "New incident 'inc-005' reported.",
        timestamp: new Date(2024, 5, 21, 16, 45, 0),
        read: false, // Unread
        incidentId: "inc-005",
    },
     {
        id: "notif-4",
        message: "Incident 'inc-001' assigned to Alice Johnson.",
        timestamp: new Date(2024, 5, 16, 11, 0, 0),
        read: true,
        incidentId: "inc-001",
    },
     {
        id: "notif-5",
        message: "Due date approaching for incident 'inc-002'.",
        timestamp: new Date(2024, 6, 3, 9, 0, 0),
        read: false, // Unread
        incidentId: "inc-002",
    },
];
