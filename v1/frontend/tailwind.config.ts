import type { Config } from "tailwindcss";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const addVariablesForColors = ({ addBase, theme }: any) => {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
};

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Inclui os arquivos no diretório "app"
    "./components/**/*.{js,ts,jsx,tsx}", // Inclui os componentes personalizados
    "./features/**/*.{js,ts,jsx,tsx}", // Inclui as pastas das features
    "./node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}", // Inclui os componentes do ShadCN/UI
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              scrollMargin: "20px",
              fontSize: "2.5rem",
              fontWeight: "800",
              letterSpacing: "-0.02em",
            },
            h2: {
              scrollMargin: "20px",
              fontSize: "2rem",
              fontWeight: "600",
              letterSpacing: "-0.01em",
              borderBottom: "2px solid",
              paddingBottom: "0.5rem",
            },
            h3: {
              scrollMargin: "20px",
              fontSize: "1.75rem",
              fontWeight: "600",
            },
            h4: {
              scrollMargin: "20px",
              fontSize: "1.5rem",
              fontWeight: "600",
            },
            p: {
              lineHeight: "1.75",
              marginTop: "1.5rem",
            },
            blockquote: {
              marginTop: "1.5rem",
              paddingLeft: "1.5rem",
              borderLeft: "2px solid",
              fontStyle: "italic",
            },
            code: {
              backgroundColor: "#f4f4f5",
              borderRadius: "0.375rem",
              padding: "0.25rem 0.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
            },
          },
        },
      },
      fontFamily: {
        nunito: ["Nunito Sans", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        move: { 
          "0%": { transform: "translateX(-200px)" },
          "100%": { transform: "translateX(200px)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        aurora: "aurora 60s linear infinite",
      },
      screens: {
        xs: "475px", // Mobile pequeno
        sm: "640px",   // Mobile
        md: "768px",   // Tablet
        lg: "1024px",  // Notebook
        xl: "1280px",  // Desktop Padrão
        hd: "1366px",  // HD
        fhd: "1800px", // Full HD
        uw: "2500px",  // Ultrawide e 2K
      },
      aurora: {
        from: {
          backgroundPosition: "50% 50%, 50% 50%",
        },
        to: {
          backgroundPosition: "350% 50%, 350% 50%",
        },
      },
    },
  },
  plugins: [addVariablesForColors, tailwindcssAnimate, typography],
};

export default config;
