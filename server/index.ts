import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import {
    ANALYSIS_SYSTEM_PROMPT,
    generateAnalysisPrompt,
    PARSING_SYSTEM_PROMPT,
} from "./data/prompts";
import { MOCK_DATA } from "./data/mockData";

dotenv.config();

const app = express();
const PORT = 3000;

// AI가 이 구조를 절대 벗어나지 않게 강제
const strategySchema = {
    description: "Trading strategy configuration",
    type: SchemaType.OBJECT,
    properties: {
        period: {
            type: SchemaType.OBJECT,
            properties: {
                startDate: {
                    type: SchemaType.STRING,
                    description: "YYYY-MM-DD",
                },
                endDate: { type: SchemaType.STRING, description: "YYYY-MM-DD" },
            },
            required: ["startDate", "endDate"],
        },
        market: {
            type: SchemaType.OBJECT,
            properties: {
                type: {
                    type: SchemaType.STRING,
                    description: "KOSPI, KOSDAQ, NASDAQ, Crypto",
                },
                sectors: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.STRING,
                        description:
                            "Must match exact strings from the valid sector list (e.g. '반도체', 'IT')",
                    },
                },
            },
            required: ["type", "sectors"],
        },
        parameters: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    id: {
                        type: SchemaType.STRING,
                        description:
                            "CRITICAL: Must be one of the pre-defined IDs (e.g., 'rsi_buy', 'ma_20') if applicable.",
                    },
                    category: {
                        type: SchemaType.STRING,
                        description:
                            "Trend, Oscillator, Volatility, Volume, Risk",
                    },
                    label: { type: SchemaType.STRING },
                    value: { type: SchemaType.NUMBER },
                    unit: { type: SchemaType.STRING },
                    description: { type: SchemaType.STRING },
                },
                required: ["id", "category", "label", "value"],
            },
        },
    },
    required: ["parameters"],
} as const;

// Gemini 설정 (Schema 적용)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
// [파싱용] JSON 모드 모델
const parsingModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: strategySchema as any,
    },
});

// [분석용] 일반 텍스트 모델
const analysisModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
});

app.use(cors());
app.use(express.json());

// 0. 전략 저장소 (기존 유지)
let savedStrategies: any[] = [];

// ✅ [API] 파라미터 파싱 (Schema 모드)
app.post("/api/ai/parse", async (req, res) => {
    const { prompt } = req.body;
    console.log(`[Server] AI 파라미터 생성 요청: "${prompt}"`);

    try {
        // 1) 시스템 프롬프트 + 사용자 입력
        const finalPrompt = `${PARSING_SYSTEM_PROMPT}\n\nUser Input: "${prompt}"`;

        // 2) Gemini 호출 (이제 Schema에 맞춰서 JSON을 줍니다)
        const result = await parsingModel.generateContent(finalPrompt);
        const responseText = result.response.text();

        console.log("[Server] Gemini 응답 완료");

        // 3) JSON 파싱
        const parsedData = JSON.parse(responseText);
        res.json(parsedData);
    } catch (error) {
        console.error("Gemini Parsing Error:", error);
        // 에러 시 Fallback
        res.json(MOCK_DATA[0].config);
    }
});

// ✅ 2. [Random Mock] 백테스팅 실행 API
app.post("/api/backtest/run", (req, res) => {
    console.log(`[Server] 백테스팅 실행 요청...`);

    // 기존에는 파라미터로 매칭했지만, 이제는 5개 중 하나 랜덤 반환
    const randomIndex = Math.floor(Math.random() * MOCK_DATA.length);
    const randomResult = MOCK_DATA[randomIndex].result;

    console.log(`[Server] 결과 반환 (Random Index: ${randomIndex})`);

    // 1.5초 딜레이 (계산하는 척)
    setTimeout(() => {
        res.json(randomResult);
    }, 1500);
});

// ✅ 3. AI 분석 API (New! 프론트 모달에서 호출용)
app.post("/api/ai/analyze", async (req, res) => {
    try {
        // 클라이언트가 전략 설정(config)과 결과(result)를 모두 보내줘야 함
        const { config, result } = req.body;

        console.log(
            `[Server] Gemini 분석 요청 시작... (${config.period.startDate} ~ ${config.period.endDate})`
        );

        // 1. 시스템 프롬프트 + 사용자 데이터 결합
        const userPrompt = generateAnalysisPrompt(config, result);
        const finalPrompt = `${ANALYSIS_SYSTEM_PROMPT}\n\n${userPrompt}`;

        // 2. Gemini 호출
        const aiResult = await analysisModel.generateContent(finalPrompt);
        const response = await aiResult.response;
        const text = response.text();

        console.log(`[Server] 분석 완료!`);

        // 3. 결과 반환
        res.json({ analysis: text });
    } catch (error) {
        console.error("Gemini API Error:", error);

        // 에러 발생 시 Fallback (기존 Mock 데이터 활용)
        console.log("[Server] API 호출 실패로 Mock 데이터 반환");
        res.json({
            analysis:
                "⚠️ **AI 분석 서버 연결 지연**\n\n현재 사용량이 많아 실시간 분석이 어렵습니다. 잠시 후 다시 시도해주세요.\n(API Key 설정을 확인해주세요.)",
        });
    }
});

// 전략 저장
app.post("/api/strategies", (req, res) => {
    const { name, description, config, result } = req.body;
    const newStrategy = {
        id: Date.now().toString(),
        name,
        description,
        config,
        result,
        createdAt: new Date().toISOString(),
    };
    savedStrategies.push(newStrategy);
    res.json({ success: true, strategy: newStrategy });
});

// 전략 목록 조회
app.get("/api/strategies", (req, res) => {
    res.json(savedStrategies);
});

// 전략 삭제
app.delete("/api/strategies/:id", (req, res) => {
    const { id } = req.params;
    savedStrategies = savedStrategies.filter((s) => s.id !== id);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
