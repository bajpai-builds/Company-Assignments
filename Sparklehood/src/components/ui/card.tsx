import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      // Apply glassmorphism and animated neon border in dark mode
      "dark:glass-effect dark:hover:neon-border-animated",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// Apply headline-gradient style to CardTitle in dark mode
const CardTitle = React.forwardRef<
  HTMLHeadingElement, // Changed to HTMLHeadingElement for semantic correctness
  React.HTMLAttributes<HTMLHeadingElement> // Use HTMLHeadingElement here too
>(({ className, children, ...props }, ref) => (
  <h3 // Use h3 for semantic structure within a card
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight", // Adjusted size
      "dark:kinetic-text-fill dark:text-transparent dark:bg-clip-text", // Apply kinetic gradient fill in dark mode
      className
    )}
    {...props}
  >
      {children}
  </h3>
))
CardTitle.displayName = "CardTitle"


const CardDescription = React.forwardRef<
  HTMLParagraphElement, // Changed to HTMLParagraphElement
  React.HTMLAttributes<HTMLParagraphElement> // Use HTMLParagraphElement here too
>(({ className, ...props }, ref) => (
  <p // Use p tag
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
