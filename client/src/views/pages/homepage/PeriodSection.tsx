import React from "react";
import { Button } from "../../../components/Button";
import { CollapsibleCard } from "../../../components/CollapsibleCard";

interface Props {
    data: { startDate: string; endDate: string };
    onChange: (data: { startDate: string; endDate: string }) => void;
}

export const PeriodSection: React.FC<Props> = ({ data, onChange }) => {
    // handlePreset 로직도 여기서 data를 업데이트하는 방식으로 변경
    const handlePreset = (months: number) => {
        const end = new Date();
        const start = new Date();
        start.setMonth(end.getMonth() - months);

        onChange({
            startDate: start.toISOString().split("T")[0],
            endDate: end.toISOString().split("T")[0],
        });
    };

    return (
        <CollapsibleCard title="1. Period (기간)">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={data.startDate}
                        onChange={(e) =>
                            onChange({ ...data, startDate: e.target.value })
                        }
                        className="border border-slate-300 rounded px-3 py-2 w-full text-slate-700 outline-none"
                    />
                    <span className="text-slate-400">~</span>
                    <input
                        type="date"
                        value={data.endDate}
                        onChange={(e) =>
                            onChange({ ...data, endDate: e.target.value })
                        }
                        className="border border-slate-300 rounded px-3 py-2 w-full text-slate-700 outline-none"
                    />
                </div>
                {/* ... 버튼 부분 기존 동일 ... */}
                <div className="grid grid-cols-5 gap-2">
                    {[1, 3, 6, 12, 36].map((m) => (
                        <Button
                            key={m}
                            variant="secondary"
                            className="text-xs py-1.5"
                            onClick={() => handlePreset(m)}
                        >
                            {m >= 12 ? `${m / 12}년` : `${m}개월`}
                        </Button>
                    ))}
                </div>
            </div>
        </CollapsibleCard>
    );
};
