/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                dark: "#131414",
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};

