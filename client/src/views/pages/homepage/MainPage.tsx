import React, { useState } from "react";
import { PeriodSection } from "./PeriodSection";
import { MarketSection } from "./MarketSection";
import { ParameterSection } from "./ParameterSection";
import { PromptSection } from "./PromptSection";
import { ResultSection } from "./ResultSection";
import { type StrategyConfig, type Parameter } from "../../../commons/types";

export const MainPage: React.FC = () => {
    // 1. 모든 상태(State)를 여기서 관리합니다.
    const [period, setPeriod] = useState({ startDate: "", endDate: "" });
    const [market, setMarket] = useState({
        type: "KOSPI",
        sectors: ["반도체"],
    });
    const [parameters, setParameters] = useState<Parameter[]>([]); // 초기엔 비어있음

    // 2. AI 요청 핸들러
    const handleGenerateStrategy = async (prompt: string) => {
        try {
            const response = await fetch("http://localhost:3000/api/ai/parse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            const data: StrategyConfig = await response.json();

            // 3. 받아온 데이터로 상태 일괄 업데이트 -> 화면이 싹 바뀜!
            setPeriod(data.period);
            setMarket({ type: data.market.type, sectors: data.market.sectors });
            setParameters(data.parameters);
        } catch (error) {
            console.error("AI 요청 실패:", error);
            alert("서버 연결에 실패했습니다.");
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
                </div>

                <div className="flex-1 min-h-[300px]">
                    {/* AI 생성 함수 전달 */}
                    <PromptSection onGenerate={handleGenerateStrategy} />
                </div>
            </div>

            {/* 오른쪽 패널 (동일) */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
                {/* ... (기존 ResultSection 관련 코드 유지) ... */}
                {/* 생략: 위에서 작성했던 ResultSection 및 통계 카드 코드 그대로 사용 */}
                <div className="flex-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col min-h-[500px]">
                    <ResultSection />
                </div>
            </div>
        </div>
    );
};
