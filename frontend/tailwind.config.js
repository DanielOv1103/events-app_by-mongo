/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,jsx}",
        "./components/**/*.{js,jsx}",
        "./app/**/*.{js,jsx}",
        "./src/**/*.{js,jsx}",
    ],
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
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                success: {
                    DEFAULT: "hsl(var(--success))",
                    foreground: "hsl(var(--success-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Colores personalizados para el Switch
                violet: {
                    500: '#8b5cf6',
                    600: '#7c3aed',
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
            // Estilos específicos para el Switch
            switch: {
                DEFAULT: {
                    track: {
                        checked: 'bg-violet-600',
                        unchecked: 'bg-gray-200',
                    },
                    thumb: {
                        checked: 'translate-x-5',
                        unchecked: 'translate-x-0',
                    },
                },
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        // Plugin para estilos avanzados del Switch
        function ({ addComponents }) {
            addComponents({
                '.switch': {
                    '@apply relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2': {},
                    '&[data-state="checked"]': {
                        '@apply bg-violet-600': {},
                    },
                    '&[data-state="unchecked"]': {
                        '@apply bg-gray-200': {},
                    },
                },
                '.switch-thumb': {
                    '@apply block h-5 w-5 rounded-full bg-white shadow-lg transition-transform': {},
                    '&[data-state="checked"]': {
                        '@apply translate-x-5': {},
                    },
                    '&[data-state="unchecked"]': {
                        '@apply translate-x-0': {},
                    },
                },
            });
        },
    ],
}