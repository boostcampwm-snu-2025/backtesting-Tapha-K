import React, { useState } from "react";
import { PeriodSection } from "./PeriodSection";
import { MarketSection } from "./MarketSection";
import { ParameterSection } from "./ParameterSection";
import { PromptSection } from "./PromptSection";
import { ResultSection } from "./ResultSection";
import { Button } from "../../../components/Button";
import { Modal } from "../../../components/Modal";
import { SaveModal } from "./SaveModal";
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

    // 모달 상태 추가
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // 2. AI 요청 핸들러
    const handleGenerateStrategy = async (prompt: string) => {
        try {
            const response = await fetch("http://localhost:3000/api/ai/parse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            // Partial<StrategyConfig> 타입을 써도 되지만, any로 처리해도 무방합니다.
            const data = await response.json();

            // 데이터가 존재할 때만 업데이트 (기존 값 유지)
            if (data.period) {
                setPeriod(data.period);
            }

            if (data.market) {
                setMarket(data.market);
            }

            // 파라미터는 무조건 교체 (AI가 새로 짠 전략이니까)
            if (data.parameters) {
                const paramsWithUiId = data.parameters.map((p: any) => ({
                    ...p,
                    _ui_id: `ui_${Date.now()}_${Math.random()
                        .toString(36)
                        .substr(2, 9)}`,
                }));
                setParameters(paramsWithUiId);
            }

            setResult(null); // 전략이 바뀌었으니 결과 초기화
        } catch (error) {
            console.error(error);
            alert("AI 서버 연결 실패");
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

    // ✅ 저장 핸들러 (서버로 전송)
    const handleSaveStrategy = async (name: string, description: string) => {
        if (!result) return;

        try {
            const payload = {
                name,
                description,
                config: { period, market, parameters }, // 현재 설정값
                result, // 현재 결과값
            };

            const response = await fetch(
                "http://localhost:3000/api/strategies",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                setIsSaveModalOpen(false); // 모달 닫고
                setIsSuccessModalOpen(true); // 성공 알림 모달 열기
            } else {
                alert("저장에 실패했습니다.");
            }
        } catch (error) {
            console.error(error);
            alert("서버 오류 발생");
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
                    {/* 헤더 부분 수정: 저장 버튼 추가 */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">📊</span>
                            <h2 className="text-xl font-bold text-slate-800">
                                Backtest Results
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-400">
                                {result
                                    ? "Analysis Complete"
                                    : "Waiting for execution..."}
                            </span>

                            {/* ✅ 저장 버튼: 결과가 있을 때만 보임 */}
                            {result && (
                                <Button
                                    variant="secondary"
                                    className="text-xs py-1.5 px-3 border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100"
                                    onClick={() => setIsSaveModalOpen(true)}
                                >
                                    💾 Save Strategy
                                </Button>
                            )}
                        </div>
                    </div>

                    <ResultSection result={result} isLoading={isRunning} />
                </div>
            </div>

            {/* 1. 저장 입력 폼 모달 */}
            <SaveModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onSave={handleSaveStrategy}
            />

            {/* 2. ✅ 성공 알림 모달 (작은 사이즈) */}
            <Modal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="알림"
                size="sm" // 작게 설정
                footer={
                    <Button
                        variant="primary"
                        onClick={() => setIsSuccessModalOpen(false)}
                    >
                        확인
                    </Button>
                }
            >
                <div className="text-center py-4">
                    <div className="text-4xl mb-3">🎉</div>
                    <p className="font-bold text-slate-800 text-lg">
                        저장되었습니다!
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                        'My Strategies' 탭에서 확인하실 수 있습니다.
                    </p>
                </div>
            </Modal>
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
