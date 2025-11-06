
"use client";

import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Bell, Search, Settings, User, LogOut, Globe, Sun, Moon, LayoutGrid, PlusCircle, Filter, CalendarDays, Check } from "lucide-react"; // Added Check
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import { mockNotifications } from '@/lib/mockData'; // Import mock notifications
import type { Notification } from '@/types/incident'; // Import Notification type
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import { Badge } from "@/components/ui/badge"; // Import Badge
import { cn } from "@/lib/utils"; // Import cn utility
import { DateRangePicker } from "@/components/date-range-picker"; // Corrected import path
import type { DateRange } from "react-day-picker";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dynamicTitle: string;
  dateRange: DateRange | undefined; // Add dateRange prop
  onDateRangeChange: (range: DateRange | undefined) => void; // Add handler prop
}

// Mock function to simulate reporting an incident
const reportIncident = (toast: Function) => {
    toast({
        title: "Report Incident Clicked",
        description: "This should open the report incident form/dialog.", // More specific message
    });
    // In a real app, trigger a state change or context update to show the form/dialog
};

// Mock function for theme toggle
const toggleTheme = (toast: Function) => {
    // Basic implementation idea:
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light'); // Persist theme
    toast({
        title: `Theme Changed`,
        description: `Switched to ${isDark ? 'Dark' : 'Light'} mode.`,
    });
};

// Mock function for language change
const changeLanguage = (language: string, toast: Function) => {
    toast({
        title: "Language Changed",
        description: `Language switched to ${language}. (UI text update not implemented)`,
    });
     // Add actual i18n library integration here
};


// --- Notifications State & Logic ---
const MAX_NOTIFICATIONS_DISPLAYED = 5;

