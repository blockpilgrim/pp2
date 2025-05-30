/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground, white)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        nav: {
          DEFAULT: "var(--nav-background)",
          foreground: "var(--nav-foreground)",
        }
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        imageIn: {
          '0%': { opacity: '0' },
          '50%': { opacity: '0' },
          '51%': { opacity: '1' },
          '100%': { opacity: '1' },
        },
        coverOut: {
          '0%': { width: '0%', left: '0%', right: 'auto' },
          '50%': { width: '100%', left: '0%', right: 'auto' },
          '100%': { width: '0%', left: 'auto', right: '0%' },
        },
        borderIn: { // Animates top and right borders
          '0%': { top: '100%', right: '0%', height: '0%', width: '0%', borderTopWidth: '0px', borderRightWidth: '0px', opacity: '0' },
          '1%': { opacity: '1'},
          '25%': {
            top: '-25px', right: 'calc(100% - 5px + 25px)',
            height: 'calc(100% + 50px)', width: '5px',
            borderTopWidth: '5px', borderRightWidth: '5px',
            borderTopColor: 'var(--primary)', borderRightColor: 'var(--primary)',
          },
          '50%': {
            top: '-25px', right: '-25px',
            height: 'calc(100% + 50px)', width: 'calc(100% + 50px)',
            borderTopWidth: '5px', borderRightWidth: '5px',
            borderTopColor: 'var(--primary)', borderRightColor: 'var(--primary)',
          },
          '100%': {
            top: '-25px', right: '-25px',
            height: 'calc(100% + 50px)', width: 'calc(100% + 50px)',
            borderTopWidth: '5px', borderRightWidth: '5px',
            borderTopColor: 'var(--primary)', borderRightColor: 'var(--primary)',
          }
        },
        borderInTwo: { // Animates bottom and left borders
          '0%': { bottom: '100%', left: '0%', height: '0%', width: '0%', borderBottomWidth: '0px', borderLeftWidth: '0px', opacity: '0' },
          '49%': { opacity: '0'},
          '50%': {
            opacity: '1',
            bottom: '-25px', left: 'calc(100% - 5px + 25px)',
            height: 'calc(100% + 50px)', width: '5px',
            borderBottomWidth: '5px', borderLeftWidth: '5px',
            borderBottomColor: 'var(--primary)', borderLeftColor: 'var(--primary)',
          },
          '75%': {
            bottom: '-25px', left: '-25px',
            height: 'calc(100% + 50px)', width: 'calc(100% + 50px)',
            borderBottomWidth: '5px', borderLeftWidth: '5px',
            borderBottomColor: 'var(--primary)', borderLeftColor: 'var(--primary)',
          },
          '100%': {
            bottom: '-25px', left: '-25px',
            height: 'calc(100% + 50px)', width: 'calc(100% + 50px)',
            borderBottomWidth: '5px', borderLeftWidth: '5px',
            borderBottomColor: 'var(--primary)', borderLeftColor: 'var(--primary)',
          }
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        imageIn: 'imageIn 0.5s ease 1s forwards',
        coverOut: 'coverOut 0.5s ease 1s forwards',
        borderIn: 'borderIn 1s ease forwards',
        borderInTwo: 'borderInTwo 1s ease forwards',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}