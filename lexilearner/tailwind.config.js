const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        black: "#2F1E38",
        white: "#FEFDF8",
        gray: "#453751",
        accentBlue: "#6798C0",
        lightGray: {
          DEFAULT: "#EAEDEE",
          50: "#EAEDEE",
          100: "#DAE0E1",
          200: "#BBC5C8",
          300: "#9CABAF",
          400: "#7D9096",
          500: "#627479",
          600: "#49565A",
          700: "#30393B",
          800: "#171B1C",
        },

        vibrantBlue: "#AFE4F4",
        greenCorrect: "rgb(128 237 153)",
        redIncorrect: "#FF8282",
        orange: "rgb(255, 102, 62)",
        lightYellow: "#FED85D",
        yellowOrange: "#FFCD37",
        mutedYellowOrange: "rgb(180,174,149)",
        lightGrayOrange: "rgb(255, 233, 173)",
        lightBlue: "#99D6E9",
        difficultyBlue: "rgb(103,152,192)",
        difficultyGreen: "rgb(144,225,144)",

        dropShadowColor: "rgba(48,27,68,0.25)",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: {
          DEFAULT: "hsl(var(--background))",
        },
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
      },

      dropShadow: { custom: ["0px 3px 1px rgba(48, 27, 44, 0.25)"] },
      borderWidth: {
        hairline: hairlineWidth(),
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        poppins: "Poppins-Regular",
      },
      fontSize: {
        sm: 14,
        base: 16,
        lg: 18,
        xl: 22,
        "2xl": 24,
        "3xl": 30,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
