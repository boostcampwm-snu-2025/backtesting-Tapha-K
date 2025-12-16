import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./views/layout/Layout";
import { MainPage } from "./views/pages/homepage/MainPage";
import { ArchivePage } from "./views/pages/archivepage/ArchivePage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 모든 경로는 Layout 컴포넌트 감싸짐 */}
                <Route path="/" element={<Layout />}>
                    {/* 기본 경로: 백테스팅 워크스페이스 */}
                    <Route index element={<MainPage />} />

                    {/* 내 전략 페이지 */}
                    <Route path="archive" element={<ArchivePage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
