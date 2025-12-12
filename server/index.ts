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

// ✅ 3단계: 백테스팅 실행 API (Mock)
app.post("/api/backtest/run", (req, res) => {
    const strategy = req.body;

    console.log(`[Server] 백테스팅 시작... 전략:`, strategy.market.type);

    // 더미 결과 데이터 생성
    const mockResult = {
        stats: {
            totalReturn: 15.4, // 수익률
            winRate: 65.2, // 승률
            mdd: -12.5, // 최대 낙폭
        },
        // 차트용 시계열 데이터 (간단하게 10개만)
        chartData: [
            { date: "2023-01", value: 100 },
            { date: "2023-02", value: 102 },
            { date: "2023-03", value: 98 },
            { date: "2023-04", value: 105 },
            { date: "2023-05", value: 108 },
            { date: "2023-06", value: 115 },
            { date: "2023-07", value: 112 },
            { date: "2023-08", value: 120 },
            { date: "2023-09", value: 125 },
            { date: "2023-10", value: 130 },
        ],
    };

    // 2초 딜레이 (계산하는 척)
    setTimeout(() => {
        res.json(mockResult);
    }, 2000);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
