
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme"; // Import defaultTheme

const config = {
    darkMode: ["class"],
    content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}', // Added src directory
	],
  prefix: "",
  theme: {
    container: { // Added container configuration
      center: true,
      padding: {
        DEFAULT: "1rem", // Default padding for smaller screens
        sm: "2rem",      // Padding for sm screens and up
        lg: "4rem",      // Padding for lg screens and up
        xl: "5rem",      // Padding for xl screens and up
        "2xl": "6rem",   // Padding for 2xl screens and up
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px", // Match common breakpoints
      },
    },
  	extend: {
       fontFamily: { // Added font family extension
        sans: ["var(--font-inter)", ...fontFamily.sans], // Use Inter as primary sans font
      },
  		colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
        // Removed unused chart colors and severity colors as they are defined in globals.css vars
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
          // Added fade-in and slide-down animations used in globals.css
          "fadeIn": {
            from: { opacity: '0' },
            to: { opacity: '1' },
          },
          "slideDown": {
            from: { transform: 'translateY(-10px)', opacity: '0' },
            to: { transform: 'translateY(0)', opacity: '1' },
          },
  		},
  		animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fadeIn": "fadeIn 0.3s ease-out forwards", // Added
        "slideDown": "slideDown 0.4s ease-out forwards", // Added
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config; // Use "satisfies Config" for better type checking

export default config;
