import React, { useState } from "react";
import { Modal } from "../../../components/Modal";
import { PARAMETER_LIBRARY } from "../../../assets/staticData.ts";
import { type Parameter } from "../../../commons/types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (param: Parameter) => void;
}

const CATEGORIES = ["Trend", "Oscillator", "Volatility", "Volume", "Risk"];

export const ParameterLibraryModal: React.FC<Props> = ({
    isOpen,
    onClose,
    onAdd,
}) => {
    const [activeTab, setActiveTab] = useState("Trend");

    // 카테고리별 필터링
    const filteredParams = PARAMETER_LIBRARY.filter(
        (p) => p.category === activeTab
    );

    const handleAddClick = (param: Parameter) => {
        // ID가 중복되지 않게 현재 시간 추가하여 생성
        const newParam = { ...param, id: `${param.id}_${Date.now()}` };
        onAdd(newParam);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="📚 파라미터 라이브러리"
            size="lg"
        >
            <div className="flex flex-col h-[500px]">
                {/* 1. 카테고리 탭 */}
                <div className="flex gap-2 border-b border-slate-200 pb-4 mb-4 overflow-x-auto">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                                activeTab === cat
                                    ? "bg-slate-800 text-white shadow-md"
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* 2. 파라미터 그리드 */}
                <div className="grid grid-cols-2 gap-3 overflow-y-auto custom-scrollbar pr-2 pb-4">
                    {filteredParams.map((param) => (
                        <div
                            key={param.id}
                            onClick={() => handleAddClick(param)}
                            className="group cursor-pointer p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all flex flex-col gap-2"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-700 group-hover:text-blue-600">
                                    {param.label}
                                </span>
                                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded group-hover:bg-blue-50 group-hover:text-blue-600">
                                    + 추가
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-1">
                                {param.description}
                            </p>
                            <div className="mt-auto pt-2 border-t border-slate-50 flex justify-end">
                                <span className="text-xs font-mono text-slate-400">
                                    기본값:{" "}
                                    <span className="text-slate-800 font-bold">
                                        {param.value}
                                        {param.unit}
                                    </span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
};
