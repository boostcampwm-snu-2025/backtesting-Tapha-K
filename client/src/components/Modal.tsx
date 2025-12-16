// src/components/common/Modal.tsx

import React, { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: "sm" | "md" | "lg"; // 크기 옵션 추가
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
}) => {
    // 모달이 열리면 뒷배경 스크롤 막기
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // 사이즈별 너비 설정
    const sizeClasses = {
        sm: "max-w-sm", // 알림창용 (작음)
        md: "max-w-md", // 일반용
        lg: "max-w-2xl", // 큰 화면용
    };

    return (
        // Backdrop (배경)
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            {/* Container */}
            <div
                className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} overflow-hidden animate-scale-up`}
            >
                {/* Header */}
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 font-bold text-xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">{children}</div>

                {/* Footer (Optional) */}
                {footer && (
                    <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
