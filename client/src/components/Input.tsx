import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    className = "",
    ...props
}) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-xs font-bold text-slate-500 ml-1">
                    {label}
                </label>
            )}
            <input
                className={`border border-slate-300 rounded-lg px-3 py-2.5 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${className}`}
                {...props}
            />
        </div>
    );
};
