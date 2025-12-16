import React, { useState } from "react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { type SavedStrategy } from "../../../commons/types";

interface Props {
    strategy: SavedStrategy | null;
    isOpen: boolean;
    onClose: () => void;
}

export const StrategyDetailModal: React.FC<Props> = ({
    strategy,
    isOpen,
    onClose,
}) => {
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    if (!strategy) return null;

    // AI 분석 요청 핸들러
    const handleAnalyze = async () => {
        setIsAnalyzing(true);

        try {
            if (!strategy) return; // 방어 코드

            // config 뿐만 아니라 result(수익률 등)도 함께 전송
            const payload = {
                config: strategy.config,
                result: strategy.result,
            };

            const response = await fetch(
                "http://localhost:3000/api/ai/analyze",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload), // payload 전송
                }
            );

            const data = await response.json();
            setAiAnalysis(data.analysis);
        } catch (error) {
            console.error(error);
            setAiAnalysis("분석 요청 중 오류가 발생했습니다.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // 모달 닫힐 때 분석 내용 초기화 (선택사항)
    const handleClose = () => {
        setAiAnalysis(null);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={strategy.name}
            size="lg" // 내용을 많이 담아야 하니 큰 사이즈
            footer={
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
            }
        >
            <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* 1. 기본 설명 */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-bold text-slate-500">
                            SUMMARY
                        </h4>
                        {/* 분석 기간 표시 */}
                        <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm">
                            📅 기간: {strategy.config.period.startDate} ~{" "}
                            {strategy.config.period.endDate}
                        </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {strategy.description || "작성된 설명이 없습니다."}
                    </p>
                    <div className="mt-3 flex gap-2">
                        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {strategy.config.market.type}
                        </span>
                        {strategy.config.market.sectors.map((s) => (
                            <span
                                key={s}
                                className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 2. 사용된 파라미터 (읽기 전용 리스트) */}
                <div>
                    <h4 className="text-sm font-bold text-slate-500 mb-2">
                        PARAMETERS
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {strategy.config.parameters.map((param) => (
                            <div
                                key={param.id}
                                className="flex justify-between items-center p-2 bg-white border border-slate-200 rounded text-sm"
                            >
                                <span className="text-slate-500">
                                    {param.label}
                                </span>
                                <span className="font-bold text-slate-800">
                                    {param.value}
                                    <span className="text-xs font-normal ml-0.5">
                                        {param.unit}
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. 백테스트 결과 요약 */}
                <div>
                    <h4 className="text-sm font-bold text-slate-500 mb-2">
                        BACKTEST RESULTS
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                        <ResultBox
                            label="Total Return"
                            value={`${strategy.result.stats.totalReturn}%`}
                            color="text-blue-600"
                        />
                        <ResultBox
                            label="Win Rate"
                            value={`${strategy.result.stats.winRate}%`}
                            color="text-green-600"
                        />
                        <ResultBox
                            label="MDD"
                            value={`${strategy.result.stats.mdd}%`}
                            color="text-red-500"
                        />
                    </div>
                </div>

                {/* 4. AI 심층 분석 (하이라이트!) */}
                <div className="border-t border-slate-200 pt-6 mt-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            🤖 AI Insight
                        </h3>
                        {!aiAnalysis && (
                            <Button
                                variant="primary"
                                className="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 border-none"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing}
                            >
                                {isAnalyzing
                                    ? "분석 중..."
                                    : "지금 분석하기 ✨"}
                            </Button>
                        )}
                    </div>

                    {/* 분석 결과 출력 영역 */}
                    {aiAnalysis ? (
                        <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 text-slate-700 leading-relaxed animate-fade-in whitespace-pre-line">
                            {aiAnalysis}
                        </div>
                    ) : (
                        <div className="bg-slate-50 h-32 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-sm">
                            {isAnalyzing
                                ? "AI가 전략을 면밀히 검토하고 있습니다..."
                                : "버튼을 눌러 AI 회고를 받아보세요."}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

// 작은 통계 박스 컴포넌트
const ResultBox = ({
    label,
    value,
    color,
}: {
    label: string;
    value: string;
    color: string;
}) => (
    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
        <span className="text-xs text-slate-400 block mb-1 uppercase">
            {label}
        </span>
        <span className={`text-lg font-extrabold ${color}`}>{value}</span>
    </div>
);
