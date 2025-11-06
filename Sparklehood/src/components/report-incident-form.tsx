
"use client";

import type { Incident, Severity, User } from "@/types/incident"; // Import User type
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Tag, X, User as UserIcon } from "lucide-react"; // Added UserIcon
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";


// Zod schema for form validation
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
  dueDate: z.date().nullable().optional(),
  tags: z.array(z.string().min(1, "Tag cannot be empty").max(20, "Tag too long")).max(5, "Maximum 5 tags allowed").optional(),
  assigneeId: z.string().nullable().optional(), // Add assigneeId field
});

// Type derived from the schema
type FormData = z.infer<typeof formSchema>;

// Props for the component
interface ReportIncidentFormProps {
  onIncidentReported: (incident: Omit<Incident, 'id' | 'reportedDate' | 'comments' | 'status'>) => void;
  users: User[]; // Add users prop for assignee dropdown
}

export function ReportIncidentForm({ onIncidentReported, users }: ReportIncidentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      severity: undefined,
      dueDate: null,
      tags: [],
      assigneeId: null, // Default assignee to null
    },
  });

  const { control, handleSubmit, reset, setValue, watch, formState: { errors, isValid } } = form;
  const currentTags = watch("tags") || [];

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

  // Handle form submission
  function onSubmit(values: FormData) {
    setIsSubmitting(true);
    console.log("Reporting incident:", values);

    // Prepare the incident data, excluding fields managed by IncidentList
    const newIncidentData = {
        title: values.title,
        description: values.description,
        severity: values.severity as Severity,
        dueDate: values.dueDate,
        tags: values.tags || [],
        assigneeId: values.assigneeId || null, // Include assigneeId
    };


    // Simulate API call delay
    setTimeout(() => {
      onIncidentReported(newIncidentData);
      // Notification now handled in IncidentList
      reset(); // Reset form fields after successful submission
      setIsSubmitting(false);
    }, 500);
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
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

        {/* Description Field */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the incident in detail (max 500 chars)"
                  className="resize-y min-h-[100px]"
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

        {/* Severity Field */}
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
                         <RadioGroupItem value={sev} id={`report-severity-${sev.toLowerCase()}`} />
                       </FormControl>
                       <FormLabel htmlFor={`report-severity-${sev.toLowerCase()}`} className="font-normal cursor-pointer">{sev}</FormLabel>
                     </FormItem>
                   ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

         {/* Assignee and Due Date Side-by-Side */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Assignee Field */}
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
                          <SelectItem value="null">Unassigned</SelectItem> {/* Option for no assignee */}
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

            {/* Due Date Field */}
             <FormField
                control={control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
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


        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting || !isValid} >
            {isSubmitting ? "Reporting..." : "Report Incident"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
