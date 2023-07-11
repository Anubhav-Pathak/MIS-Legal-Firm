/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [{
      "light": {
        primary: "#a42819",
        "primary-focus": "#7f1d13",
        "primary-content": "#ffffff",
        secondary: "#e5e7eb",
        "secondary-focus": "#d9d9d9",
        "secondary-content": "#000000",
        neutral: "#ffffff",
        "neutral-focus": "#f2f2f2",
        "neutral-content": "#000000",
        "base-100": "#ffffff",
        "base-200": "#f2f2f2",
        "base-300": "#d9d9d9",
        "base-content": "#000000",
        info: "#2094f3",
        success: "#009485",
        warning: "#ff9900",
        error: "#ff5724",
      }
    }]
  }
}
