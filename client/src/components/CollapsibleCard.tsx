import React, { useState } from "react";

interface CollapsibleCardProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
    title,
    children,
    defaultOpen = true,
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div
            className={`bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden ${className}`}
        >
            {/* 헤더 영역 (클릭 시 토글) */}
            <div
                className="bg-slate-50 p-4 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors select-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="font-bold text-slate-700">{title}</h3>
                <span className="text-slate-400 font-bold text-lg">
                    {isOpen ? "−" : "+"}
                </span>
            </div>

            {/* 컨텐츠 영역 (열렸을 때만 보임) */}
            {isOpen && (
                <div className="p-4 border-t border-slate-100">{children}</div>
            )}
        </div>
    );
};
