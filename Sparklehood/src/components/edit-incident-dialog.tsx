
"use client";

import type { Incident, Severity, IncidentStatus, Comment, User } from "@/types/incident"; // Import User type
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Tag, X, User as UserIcon } from "lucide-react"; // Added UserIcon
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";


// Updated schema to include new fields
const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, { message: "Description cannot exceed 500 characters." }),
  severity: z.enum(["Low", "Medium", "High"], {
    required_error: "You need to select a severity level.",
  }),
  status: z.enum(["New", "Investigating", "Mitigated", "Closed"], {
    required_error: "You need to select a status.",
  }),
  dueDate: z.date().nullable().optional(), // Allow null or undefined
  tags: z.array(z.string().min(1, "Tag cannot be empty").max(20, "Tag too long")).max(5, "Maximum 5 tags allowed").optional(),
  assigneeId: z.string().nullable().optional(), // Add assigneeId field
});

type FormData = z.infer<typeof formSchema>;

interface EditIncidentDialogProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (incident: Incident) => void;
  users: User[]; // Add users prop for assignee dropdown
}

export function EditIncidentDialog({ incident, isOpen, onClose, onUpdate, users }: EditIncidentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      severity: undefined,
      status: undefined,
      dueDate: null,
      tags: [],
      assigneeId: null, // Default assignee to null
    },
  });

  const { reset, control, handleSubmit, setValue, watch, formState: { errors } } = form; // Removed 'isValid' as button disabled state is simpler
  const currentTags = watch("tags") || [];

   // Reset form when the incident or isOpen state changes
  useEffect(() => {
    if (incident && isOpen) {
      reset({
        title: incident.title,
        description: incident.description,
        severity: incident.severity,
        status: incident.status,
        dueDate: incident.dueDate || null,
        tags: incident.tags || [],
        assigneeId: incident.assigneeId || null, // Set assignee from incident
      });
      setTagInput(""); // Clear tag input on open
    } else if (!isOpen) {
        reset(); // Clear form when dialog closes
    }
  }, [incident, isOpen, reset]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
     if ((e as React.KeyboardEvent<HTMLInputElement>).key === 'Enter' || e.type === 'click') {
        e.preventDefault();
        const newTag = tagInput.trim().toLowerCase();
        if (newTag && !currentTags.includes(newTag) && currentTags.length < 5) {
            setValue("tags", [...currentTags, newTag], { shouldValidate: true });
            setTagInput("");
        } else if (currentTags.includes(newTag)) {
             toast({ title: "Duplicate Tag", description: "This tag has already been added.", variant: "destructive" });
        } else if (currentTags.length >= 5) {
             toast({ title: "Tag Limit Reached", description: "You can add a maximum of 5 tags.", variant: "destructive" });
        }
     }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue("tags", currentTags.filter(tag => tag !== tagToRemove), { shouldValidate: true });
  };


  function onSubmit(values: FormData) {
    if (!incident) return; // Should not happen if dialog is open

    setIsSubmitting(true);
    console.log("Updating incident:", values);

    const updatedIncident: Incident = {
      ...incident, // Spread existing incident data (like id, reportedDate, comments)
      title: values.title,
      description: values.description,
      severity: values.severity as Severity,
      status: values.status as IncidentStatus,
      dueDate: values.dueDate,
      tags: values.tags || [],
      assigneeId: values.assigneeId || null, // Update assigneeId
    };

    // Simulate API call delay
    setTimeout(() => {
      onUpdate(updatedIncident);
      // Toast notification is handled in IncidentList now
      setIsSubmitting(false);
      onClose(); // Close the dialog on successful update
    }, 500);
  }

  // Handle external close (e.g., clicking outside, pressing Esc)
  const handleOpenChange = (open: boolean) => {
      if (!open) {
          onClose();
      }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto"> {/* Increased width and added scroll */}
        <DialogHeader>
          <DialogTitle>Edit Incident: {incident?.title}</DialogTitle>
           <DialogDescription>
             Update the incident details below. Click save when finished.
           </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4 pr-2"> {/* Added padding-right for scrollbar */}
            {/* Title */}
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter incident title" {...field} aria-required="true" aria-invalid={!!errors.title} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Description */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the incident in detail"
                      className="resize-y min-h-[100px]" // Allow vertical resize
                      maxLength={500}
                      {...field}
                      aria-required="true"
                      aria-invalid={!!errors.description}
                    />
                  </FormControl>
                   <FormDescription className="flex justify-end text-xs pt-1">
                      {field.value?.length || 0} / 500 characters
                    </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Severity */}
            <FormField
              control={control}
              name="severity"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Severity <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                       aria-required="true"
                       aria-invalid={!!errors.severity}
                    >
                      {(["Low", "Medium", "High"] as Severity[]).map(sev => (
                         <FormItem key={sev} className="flex items-center space-x-2 space-y-0">
                           <FormControl>
                             <RadioGroupItem value={sev} id={`edit-severity-${sev.toLowerCase()}`} />
                           </FormControl>
                           <FormLabel htmlFor={`edit-severity-${sev.toLowerCase()}`} className="font-normal cursor-pointer">{sev}</FormLabel>
                         </FormItem>
                       ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


             {/* Status, Assignee, Due Date */}
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Status */}
                 <FormField
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status <span className="text-destructive">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger aria-required="true" aria-invalid={!!errors.status}>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(["New", "Investigating", "Mitigated", "Closed"] as IncidentStatus[]).map(stat => (
                            <SelectItem key={stat} value={stat}>{stat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 {/* Assignee */}
                <FormField
                    control={control}
                    name="assigneeId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Assignee (Optional)</FormLabel>
                         <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                            <FormControl>
                              <SelectTrigger>
                                  <UserIcon className="h-4 w-4 mr-2 text-muted-foreground"/>
                                <SelectValue placeholder="Select assignee" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="null">Unassigned</SelectItem>
                              {users.map(user => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Due Date */}
                <FormField
                    control={control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col sm:col-span-2"> {/* Span full width on small screens if needed */}
                        <FormLabel>Due Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal w-full", // Make button full width
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ?? undefined} // Pass undefined if null
                              onSelect={(date) => field.onChange(date ?? null)} // Handle undefined case
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0)) // Disable past dates
                              }
                              initialFocus
                            />
                             <div className="p-2 border-t border-border">
                                 <Button variant="ghost" size="sm" onClick={() => field.onChange(null)}>Clear Date</Button>
                             </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                />
             </div>


               {/* Tags Input */}
                <FormField
                    control={control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags (Optional, up to 5)</FormLabel>
                             <FormControl>
                                <div className="flex items-center gap-2 border p-2 rounded-md">
                                  <Tag className="h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        placeholder="Add a tag and press Enter"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        className="flex-grow h-8 border-none shadow-none focus-visible:ring-0"
                                        disabled={currentTags.length >= 5}
                                    />
                                     <Button type="button" size="sm" variant="ghost" onClick={handleAddTag} disabled={!tagInput.trim() || currentTags.length >= 5}>Add</Button>
                                </div>
                             </FormControl>
                             <FormDescription>
                                 Press Enter or click Add to add a tag. Max 20 chars per tag.
                             </FormDescription>
                             {currentTags.length > 0 && (
                                 <div className="flex flex-wrap gap-2 pt-2">
                                     {currentTags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                             {tag}
                                             <button type="button" onClick={() => handleRemoveTag(tag)} aria-label={`Remove tag ${tag}`} className="ml-1 rounded-full hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring">
                                                 <X className="h-3 w-3"/>
                                             </button>
                                         </Badge>
                                     ))}
                                 </div>
                             )}
                            <FormMessage />
                        </FormItem>
                    )}
                />


             <DialogFooter className="pt-4">
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                 <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                 </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
