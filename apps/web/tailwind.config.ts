import type { Config } from "tailwindcss";

const config: Pick<Config, "presets"> = {
  presets: [
    {
        darkMode: ["class"],
        content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./ui/**/*.{js,ts,jsx,tsx}",
        // h/t to https://www.willliu.com/blog/Why-your-Tailwind-styles-aren-t-working-in-your-Turborepo
        "../../packages/ui/src/**/*{.js,.ts,.jsx,.tsx}",
        "../../packages/blocks/src/**/*{.js,.ts,.jsx,.tsx}",
      ],
      theme: {
      	extend: {
      		animation: {
      			'infinite-scroll': 'infinite-scroll 22s linear infinite',
      			'text-appear': 'text-appear 0.15s ease',
      			'table-pinned-shadow': 'table-pinned-shadow cubic-bezier(0, 0, 1, 0)'
      		},
      		keyframes: {
      			'infinite-scroll': {
      				'0%': {
      					transform: 'translateX(0)'
      				},
      				'100%': {
      					transform: 'translateX(-150%)'
      				}
      			},
      			'text-appear': {
      				'0%': {
      					opacity: '0',
      					transform: 'rotateX(45deg) scale(0.95)'
      				},
      				'100%': {
      					opacity: '1',
      					transform: 'rotateX(0deg) scale(1)'
      				}
      			},
      			'table-pinned-shadow': {
      				'0%': {
      					filter: 'drop-shadow(rgba(0, 0, 0, 0.1) -2px 10px 6px)'
      				},
      				'100%': {
      					filter: 'drop-shadow(rgba(0, 0, 0, 0) -2px 10px 6px)'
      				}
      			}
      		},
      		borderRadius: {
      			lg: 'var(--radius)',
      			md: 'calc(var(--radius) - 2px)',
      			sm: 'calc(var(--radius) - 4px)'
      		},
      		colors: {
      			background: 'hsl(var(--background))',
      			foreground: 'hsl(var(--foreground))',
      			card: {
      				DEFAULT: 'hsl(var(--card))',
      				foreground: 'hsl(var(--card-foreground))'
      			},
      			popover: {
      				DEFAULT: 'hsl(var(--popover))',
      				foreground: 'hsl(var(--popover-foreground))'
      			},
      			primary: {
      				DEFAULT: 'hsl(var(--primary))',
      				foreground: 'hsl(var(--primary-foreground))'
      			},
      			secondary: {
      				DEFAULT: 'hsl(var(--secondary))',
      				foreground: 'hsl(var(--secondary-foreground))'
      			},
      			muted: {
      				DEFAULT: 'hsl(var(--muted))',
      				foreground: 'hsl(var(--muted-foreground))'
      			},
      			accent: {
      				DEFAULT: 'hsl(var(--accent))',
      				foreground: 'hsl(var(--accent-foreground))'
      			},
      			destructive: {
      				DEFAULT: 'hsl(var(--destructive))',
      				foreground: 'hsl(var(--destructive-foreground))'
      			},
      			border: 'hsl(var(--border))',
      			input: 'hsl(var(--input))',
      			ring: 'hsl(var(--ring))',
      			chart: {
      				'1': 'hsl(var(--chart-1))',
      				'2': 'hsl(var(--chart-2))',
      				'3': 'hsl(var(--chart-3))',
      				'4': 'hsl(var(--chart-4))',
      				'5': 'hsl(var(--chart-5))'
      			}
      		}
      	}
      },
        plugins: [require("tailwindcss-animate")]
    },
  ],
};

export default config;
