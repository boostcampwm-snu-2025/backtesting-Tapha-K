import React from "react";
import { type BacktestResult } from "../../../commons/types";

interface Props {
    result: BacktestResult | null; // 부모에게 받을 결과 데이터
    isLoading: boolean;
}

export const ResultSection: React.FC<Props> = ({ result, isLoading }) => {
    // 1. 로딩 중일 때
    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-lg border border-slate-200 min-h-[400px]">
                <div className="animate-spin text-4xl mb-4">⚙️</div>
                <p className="text-slate-500 font-bold animate-pulse">
                    과거 데이터를 분석하고 있습니다...
                </p>
            </div>
        );
    }

    // 2. 결과 없을 때 (초기 상태)
    if (!result) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-300 min-h-[400px]">
                <div className="text-4xl mb-4">📈</div>
                <p className="text-slate-500 font-medium">
                    아직 백테스팅 결과가 없습니다.
                </p>
                <p className="text-slate-400 text-sm mt-1">
                    왼쪽 패널에서 전략을 생성하고 실행해보세요.
                </p>
            </div>
        );
    }

    const values = result.chartData.map((d) => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    // 최소값이 0보다 크면 0부터 시작하게, 아니면 최소값부터 시작하게 조정 (시각적 안정성)
    const baseLine = minVal > 0 ? minVal * 0.9 : minVal;
    const range = maxVal - baseLine;

    // 3. 결과 있을 때 (차트 & 통계 표시)
    return (
        <div className="flex-1 min-h-[400px] flex flex-col gap-4 relative p-4">
            {/* 차트 영역 */}
            <div className="flex-1 flex items-end justify-between space-x-2 border-b border-slate-200 relative pb-6">
                {result.chartData.map((d, i) => {
                    // 높이 계산: (현재값 - 기준선) / 범위 * 80% (너무 꽉 차지 않게) + 최소 5%
                    const heightPercent =
                        range === 0
                            ? 50
                            : ((d.value - baseLine) / range) * 80 + 5;

                    return (
                        <div
                            key={i}
                            className="flex flex-col items-center gap-1 w-full group relative h-full justify-end"
                        >
                            {/* 막대 */}
                            <div
                                className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-all duration-300 relative"
                                style={{ height: `${heightPercent}%` }}
                            >
                                {/* 툴팁 (호버 시 값 표시) */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 shadow-lg pointer-events-none">
                                    <span className="font-bold">{d.value}</span>
                                    <span className="text-slate-400 ml-1">
                                        ({d.date})
                                    </span>
                                    {/* 말풍선 꼬리 */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                </div>
                            </div>

                            {/* X축 레이블 (날짜) - 공간 부족하면 숨기거나 줄여서 표시 */}
                            <span className="text-[10px] text-slate-400 absolute -bottom-6 w-full text-center truncate">
                                {d.date.slice(5)}{" "}
                                {/* '2023-01' -> '01'만 표시하거나 필요에 따라 조정 */}
                            </span>
                        </div>
                    );
                })}

                {/* 배경 가로선 (Grid Lines) - 장식용 */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-6">
                    <div className="w-full h-[1px] bg-slate-100 border-t border-dashed border-slate-200"></div>
                    <div className="w-full h-[1px] bg-slate-100 border-t border-dashed border-slate-200"></div>
                    <div className="w-full h-[1px] bg-slate-100 border-t border-dashed border-slate-200"></div>
                </div>
            </div>

            <div className="text-center text-xs text-slate-400 mt-2">
                * 자산 가치 변화 추이 (Mock Data)
            </div>
        </div>
    );
};
