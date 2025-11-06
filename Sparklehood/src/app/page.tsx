
"use client"; // This page now manages state, so it needs to be a Client Component

import { useState, useEffect } from 'react';
import type { UserRole, Severity, IncidentStatus } from '@/types/incident';
import { Header } from "@/components/header"; // Import the new Header
import { IncidentList } from "@/components/incident-list";
import { Separator } from "@/components/ui/separator";
import { Button } from '@/components/ui/button';
import { UserCog, Eye } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<Severity | "All">("All");
  const [filterStatus, setFilterStatus] = useState<IncidentStatus | "All">("All");
  const [filterAssignee, setFilterAssignee] = useState<string>("All"); // Add assignee filter state
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "dueDate">("newest");
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("Admin"); // Add role state
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ // Add date range state
    from: addDays(new Date(), -30), // Default to last 30 days
    to: new Date(),
  });

  // Function to toggle user role
  const toggleUserRole = () => {
    setCurrentUserRole(prevRole => (prevRole === "Admin" ? "Viewer" : "Admin"));
  };

  // Function to generate dynamic title based on filters
  const getDynamicTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    // Add more specific titles based on combined filters if needed
    if (filterSeverity !== 'All') return `${filterSeverity} Severity Incidents`;
    if (filterStatus !== 'All') return `${filterStatus} Status Incidents`;
    if (filterAssignee !== 'All' && filterAssignee !== 'unassigned') {
        // We need mockUsers data here ideally, or pass the name
        return `Incidents Assigned to User`; // Placeholder, improve later
    }
    if (filterAssignee === 'unassigned') return 'Unassigned Incidents';
    if (sortOrder === 'dueDate') return 'Incidents by Due Date';
    if (sortOrder === 'oldest') return 'Incidents (Oldest First)';
    return 'All Incidents'; // Default title
  };

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dynamicTitle={getDynamicTitle()} // Pass the dynamic title
        dateRange={dateRange} // Pass date range state
        onDateRangeChange={setDateRange} // Pass date range handler
      />
      {/* Main content area with padding */}
      <main className="container mx-auto p-4 md:p-8 max-w-7xl space-y-8 flex-grow">
         {/* Role Switcher Button (for simulation) */}
         <div className="flex justify-end">
             <Button variant="outline" size="sm" onClick={toggleUserRole} title={`Switch to ${currentUserRole === 'Admin' ? 'Viewer' : 'Admin'} mode`}>
                 {currentUserRole === 'Admin' ? <UserCog className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                 Current Role: {currentUserRole}
             </Button>
         </div>

        {/* IncidentList now handles reporting, filtering, sorting, editing, and commenting based on props */}
        <IncidentList
          searchQuery={searchQuery}
          filterSeverity={filterSeverity}
          onFilterSeverityChange={setFilterSeverity}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          filterAssignee={filterAssignee} // Pass assignee filter
          onFilterAssigneeChange={setFilterAssignee} // Pass handler
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          userRole={currentUserRole} // Pass current user role
          dateRange={dateRange} // Pass date range state
        />

        {/* Footer or other sections could be added here */}
        <footer className="text-center text-sm text-muted-foreground pt-8">
          &copy; {new Date().getFullYear()} SafetyWatch Inc. All rights reserved.
        </footer>
      </main>
    </>
  );
}
