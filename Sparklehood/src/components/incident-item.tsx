
"use client";

import type { Incident, Comment, UserRole, User } from "@/types/incident"; // Added UserRole, User
import { useState, useMemo } from "react"; // Added useMemo
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SeverityBadge } from "@/components/severity-badge";
import { StatusBadge } from "@/components/status-badge";
import { Pencil, MessageSquare, Clock, Tag, Send, Calendar as CalendarIcon, User as UserIcon } from "lucide-react"; // Added UserIcon
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { format, formatDistanceToNow } from 'date-fns'; // Added formatDistanceToNow
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Added Avatar
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Added Tooltip


interface IncidentItemProps {
  incident: Incident;
  assignee: User | null; // Add assignee prop
  onEdit: (incident: Incident) => void;
  onCommentAdded: (incidentId: string, comment: Comment) => void;
  userRole: UserRole; // Add user role prop
}

export function IncidentItem({ incident, assignee, onEdit, onCommentAdded, userRole }: IncidentItemProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const { toast } = useToast();

  const isOverdue = incident.dueDate && new Date() > incident.dueDate && incident.status !== 'Closed' && incident.status !== 'Mitigated';

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Empty Comment",
        description: "Please enter some text to add a comment.",
        variant: "destructive",
      });
      return;
    }
     if (userRole === 'Viewer') {
        toast({ title: "Permission Denied", description: "Viewers cannot add comments.", variant: "destructive"});
        return;
    }

    setIsSubmittingComment(true);
    // Simulate adding comment
    setTimeout(() => {
      const commentToAdd: Comment = {
        id: `cmt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        author: "Demo User", // Replace with actual logged-in user later
        text: newComment,
        timestamp: new Date(),
      };
      onCommentAdded(incident.id, commentToAdd);
      setNewComment("");
      setIsSubmittingComment(false);
      // Notification is now handled in IncidentList
    }, 300);
  };

  const sortedComments = useMemo(() => {
    return [...(incident.comments || [])].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [incident.comments]);

  return (
    <Card className="mb-4 animate-fadeIn shadow-md transition-shadow duration-300 hover:shadow-lg">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={`item-${incident.id}`} className="border-b-0">
          <AccordionTrigger className="hover:no-underline p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-t-lg">
            <div className="flex justify-between items-start sm:items-center w-full flex-col sm:flex-row gap-3"> {/* Increased gap */}
              <div className="flex-grow mr-4 text-left space-y-2"> {/* Increased space */}
                <CardTitle className="text-lg">{incident.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  {/* Badges Row */}
                  <SeverityBadge severity={incident.severity} />
                  <StatusBadge status={incident.status} />
                   {incident.dueDate && (
                     <TooltipProvider>
                       <Tooltip>
                         <TooltipTrigger asChild>
                            <Badge
                              variant={isOverdue ? "destructive" : "outline"}
                              className={cn("flex items-center gap-1 text-xs font-normal cursor-default", isOverdue && "animate-pulse")}
                            >
                              <Clock className="h-3 w-3" />
                              Due: {format(incident.dueDate, 'PP')}
                              {isOverdue && <span className="font-medium ml-1">(Overdue)</span>}
                            </Badge>
                         </TooltipTrigger>
                         <TooltipContent>
                           <p>Due Date: {format(incident.dueDate, 'PPP')}</p>
                         </TooltipContent>
                       </Tooltip>
                     </TooltipProvider>
                   )}
                </div>
                 <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap pt-1">
                    {/* Assignee and Reported Date Row */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <div className="flex items-center gap-1.5 cursor-default">
                                <Avatar className="h-5 w-5 border">
                                    <AvatarImage src={assignee?.avatarUrl} alt={assignee?.name ?? 'Unassigned'} data-ai-hint="user avatar" />
                                    <AvatarFallback className="text-[10px]">
                                        {assignee ? assignee.name.charAt(0) : '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="truncate max-w-[100px] sm:max-w-[150px]">
                                    {assignee?.name ?? 'Unassigned'}
                                </span>
                            </div>
                        </TooltipTrigger>
                         <TooltipContent>
                           <p>Assigned to: {assignee?.name ?? 'Unassigned'}</p>
                         </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                     <span className="flex items-center gap-1">
                       <CalendarIcon className="h-3 w-3"/>
                       Reported: {formatDistanceToNow(incident.reportedDate, { addSuffix: true })}
                     </span>
                 </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer shrink-0 self-end sm:self-center">
                <span>Details</span>
                 {/* Chevron is automatically handled by AccordionTrigger */}
                 {/* Optionally add comment count here */}
                 <Badge variant="outline" className="text-xs font-normal ml-1">{sortedComments.length} {sortedComments.length === 1 ? 'Comment' : 'Comments'}</Badge>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="pt-2 pb-4 px-4 space-y-4">
              <p className="text-sm text-foreground">{incident.description}</p>

               {/* Tags */}
              {incident.tags && incident.tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {incident.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs font-normal">{tag}</Badge>
                  ))}
                </div>
              )}

              <Separator />

              {/* Comments Section */}
              <div className="space-y-4">
                 <h4 className="text-md font-semibold flex items-center gap-2">
                   <MessageSquare className="h-5 w-5 text-primary" />
                   Discussion ({sortedComments.length})
                 </h4>
                 <div className="max-h-60 overflow-y-auto space-y-3 pr-2 text-sm">
                   {sortedComments.length > 0 ? (
                     sortedComments.map(comment => (
                       <div key={comment.id} className="p-3 bg-muted/50 rounded-md border">
                         <p className="mb-1 whitespace-pre-wrap">{comment.text}</p> {/* Allow line breaks */}
                         <p className="text-xs text-muted-foreground">
                           <span className="font-medium">{comment.author}</span> - {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                         </p>
                       </div>
                     ))
                   ) : (
                     <p className="text-sm text-muted-foreground italic">No comments yet.</p>
                   )}
                 </div>

                 {/* Add Comment Form */}
                 {userRole !== 'Viewer' && ( // Only show comment form if not Viewer
                    <div className="flex items-start gap-2 pt-2">
                       <Textarea
                           placeholder="Add a comment..."
                           value={newComment}
                           onChange={(e) => setNewComment(e.target.value)}
                           className="flex-grow resize-none text-sm min-h-[60px]"
                           rows={2}
                           disabled={isSubmittingComment}
                       />
                       <Button
                           size="icon"
                           onClick={handleAddComment}
                           disabled={isSubmittingComment || !newComment.trim()}
                           aria-label="Add comment"
                           className="shrink-0"
                       >
                          {isSubmittingComment ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div> : <Send className="h-4 w-4" /> }
                       </Button>
                    </div>
                 )}
                 {userRole === 'Viewer' && (
                    <p className="text-sm text-muted-foreground italic pt-2">Commenting is disabled for viewers.</p>
                 )}
              </div>

            </CardContent>
            <CardFooter className="flex justify-end px-4 pb-4 pt-0">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent accordion toggle if clicking edit
                        onEdit(incident);
                    }}
                    aria-label={`Edit incident: ${incident.title}`}
                    disabled={userRole === 'Viewer'} // Disable button for viewers
                    title={userRole === 'Viewer' ? "Editing disabled for viewers" : "Edit Incident Details"}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Details
                </Button>
            </CardFooter>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
