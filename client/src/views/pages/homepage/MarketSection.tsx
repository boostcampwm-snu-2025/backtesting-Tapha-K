import React from "react";
import { CollapsibleCard } from "../../../components/CollapsibleCard";

interface Props {
    data: { type: string; sectors: string[] };
    onChange: (data: { type: string; sectors: string[] }) => void;
}

export const MarketSection: React.FC<Props> = ({ data, onChange }) => {
    const markets = ["KOSPI", "KOSDAQ", "NASDAQ", "Crypto"];

    return (
        <CollapsibleCard title="2. Market & Sector">
            <div className="flex flex-col gap-4">
                <div className="flex gap-2 p-1 bg-slate-200 rounded-lg">
                    {markets.map((m) => (
                        <button
                            key={m}
                            onClick={() => onChange({ ...data, type: m })}
                            className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${
                                data.type === m
                                    ? "bg-white text-blue-700 shadow-sm"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
                {/* 섹터 태그 (data.sectors 표시) */}
                <div>
                    <label className="text-xs font-bold text-slate-500 mb-2 block">
                        Target Sectors
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {data.sectors.map((sector) => (
                            <span
                                key={sector}
                                className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full border border-blue-100"
                            >
                                {sector}
                            </span>
                        ))}
                        {/* 추가/삭제 버튼은 데모에서 생략 */}
                    </div>
                </div>
            </div>
        </CollapsibleCard>
    );
};
