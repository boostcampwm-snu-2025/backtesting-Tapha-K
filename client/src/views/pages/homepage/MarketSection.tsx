import React from "react";
import { CollapsibleCard } from "../../../components/CollapsibleCard";
import { MARKET_SECTORS } from "../../../assets/staticData.ts"; // 데이터 import

interface Props {
    data: { type: string; sectors: string[] };
    onChange: (data: { type: string; sectors: string[] }) => void;
}

export const MarketSection: React.FC<Props> = ({ data, onChange }) => {
    const markets = Object.keys(MARKET_SECTORS); // ['KOSPI', 'KOSDAQ', ...]

    // 섹터 토글 핸들러
    const toggleSector = (sector: string) => {
        const currentSectors = data.sectors;
        if (currentSectors.includes(sector)) {
            onChange({
                ...data,
                sectors: currentSectors.filter((s) => s !== sector),
            });
        } else {
            onChange({ ...data, sectors: [...currentSectors, sector] });
        }
    };

    // 현재 선택된 시장의 섹터 목록 가져오기
    const availableSectors = MARKET_SECTORS[data.type] || [];

    return (
        <CollapsibleCard title="2. Market & Sector">
            <div className="flex flex-col gap-5">
                {/* 시장 선택 탭 */}
                <div>
                    <label className="text-xs font-bold text-slate-400 mb-2 block uppercase">
                        Target Market
                    </label>
                    <div className="flex gap-2 p-1 bg-slate-200 rounded-lg">
                        {markets.map((m) => (
                            <button
                                key={m}
                                onClick={() =>
                                    onChange({ type: m, sectors: [] })
                                } // 시장 바꾸면 섹터 초기화
                                className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${
                                    data.type === m
                                        ? "bg-white text-blue-700 shadow-sm"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-300/50"
                                }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 섹터 선택 (칩 클라우드) */}
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">
                            Available Sectors ({data.type})
                        </label>
                        <span className="text-xs text-blue-600 font-bold">
                            {data.sectors.length} selected
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto custom-scrollbar p-1">
                        {availableSectors.map((sector) => {
                            const isSelected = data.sectors.includes(sector);
                            return (
                                <button
                                    key={sector}
                                    onClick={() => toggleSector(sector)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${
                                        isSelected
                                            ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
                                            : "bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-500"
                                    }`}
                                >
                                    {sector} {isSelected && "✓"}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </CollapsibleCard>
    );
};
