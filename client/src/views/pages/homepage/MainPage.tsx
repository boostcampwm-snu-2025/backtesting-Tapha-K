import React, { useState } from "react";
import { PeriodSection } from "./PeriodSection";
import { MarketSection } from "./MarketSection";
import { ParameterSection } from "./ParameterSection";
import { PromptSection } from "./PromptSection";
import { ResultSection } from "./ResultSection";
import { Button } from "../../../components/Button";
import {
    type StrategyConfig,
    type Parameter,
    type BacktestResult,
} from "../../../commons/types";

// 초기 파라미터 데이터
const INITIAL_PARAMETERS: Parameter[] = [
    {
        id: "ma_short",
        category: "Trend",
        label: "단기 이동평균(MA)",
        value: 5,
        unit: "일",
        description: "골든크로스 진입용",
    },
    {
        id: "ma_long",
        category: "Trend",
        label: "장기 이동평균(MA)",
        value: 20,
        unit: "일",
        description: "추세 판단용",
    },
    {
        id: "rsi",
        category: "Oscillator",
        label: "RSI",
        value: 30,
        unit: "이하",
        description: "과매도 구간 매수",
    },
    {
        id: "stop_loss",
        category: "Risk",
        label: "손절",
        value: 3,
        unit: "%",
        description: "리스크 관리",
    },
];

export const MainPage: React.FC = () => {
    // 1. 모든 상태(State)를 관리
    const [period, setPeriod] = useState({ startDate: "", endDate: "" });
    const [market, setMarket] = useState({
        type: "KOSPI",
        sectors: ["반도체"],
    });
    const [parameters, setParameters] =
        useState<Parameter[]>(INITIAL_PARAMETERS);

    // 결과 상태
    const [result, setResult] = useState<BacktestResult | null>(null);
    const [isRunning, setIsRunning] = useState(false); // 백테스팅 로딩 상태

    // 2. AI 요청 핸들러
    const handleGenerateStrategy = async (prompt: string) => {
        try {
            const response = await fetch("http://localhost:3000/api/ai/parse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const data: StrategyConfig = await response.json();

            // 3. 받아온 데이터로 상태 일괄 업데이트
            setPeriod(data.period);
            setMarket({ type: data.market.type, sectors: data.market.sectors });
            setParameters(data.parameters);
            setResult(null); // 전략이 바뀌면 기존 결과 초기화
        } catch (error) {
            console.error("AI 요청 실패:", error);
            alert("서버 연결에 실패했습니다.");
        }
    };

    // ✅ 백테스팅 실행 핸들러 (New!)
    const handleRunBacktest = async () => {
        // 유효성 검사 (파라미터가 없으면 실행 불가)
        if (parameters.length === 0) {
            alert("전략 파라미터가 없습니다. AI로 먼저 생성해주세요.");
            return;
        }

        setIsRunning(true);
        try {
            // 현재 설정된 모든 값을 서버로 전송
            const strategyConfig: StrategyConfig = {
                period,
                market,
                parameters,
            };

            const response = await fetch(
                "http://localhost:3000/api/backtest/run",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(strategyConfig),
                }
            );

            const data: BacktestResult = await response.json();
            setResult(data); // 결과 저장 -> ResultSection이 다시 렌더링됨
        } catch (error) {
            console.error(error);
            alert("백테스팅 실행 실패");
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="h-full flex gap-8">
            {/* 왼쪽 패널 */}
            <div className="w-[420px] flex flex-col gap-6 overflow-y-auto pr-2 pb-10">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-2">
                        <span className="text-xl">⚙️</span>
                        <h2 className="text-xl font-bold text-slate-800">
                            Settings
                        </h2>
                    </div>

                    {/* Props로 상태와 변경함수 전달 */}
                    <PeriodSection data={period} onChange={setPeriod} />
                    <MarketSection data={market} onChange={setMarket} />
                    <ParameterSection
                        data={parameters}
                        onChange={setParameters}
                    />

                    {/* [실행 버튼] 설정이 끝나면 누르는 흐름 */}
                    <Button
                        variant="primary"
                        className="w-full py-4 text-lg shadow-lg bg-indigo-600 hover:bg-indigo-700 border-none"
                        onClick={handleRunBacktest}
                        disabled={isRunning || parameters.length === 0}
                    >
                        {isRunning ? "Running Backtest..." : "🚀 Run Backtest"}
                    </Button>
                </div>

                <div className="flex-1 min-h-[300px]">
                    {/* AI 생성 함수 전달 */}
                    <PromptSection onGenerate={handleGenerateStrategy} />
                </div>
            </div>

            {/* 오른쪽 패널 */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
                {/* 상단 통계 카드 (결과 데이터 연결) */}
                <div className="grid grid-cols-3 gap-6">
                    <StatCard
                        title="Total Return"
                        value={result ? `${result.stats.totalReturn}%` : "-"}
                        color="text-blue-600"
                    />
                    <StatCard
                        title="Win Rate"
                        value={result ? `${result.stats.winRate}%` : "-"}
                        color="text-green-600"
                    />
                    <StatCard
                        title="MDD"
                        value={result ? `${result.stats.mdd}%` : "-"}
                        color="text-red-500"
                    />
                </div>

                <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">📊</span>
                            <h2 className="text-xl font-bold text-slate-800">
                                Backtest Results
                            </h2>
                        </div>
                        <span className="text-sm text-slate-400">
                            {result
                                ? "Analysis Complete"
                                : "Waiting for execution..."}
                        </span>
                    </div>

                    {/* 결과 섹션에 데이터 전달 */}
                    <ResultSection result={result} isLoading={isRunning} />
                </div>
            </div>
        </div>
    );
};

// 통계 카드용 작은 컴포넌트 (내부에서만 사용)
const StatCard = ({
    title,
    value,
    color,
}: {
    title: string;
    value: string;
    color: string;
}) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center h-32">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
            {title}
        </h3>
        <p
            className={`text-3xl font-extrabold ${
                value === "-" ? "text-slate-300" : color
            }`}
        >
            {value}
        </p>
    </div>
);
