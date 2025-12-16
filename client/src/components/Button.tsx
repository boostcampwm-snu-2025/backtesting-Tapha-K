// src/components/common/Button.tsx

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    className = "",
    children,
    ...props
}) => {
    const baseStyle =
        "px-4 py-2 rounded-lg font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

    const variants = {
        // Primary: 파란색 (그대로 유지)
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",

        // Secondary: (수정됨) 흰색 배경에 진한 테두리를 줘서 또렷하게 만듦
        // hover 시 테두리가 파란색으로 변하며 상호작용 피드백 제공
        secondary:
            "bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50",

        // Danger: (수정됨)
        danger: "bg-white border-2 border-red-100 text-red-600 hover:border-red-300 hover:bg-red-50",
    };

    return (
        <button
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
