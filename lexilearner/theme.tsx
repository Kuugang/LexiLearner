import { Theme as NavigationTheme } from "@react-navigation/native";

export interface CustomTheme extends NavigationTheme {
  fonts?: {
    regular: string;
    bold: string;
  };
  normalize?: (size: number, max: number) => number;
}

export default function getTheme(scheme: "light" | "dark"): CustomTheme {
  const dark = scheme === "dark";

  return {
    dark,
    colors: {
      primary: "#ff6b6b",
      background: dark ? "#1a1a1a" : "#f2f2f2",
      text: dark ? "#f2f2f2" : "#1a1a1a",
      card: dark ? "#222" : "#fff",
      border: dark ? "#333" : "#ddd",
      notification: "#ff453a",
    },
    fonts: {
      regular: "System",
      bold: "System-Bold",
    },
  };
}
