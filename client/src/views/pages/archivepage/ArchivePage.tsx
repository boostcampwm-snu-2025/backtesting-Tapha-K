// client/src/views/pages/archivepage/ArchivePage.tsx

import React, { useEffect, useState } from "react";
import { type SavedStrategy } from "../../../commons/types";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button"; // 버튼 import 확인
import { Modal } from "../../../components/Modal"; // 공통 모달 import
import { StrategyDetailModal } from "./StrategyDetailModal";

export const ArchivePage: React.FC = () => {
    const [strategies, setStrategies] = useState<SavedStrategy[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 모달 상태 관리
    const [selectedStrategy, setSelectedStrategy] =
        useState<SavedStrategy | null>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null); // 삭제할 전략 ID

    // 데이터 불러오기 (기존 동일)
    useEffect(() => {
        const fetchStrategies = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/strategies"
                );
                const data = await response.json();
                setStrategies(data);
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStrategies();
    }, []);

    // 삭제 핸들러 (서버 요청)
    const handleDeleteConfirm = async () => {
        if (!deleteTargetId) return;

        try {
            const response = await fetch(
                `http://localhost:3000/api/strategies/${deleteTargetId}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                // UI에서도 즉시 제거 (새로고침 없이 반영)
                setStrategies((prev) =>
                    prev.filter((s) => s.id !== deleteTargetId)
                );
                setDeleteTargetId(null); // 모달 닫기
            } else {
                alert("삭제 실패");
            }
        } catch (error) {
            console.error(error);
            alert("서버 오류");
        }
    };

    const formatDate = (isoString: string) => {
        /* 기존 동일 */
        return new Date(isoString).toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-6 pb-20">
            {/* 헤더 부분 (기존 동일) */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        📂 My Strategies
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        저장된 전략 리스트
                    </p>
                </div>
                <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {strategies.length}
                </span>
            </div>

            {isLoading && (
                <div className="text-center py-20 text-slate-400">
                    Loading...
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                {strategies.map((strategy) => (
                    <Card
                        key={strategy.id}
                        onClick={() => setSelectedStrategy(strategy)}
                        className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-l-4 border-l-indigo-500 group relative" // relative 추가
                    >
                        {/* ✅ 삭제 버튼 (우측 상단) */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // 카드 클릭 이벤트(상세 모달) 방지!
                                setDeleteTargetId(strategy.id);
                            }}
                            className="absolute top-3 right-3 text-slate-300 hover:text-red-500 hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
                            title="삭제하기"
                        >
                            🗑️
                        </button>

                        {/* 카드 내용 (기존 동일) */}
                        <div className="flex flex-col gap-1 mb-3">
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded w-fit">
                                Created: {formatDate(strategy.createdAt)}
                            </span>
                            {/* 기간 표시 추가 */}
                            <span className="text-[10px] text-slate-500 ml-1">
                                📅 {strategy.config.period.startDate} ~{" "}
                                {strategy.config.period.endDate}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-1 group-hover:text-indigo-700 transition-colors pr-8">
                            {strategy.name}
                        </h3>

                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                            <div className="text-center">
                                <span className="text-[10px] text-slate-400 block">
                                    수익률
                                </span>
                                <span
                                    className={`font-bold ${
                                        strategy.result.stats.totalReturn >= 0
                                            ? "text-red-500"
                                            : "text-blue-500"
                                    }`}
                                >
                                    {strategy.result.stats.totalReturn}%
                                </span>
                            </div>
                            <div className="w-[1px] h-6 bg-slate-200"></div>
                            <div className="text-center">
                                <span className="text-[10px] text-slate-400 block">
                                    승률
                                </span>
                                <span className="font-bold text-slate-700">
                                    {strategy.result.stats.winRate}%
                                </span>
                            </div>
                            <div className="w-[1px] h-6 bg-slate-200"></div>
                            <div className="text-center">
                                <span className="text-[10px] text-slate-400 block">
                                    MDD
                                </span>
                                <span className="font-bold text-slate-600">
                                    {strategy.result.stats.mdd}%
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* 1. 상세 모달 (기존 동일) */}
            <StrategyDetailModal
                strategy={selectedStrategy}
                isOpen={!!selectedStrategy}
                onClose={() => setSelectedStrategy(null)}
            />

            {/* 2. ✅ 삭제 확인 모달 (재사용 Modal 컴포넌트 활용) */}
            <Modal
                isOpen={!!deleteTargetId}
                onClose={() => setDeleteTargetId(null)}
                title="전략 삭제"
                size="sm"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteTargetId(null)}
                        >
                            취소
                        </Button>
                        <Button variant="danger" onClick={handleDeleteConfirm}>
                            삭제
                        </Button>
                    </>
                }
            >
                <div className="text-center py-2">
                    <p className="text-slate-700">
                        정말 이 전략을 삭제하시겠습니까?
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                        삭제된 데이터는 복구할 수 없습니다.
                    </p>
                </div>
            </Modal>
        </div>
    );
};
