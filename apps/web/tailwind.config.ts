import type { Config } from "tailwindcss";
import { amlbtPreset } from "@amlbt/config/tailwind";

const config: Config = {
  presets: [amlbtPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config;
