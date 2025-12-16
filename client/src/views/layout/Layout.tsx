import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

export const Layout: React.FC = () => {
    const location = useLocation();

    const getLinkClass = (path: string) => {
        const baseClass =
            "px-6 py-2.5 font-bold text-lg rounded-lg transition-all duration-200";

        // 활성 상태: 파란색 배경 (유지)
        const activeClass = "bg-blue-600 text-white shadow-md";

        // 비활성 상태: (수정됨) 글자를 진하게, 호버 시 배경을 더 진한 회색으로
        const inactiveClass =
            "text-slate-600 hover:bg-slate-200 hover:text-slate-900";

        return location.pathname === path
            ? `${baseClass} ${activeClass}`
            : `${baseClass} ${inactiveClass}`;
    };

    return (
        // 1. 전체 화면을 감싸는 컨테이너 (화면이 1440px보다 크면 중앙 정렬)
        <div className="min-h-screen flex justify-center bg-[#e5e7eb]">
            {/* 2. 1440px 고정 폭 앱 컨테이너 */}
            <div className="w-[1440px] min-h-screen bg-white shadow-2xl flex flex-col">
                {/* 3. 헤더 */}
                <header className="h-20 border-b border-slate-200 flex items-center justify-between px-10 bg-white z-10">
                    {/* 로고 영역 */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl shadow-lg group-hover:bg-blue-700 transition-colors">
                            📈
                        </div>
                        <span className="text-2xl font-extrabold text-slate-800 tracking-tight">
                            Stock BackTester
                        </span>
                    </Link>

                    {/* 네비게이션 영역 */}
                    <nav className="flex gap-4">
                        <Link to="/" className={getLinkClass("/")}>
                            Workspace
                        </Link>
                        <Link
                            to="/archive"
                            className={getLinkClass("/archive")}
                        >
                            My Strategies
                        </Link>
                    </nav>
                </header>

                {/* 4. 메인 콘텐츠 영역 (배경색을 아주 연한 회색으로 해서 카드와 구분) */}
                <main className="flex-1 bg-slate-50 p-10">
                    <Outlet />
                </main>

                {/* 5. 푸터 */}
                <footer className="h-16 border-t border-slate-200 bg-white flex items-center justify-center text-slate-400 text-sm">
                    © 2025 Stock BackTester. Optimized for Desktop (1440px).
                </footer>
            </div>
        </div>
    );
};
