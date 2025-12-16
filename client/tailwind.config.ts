import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", // Tailwind가 스캔할 파일
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};

export default config;
