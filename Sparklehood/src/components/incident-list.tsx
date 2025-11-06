"use client";

import type { Incident, Severity, IncidentStatus, Comment, UserRole, User } from "@/types/incident";
import { useState, useMemo, useEffect } from "react";
import { mockIncidents, mockUsers } from "@/lib/mockData"; // Import mockUsers
import { IncidentItem } from "@/components/incident-item";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, Filter, Users, Calendar as CalendarIcon, Map as MapIcon } from "lucide-react"; // Added Users icon
import { ReportIncidentForm } from "@/components/report-incident-form"; // Keep this for now, might reintegrate later
import { EditIncidentDialog } from "@/components/edit-incident-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'; // Import Recharts components

type SortOrder = "newest" | "oldest" | "dueDate";
type VisualizationMode = "list" | "calendar" | "heatmap" | "timeline";

// Define props for IncidentList
interface IncidentListProps {
  searchQuery: string;
  filterSeverity: Severity | "All";
  onFilterSeverityChange: (value: Severity | "All") => void;
  filterStatus: IncidentStatus | "All";
  onFilterStatusChange: (value: IncidentStatus | "All") => void;
  filterAssignee: string; // Now a User['id'] or "All" or "unassigned"
  onFilterAssigneeChange: (value: string) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (value: SortOrder) => void;
  userRole: UserRole; // Add user role prop
  dateRange?: DateRange; // Add dateRange prop
}

