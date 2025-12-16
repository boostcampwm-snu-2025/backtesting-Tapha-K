// src/views/pages/homepage/SaveModal.tsx

import React, { useState } from "react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, description: string) => void;
}

export const SaveModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        if (!name.trim()) {
            // 여기도 alert 대신 입력창 테두리를 붉게 하는 등의 처리가 좋지만 일단 유지
            alert("전략 이름을 입력해주세요.");
            return;
        }
        onSave(name, description);
        setName("");
        setDescription("");
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="💾 전략 저장하기"
            size="md" // 중간 크기
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>
                        취소
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        저장하기
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                        전략 이름
                    </label>
                    <input
                        type="text"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="예: 나만의 골든크로스 전략 v1"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">
                        설명 (선택)
                    </label>
                    <textarea
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                        placeholder="전략에 대한 간단한 메모를 남겨보세요."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>
        </Modal>
    );
};
