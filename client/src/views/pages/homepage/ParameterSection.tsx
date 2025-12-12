import React from "react";
import { CollapsibleCard } from "../../../components/CollapsibleCard";
import { Button } from "../../../components/Button";
import { type Parameter } from "../../../commons/types";

interface Props {
    data: Parameter[];
    onChange: (data: Parameter[]) => void;
}

export const ParameterSection: React.FC<Props> = ({ data, onChange }) => {
    // 1. 값 변경 핸들러: 특정 ID의 파라미터 값을 수정해서 부모에게 전달
    const handleValueChange = (id: string, newValue: string) => {
        const updatedData = data.map((p) =>
            p.id === id ? { ...p, value: newValue } : p
        );
        onChange(updatedData);
    };

    // 2. 삭제 핸들러
    const handleDelete = (id: string) => {
        const updatedData = data.filter((p) => p.id !== id);
        onChange(updatedData);
    };

    // 3. 추가 핸들러 (데모용 더미 데이터 추가)
    const handleAdd = () => {
        const newParam: Parameter = {
            id: Date.now().toString(),
            category: "Trend",
            label: "새 조건",
            value: 0,
            description: "사용자 추가 조건",
        };
        onChange([...data, newParam]);
    };

    // 카테고리별 뱃지 색상
    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Trend":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "Oscillator":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "Volatility":
                return "bg-orange-100 text-orange-700 border-orange-200";
            case "Risk":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <CollapsibleCard title="3. Parameters (전략 변수)">
            <div className="flex flex-col gap-4">
                {/* 데이터가 없을 때 (초기 상태) */}
                {data.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <p className="text-sm font-bold">
                            아직 설정된 파라미터가 없습니다.
                        </p>
                        <p className="text-xs mt-1">
                            아래 AI 프롬프트를 입력하여
                            <br />
                            전략을 자동 생성해보세요!
                        </p>
                    </div>
                ) : (
                    /* 데이터가 있을 때 리스트 렌더링 */
                    <div className="max-h-[300px] overflow-y-auto pr-2 flex flex-col gap-3 custom-scrollbar">
                        {data.map((param) => (
                            <div
                                key={param.id}
                                className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:border-blue-200 transition-colors"
                            >
                                {/* 상단: 카테고리 뱃지 + 이름 + 삭제버튼 */}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getCategoryColor(
                                                param.category
                                            )}`}
                                        >
                                            {param.category}
                                        </span>
                                        <span className="text-xs font-bold text-slate-700 w-32 truncate">
                                            {param.label}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(param.id)}
                                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-2 font-bold"
                                        title="삭제"
                                    >
                                        ×
                                    </button>
                                </div>

                                {/* 하단: 설명 + 입력창 */}
                                <div className="flex items-center justify-between gap-4 mt-1">
                                    <span className="text-[10px] text-slate-400 truncate flex-1">
                                        {param.description || "설명 없음"}
                                    </span>

                                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded px-2 py-1 w-24 focus-within:ring-1 focus-within:ring-blue-500 shadow-sm">
                                        <input
                                            type="text"
                                            value={param.value}
                                            onChange={(e) =>
                                                handleValueChange(
                                                    param.id,
                                                    e.target.value
                                                )
                                            }
                                            className="w-full text-right text-sm font-bold text-slate-800 outline-none bg-transparent"
                                        />
                                        {param.unit && (
                                            <span className="text-xs text-slate-400 shrink-0 select-none">
                                                {param.unit}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 하단 추가 버튼 */}
                <div className="flex justify-end pt-2 border-t border-slate-100">
                    <Button
                        variant="secondary"
                        className="text-xs py-1.5 px-3"
                        onClick={handleAdd}
                    >
                        + 파라미터 추가
                    </Button>
                </div>
            </div>
        </CollapsibleCard>
    );
};
