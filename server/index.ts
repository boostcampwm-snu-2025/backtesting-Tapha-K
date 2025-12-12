import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors()); // 프론트엔드(5173)와 통신 허용
app.use(express.json());

// ✅ 2단계 핵심: AI 파라미터 파싱 (Mock)
app.post("/api/ai/parse", (req, res) => {
    const { prompt } = req.body;

    console.log(`[Server] AI 요청 받음: "${prompt}"`);

    // 실제로는 여기서 OpenAI API를 호출하겠지만, 지금은 하드코딩된 응답을 보냅니다.
    const mockResponse = {
        period: {
            startDate: "2023-01-01",
            endDate: "2023-12-31",
        },
        market: {
            type: "NASDAQ",
            sectors: ["반도체", "AI", "소프트웨어"],
        },
        parameters: [
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
                value: 60,
                unit: "일",
                description: "추세 판단용 (20->60 변경됨)",
            },
            {
                id: "rsi_buy",
                category: "Oscillator",
                label: "RSI 매수",
                value: 30,
                unit: "이하",
                description: "과매도 구간",
            },
            {
                id: "stop_loss",
                category: "Risk",
                label: "손절",
                value: 3,
                unit: "%",
                description: "타이트한 손절 관리",
            },
        ],
    };

    // 1.5초 딜레이를 줘서 "생성 중..." 느낌 내기
    setTimeout(() => {
        res.json(mockResponse);
    }, 1500);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
