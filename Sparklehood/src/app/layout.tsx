
import type {Metadata} from 'next';
import { Inter } from 'next/font/google' // Using Inter font for a more modern look
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Ensure Toaster is imported
import { cn } from '@/lib/utils'; // Import cn utility

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Define CSS variable
});


export const metadata: Metadata = {
  title: 'SafetyWatch Dashboard',
  description: 'Monitor, report, manage, and discuss AI safety incidents.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply font variable correctly using cn and suppress hydration warning
    <html lang="en" className={cn('antialiased', inter.variable)} suppressHydrationWarning>
      {/* Removed padding/margin from body to allow header/main to control layout */}
      {/* Apply font-sans to body to ensure font is inherited */}
      <body className={`flex flex-col min-h-screen bg-background font-sans`}>
        {children}
         <Toaster /> {/* Ensure Toaster is rendered here */}
      </body>
    </html>
  );
}
