import { nextui } from "@nextui-org/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(accordion|autocomplete|avatar|badge|button|card|checkbox|chip|dropdown|input|listbox|modal|navbar|progress|radio|skeleton|toggle|tabs|user|divider|ripple|spinner|popover|scroll-shadow|menu|select).js",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          100: "#90e0ef",
          200: "#98c1d9",
          300: "#8ecae6",
          400: "#118ab2",
          500: "#0077b6",
          600: "#3d5a80",
          700: "#003459",
          800: "#003049",
          900: "#14213d",
        },
      },
    },
  },
  plugins: [nextui()],
};
export default config;