export function Header({ searchQuery, onSearchChange, dynamicTitle, dateRange, onDateRangeChange }: HeaderProps) {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  // Initialize theme on load - Moved inside component to avoid SSR issues
  useEffect(() => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
  }, []);


  useEffect(() => {
    // Simulate fetching notifications
    const sortedNotifications = [...mockNotifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setNotifications(sortedNotifications);
    setUnreadCount(sortedNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1)); // Ensure count doesn't go below 0
  };

   const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
     toast({ title: "Notifications Cleared", description: "All notifications marked as read." });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">

        {/* Left Section: Logo, Title, Breadcrumbs */}
        <div className="flex items-center space-x-4">
           {/* Placeholder Logo */}
           <div className="flex items-center space-x-2 text-primary cursor-pointer" onClick={() => window.location.reload()}>
                <LayoutGrid className="h-6 w-6" />
                <span className="font-bold text-lg hidden sm:inline">SafetyWatch</span>
            </div>

          <Separator orientation="vertical" className="h-6 hidden md:block" />

          {/* Dynamic Title & Breadcrumbs Area */}
          <div className="hidden md:flex flex-col justify-center items-start">
             {/* Apply headline-gradient in dark mode */}
            <h1
                className={cn(
                  "text-lg font-semibold text-foreground truncate max-w-xs",
                  "dark:headline-gradient" // Ensure this class is defined and applies the gradient
                )}
                title={dynamicTitle}>
              {dynamicTitle}
            </h1>
            <div className="text-xs text-muted-foreground mt-0.5 flex items-center space-x-1">
                {/* Example Breadcrumbs - make dynamic later */}
                <span>Dashboard</span>
                <span>/</span>
                <span className="font-medium text-foreground">{dynamicTitle}</span>
            </div>
          </div>
        </div>

        {/* Center Section: Global Controls */}
        <div className="flex-1 flex justify-center px-4 lg:px-8">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search incidents, tags, users..." // Updated placeholder
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full rounded-md border bg-muted/50 pl-10 pr-4 h-9 focus:border-primary focus:bg-background" // Standard border-radius
                    aria-label="Search incidents"
                />
                 {/* Add Search Scope Toggle later */}
            </div>
             {/* Date Range Picker Button */}
             <DateRangePicker date={dateRange} onDateChange={onDateRangeChange} />
        </div>

        {/* Right Section: Utilities & User */}
        <div className="flex items-center space-x-2 md:space-x-3">

           {/* Notification Bell Dropdown */}
            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-md relative h-9 w-9" aria-label="View notifications">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                             <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-4 w-4 min-w-4 justify-center p-0.5 text-[10px] rounded-full"
                             >
                                {unreadCount > 9 ? '9+' : unreadCount}
                             </Badge>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                 <DropdownMenuContent className="w-80 mt-2 mr-2" align="end">
                    <DropdownMenuLabel className="flex justify-between items-center">
                        <span>Notifications</span>
                         {notifications.length > 0 && (
                             <Button variant="ghost" size="sm" className="text-xs h-auto py-0.5 px-1.5" onClick={markAllAsRead} disabled={unreadCount === 0}>
                                Mark all read
                             </Button>
                         )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <ScrollArea className="h-[300px]"> {/* Add ScrollArea */}
                         {notifications.length === 0 ? (
                           <DropdownMenuItem disabled className="text-center text-muted-foreground py-4">No new notifications</DropdownMenuItem>
                         ) : (
                            notifications.slice(0, MAX_NOTIFICATIONS_DISPLAYED * 2).map((notification) => ( // Show more initially for scroll
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={cn("flex items-start gap-2 text-xs h-auto py-2 cursor-pointer data-[highlighted]:bg-accent/50", !notification.read && "bg-accent/20 font-medium")}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                     <div className={cn("mt-1 h-2 w-2 rounded-full shrink-0", notification.read ? "bg-transparent" : "bg-primary")} />
                                     <div className="flex-1 flex flex-col">
                                        <span className="whitespace-normal leading-snug">{notification.message}</span>
                                        <span className="text-muted-foreground mt-1">{formatDistanceToNow(notification.timestamp, { addSuffix: true })}</span>
                                     </div>
                                </DropdownMenuItem>
                            ))
                         )}
                     </ScrollArea>
                     {notifications.length > MAX_NOTIFICATIONS_DISPLAYED && (
                         <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-center text-xs text-primary py-2 cursor-pointer">View All Notifications</DropdownMenuItem>
                         </>
                     )}
                 </DropdownMenuContent>
            </DropdownMenu>


          {/* Theme Toggle */}
           <Button variant="ghost" size="icon" className="rounded-md h-9 w-9" onClick={() => toggleTheme(toast)} aria-label="Toggle theme">
             <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
             <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
             <span className="sr-only">Toggle theme</span>
          </Button>

           {/* Language Selector Dropdown */}
           <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-md h-9 w-9" aria-label="Change language">
                        <Globe className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-2">
                    <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Add Check mark for current language later */}
                    <DropdownMenuItem onClick={() => changeLanguage('English', toast)}>English</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLanguage('Español', toast)}>Español</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => changeLanguage('Français', toast)}>Français</DropdownMenuItem>
                     {/* Add more languages as needed */}
                </DropdownMenuContent>
            </DropdownMenu>


          {/* User Avatar Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-8 w-8">
                  {/* Use a consistent mock avatar */}
                  <AvatarImage src="https://i.pravatar.cc/40?u=admin-user" alt="User Avatar" data-ai-hint="user avatar profile" />
                  <AvatarFallback>DU</AvatarFallback> {/* Demo User */}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Demo User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    user@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast({ title: "My Incidents Clicked", description: "Filtering by 'Demo User' assigned incidents."})}>
                <User className="mr-2 h-4 w-4" />
                <span>My Incidents</span>
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => toast({ title: "Saved Views Clicked", description: "Saved views/filters functionality to be added."})}>
                <Filter className="mr-2 h-4 w-4" />
                <span>Saved Views</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Settings Clicked", description: "Navigate to user settings page."})}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast({ title: "Logout Clicked", description: "Logging out..."})}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

           {/* Quick Report FAB - Visible on small screens, static button on larger */}
            <Button
                variant="default"
                size="icon"
                className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50 flex items-center justify-center md:hidden animate-pulse" // Only visible on mobile, added flex utils
                onClick={() => reportIncident(toast)}
                aria-label="Report new incident"
            >
                <PlusCircle className="h-6 w-6" /> {/* Slightly larger icon for FAB */}
            </Button>
             <Button
                 variant="default"
                 size="sm"
                 className="hidden md:inline-flex h-9 rounded-md shadow-sm ml-2" // Hidden on mobile, static on larger screens
                 onClick={() => reportIncident(toast)}
                 aria-label="Report new incident"
            >
                 <PlusCircle className="h-4 w-4 mr-1.5" />
                 <span className="text-sm">Report</span>
            </Button>
        </div>
      </div>
    </header>
  );
}