export function IncidentList({
  searchQuery,
  filterSeverity,
  onFilterSeverityChange,
  filterStatus,
  onFilterStatusChange,
  filterAssignee,
  onFilterAssigneeChange,
  sortOrder,
  onSortOrderChange,
  userRole, // Use userRole prop
  dateRange, // Use dateRange prop
}: IncidentListProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast(); // Initialize toast
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>("list");
    const [calendarDate, setCalendarDate] = useState<Date>(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Simulate fetching users (in real app, this might come from context or API)
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setIncidents(mockIncidents);
    setUsers(mockUsers); // Load mock users
  }, []);

   // Find user name by ID
   const findUserNameById = (id: string | null | undefined): string => {
    if (!id) return "Unassigned";
    const user = users.find(u => u.id === id);
    return user ? user.name : "Unknown User";
  };

  const handleAddIncident = (newIncidentData: Omit<Incident, 'id' | 'reportedDate' | 'comments' | 'status'>) => {
    const incidentToAdd: Incident = {
        ...newIncidentData,
        id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        reportedDate: new Date(),
        status: "New", // Default status for new incidents
        comments: [],
        assigneeId: newIncidentData.assigneeId || null, // Ensure assigneeId is set
    };
    setIncidents(prevIncidents => [incidentToAdd, ...prevIncidents].sort((a,b) => b.reportedDate.getTime() - a.reportedDate.getTime())); // Keep sorted by newest
    toast({ // Add notification
      title: "Incident Reported",
      description: `New incident "${incidentToAdd.title}" has been added.`,
      variant: 'default',
    });
  };


  const handleEditClick = (incident: Incident) => {
    if (userRole === 'Viewer') {
        toast({ title: "Permission Denied", description: "Viewers cannot edit incidents.", variant: "destructive"});
        return;
    }
    setEditingIncident(incident);
    setIsEditDialogOpen(true);
  };

  const handleUpdateIncident = (updatedIncident: Incident) => {
     const originalIncident = incidents.find(inc => inc.id === updatedIncident.id);
     setIncidents(prevIncidents =>
        prevIncidents.map(inc =>
            inc.id === updatedIncident.id ? updatedIncident : inc
        )
     );
     setIsEditDialogOpen(false);
     setEditingIncident(null);

     // Check if status changed to 'Closed' or 'Mitigated' for notification
     if (originalIncident && (originalIncident.status !== 'Closed' && originalIncident.status !== 'Mitigated') && (updatedIncident.status === 'Closed' || updatedIncident.status === 'Mitigated')) {
         toast({
            title: "Incident Resolved",
            description: `Incident "${updatedIncident.title}" has been marked as ${updatedIncident.status}.`,
            variant: 'default' // Using default variant, could be success
         });
     } else if (originalIncident?.status !== updatedIncident.status) {
        // General status update notification
         toast({
            title: "Incident Status Updated",
            description: `Status for "${updatedIncident.title}" changed to ${updatedIncident.status}.`,
            variant: 'default'
         });
     } else {
          // General update notification
          toast({
            title: "Incident Updated",
            description: `Details for "${updatedIncident.title}" have been updated.`,
            variant: 'default'
         });
     }
  };

   const handleDialogClose = () => {
      setIsEditDialogOpen(false);
      setEditingIncident(null);
   };

   const handleAddComment = (incidentId: string, comment: Comment) => {
      setIncidents(prevIncidents =>
          prevIncidents.map(inc =>
              inc.id === incidentId
                  ? { ...inc, comments: [...(inc.comments || []), comment].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()) } // Sort comments newest first
                  : inc
          )
      );
       const incident = incidents.find(inc => inc.id === incidentId);
       toast({
           title: "Comment Added",
           description: `New comment by ${comment.author} on "${incident?.title}".`,
           variant: "default"
       });
   };

  // Filter and sort logic using props and internal incidents state
  const filteredAndSortedIncidents = useMemo(() => {
    return incidents; // Return all incidents without filtering
  }, [incidents]);

   const calendarIncidents = useMemo(() => {
        // Use filtered incidents already considering date range and other filters
        return filteredAndSortedIncidents.filter(incident => {
            const incidentDate = new Date(incident.reportedDate);
            return (
                incidentDate.getFullYear() === calendarDate.getFullYear() &&
                incidentDate.getMonth() === calendarDate.getMonth()
            );
        });
    }, [filteredAndSortedIncidents, calendarDate]);

  const toggleSortOrder = () => {
    const toggleSortOrder: () => void = () => {
      onSortOrderChange(
        sortOrder === "newest" ? "oldest" : sortOrder === "oldest" ? "dueDate" : "newest"
      );
    };
  };

  const getSortButtonText = () => {
      switch (sortOrder) {
          case "newest": return "Newest First";
          case "oldest": return "Oldest First";
          case "dueDate": return "Due Date";
          default: return "Sort";
      }
  }

  const changeVisualizationMode = (mode: VisualizationMode) => {
        setVisualizationMode(mode);
    };

  return (
    <div className="space-y-8">
        {/* Conditionally render Report Form based on role */}
        {userRole === 'Admin' && (
             <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>Report New Incident</CardTitle>
                </CardHeader>
                <CardContent>
                   {/* Pass users list to the form for assignee dropdown */}
                    <ReportIncidentForm onIncidentReported={handleAddIncident} users={users.filter(u => u.id !== 'unassigned')} />
                </CardContent>
             </Card>
        )}


       {/* Incident List and Filters Section */}
        <Card className="shadow-lg border-none">
            <CardHeader className="bg-muted/30 rounded-t-lg pt-4 pb-3 px-4 md:px-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
                       {/* Severity Filter */}
                       <div className="flex items-center gap-2 flex-1 min-w-[140px] sm:min-w-[160px]">
                           <label htmlFor="severity-filter" className="text-sm font-medium shrink-0 text-muted-foreground">Severity:</label>
                           <Select
                             value={filterSeverity}
                             onValueChange={onFilterSeverityChange}
                           >
                            <SelectTrigger id="severity-filter" className="bg-background flex-grow h-9 text-xs sm:text-sm">
                              <SelectValue placeholder="Severity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">All</SelectItem>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                          </Select>
                       </div>
                       {/* Status Filter */}
                       <div className="flex items-center gap-2 flex-1 min-w-[140px] sm:min-w-[180px]">
                           <label htmlFor="status-filter" className="text-sm font-medium shrink-0 text-muted-foreground">Status:</label>
                           <Select
                             value={filterStatus}
                             onValueChange={onFilterStatusChange}
                            >
                            <SelectTrigger id="status-filter" className="bg-background flex-grow h-9 text-xs sm:text-sm">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All</SelectItem>
                                <SelectItem value="New">New</SelectItem>
                                <SelectItem value="Investigating">Investigating</SelectItem>
                                <SelectItem value="Mitigated">Mitigated</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                            </SelectContent>
                           </Select>
                       </div>
                       {/* Assignee Filter */}
                        <div className="flex items-center gap-2 flex-1 min-w-[140px] sm:min-w-[180px]">
                           <label htmlFor="assignee-filter" className="text-sm font-medium shrink-0 text-muted-foreground">Assignee:</label>
                           <Select
                             value={filterAssignee}
                             onValueChange={onFilterAssigneeChange}
                            >
                            <SelectTrigger id="assignee-filter" className="bg-background flex-grow h-9 text-xs sm:text-sm">
                                <Users className="h-3 w-3 mr-1.5 text-muted-foreground"/>
                                <SelectValue placeholder="Assignee" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Assignees</SelectItem>
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                <Separator className="my-1"/>
                                {users.filter(u => u.id !== 'unassigned').map(user => (
                                    <SelectItem key={user.id} value={user.id}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                           </Select>
                       </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
                      {/* Visualization Mode Toggle */}
                      <div className="flex items-center gap-2">
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => changeVisualizationMode("list")}
                              className={cn("h-9 text-xs sm:text-sm", visualizationMode === "list" && "bg-accent text-accent-foreground")}
                          >
                              List
                          </Button>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => changeVisualizationMode("calendar")}
                              className={cn("h-9 text-xs sm:text-sm", visualizationMode === "calendar" && "bg-accent text-accent-foreground")}
                          >
                              <CalendarIcon className="h-4 w-4 mr-1.5" />
                              Calendar
                          </Button>
                        <Button
                              variant="outline"
                              size="sm"
                              onClick={() => changeVisualizationMode("heatmap")}
                              className={cn("h-9 text-xs sm:text-sm", visualizationMode === "heatmap" && "bg-accent text-accent-foreground")}
                               title="Heatmap (Not Implemented)" // Add tooltip for unimplemented feature
                               disabled // Disable button
                          >
                              <MapIcon className="h-4 w-4 mr-1.5" />
                              Heatmap
                          </Button>
                      </div>

                        {/* Sort Button */}
                        <Button
                            variant="outline"
                            onClick={toggleSortOrder}
                            aria-label={`Sort incidents by ${getSortButtonText()}`}
                            className="w-full sm:w-auto bg-background h-9 text-xs sm:text-sm"
                        >
                          <ArrowDownUp className="mr-1.5 h-4 w-4" />
                          {getSortButtonText()}
                        </Button>
                    </div>
                  </div>
            </CardHeader>
            <CardContent className="space-y-4 p-4 md:p-6">

                 {/* Incident List */}
                 {visualizationMode === "list" && (
                  <div className="transition-all duration-300 ease-in-out min-h-[300px]">
                    {filteredAndSortedIncidents.length > 0 ? (
                      filteredAndSortedIncidents.map((incident) => (
                         <IncidentItem
                            key={incident.id}
                            incident={incident}
                            assignee={users.find(u => u.id === incident.assigneeId) ?? null} // Pass assignee object
                            onEdit={handleEditClick}
                            onCommentAdded={handleAddComment}
                            userRole={userRole} // Pass role to item
                         />
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-10">
                        {searchQuery ? `No incidents found for "${searchQuery}".` : dateRange?.from ? 'No incidents match the current filters and date range.' : 'No incidents match the current filters.'}
                      </p>
                    )}
                  </div>
                 )}

                {/* Calendar View */}
                {visualizationMode === "calendar" && (
                  <div className="flex flex-col space-y-4">
                     <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">
                          Incidents in {format(calendarDate, "MMMM yyyy")} {/* Corrected format */}
                        </h3>
                       <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !calendarDate && "text-muted-foreground"
                              )}
                            >
                              {calendarDate ? (
                                format(calendarDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={calendarDate}
                              onSelect={(date) => {
                                  if (date) {
                                      setCalendarDate(date);
                                  }
                                  setIsCalendarOpen(false);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                       {/* Basic Calendar Day Representation */}
                       <div className="border rounded-md p-4">
                           <Calendar
                                mode="single" // Keep single selection for month change
                                selected={calendarDate} // Highlight the selected month's reference date
                                onSelect={(date) => { if (date) setCalendarDate(date); }} // Allow month change
                                month={calendarDate} // Control the displayed month
                                components={{
                                    Day: ({ date, displayMonth }) => {
                                        const dayIncidents = calendarIncidents.filter(inc =>
                                            startOfDay(inc.reportedDate).getTime() === startOfDay(date).getTime()
                                        );
                                        const isCurrentMonth = date.getMonth() === displayMonth.getMonth();
                                        return (
                                            <div className={cn(
                                                "relative flex items-center justify-center h-10 w-10 rounded-full transition-colors",
                                                isCurrentMonth ? "text-foreground" : "text-muted-foreground opacity-50",
                                                dayIncidents.length > 0 && "bg-primary/10",
                                                 format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && 'ring-2 ring-primary'
                                            )}>
                                                {format(date, 'd')}
                                                {dayIncidents.length > 0 && (
                                                    <span className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-primary" title={`${dayIncidents.length} incident(s) reported`}></span>
                                                )}
                                            </div>
                                        );
                                    },
                                }}
                           />
                       </div>
                       {/* List incidents for selected month */}
                        {calendarIncidents.length > 0 ? (
                           <div className="mt-4 space-y-2">
                               <h4 className="text-md font-semibold">Incidents Reported in {format(calendarDate, "MMMM yyyy")}</h4>
                                {calendarIncidents.map((incident) => (
                                    <IncidentItem
                                        key={incident.id}
                                        incident={incident}
                                        assignee={users.find(u => u.id === incident.assigneeId) ?? null}
                                        onEdit={handleEditClick}
                                        onCommentAdded={handleAddComment}
                                        userRole={userRole}
                                    />
                                ))}
                           </div>
                        ) : (
                            <p className="text-muted-foreground italic mt-4">
                                No incidents reported in {format(calendarDate, "MMMM yyyy")}.
                            </p>
                        )}
                  </div>
                )}

                {/* Heatmap View (Placeholder) */}
                {visualizationMode === "heatmap" && (
                  <div className="text-center py-10 min-h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground italic">
                      Heatmap visualization is not yet implemented.
                    </p>
                  </div>
                )}
            </CardContent>
        </Card>

        {/* Edit Incident Dialog */}
         {editingIncident && (
            <EditIncidentDialog
                incident={editingIncident}
                isOpen={isEditDialogOpen}
                onClose={handleDialogClose}
                onUpdate={handleUpdateIncident}
                users={users.filter(u => u.id !== 'unassigned')} // Pass users for assignee dropdown
             />
         )}
    </div>
  );
}
