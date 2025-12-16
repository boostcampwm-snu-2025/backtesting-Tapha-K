export interface MockScenario {
    id: string;
    // keywords, analysis 제거됨 (AI가 대체함)

    // config: 파싱 실패 시 Fallback 용도로 구조 유지 (첫 번째 항목만 주로 사용됨)
    config: {
        period: { startDate: string; endDate: string };
        market: { type: string; sectors: string[] };
        parameters: any[];
    };

    // result: 백테스팅 랜덤 반환용 (핵심 데이터)
    result: {
        stats: { totalReturn: number; winRate: number; mdd: number };
        chartData: { date: string; value: number }[];
    };
}

export const MOCK_DATA: MockScenario[] = [
    // 1. [상승장] 골든크로스 정석 (우상향)
    {
        id: "scenario_1",
        config: {
            period: { startDate: "2023-01-01", endDate: "2023-12-31" },
            market: { type: "KOSPI", sectors: ["반도체"] },
            parameters: [],
        },
        result: {
            stats: { totalReturn: 15.4, winRate: 65.2, mdd: -12.5 },
            chartData: [
                { date: "01-01", value: 100 },
                { date: "02-01", value: 102 },
                { date: "03-01", value: 98 },
                { date: "04-01", value: 105 },
                { date: "05-01", value: 108 },
                { date: "06-01", value: 115 },
                { date: "07-01", value: 112 },
                { date: "08-01", value: 120 },
                { date: "09-01", value: 125 },
                { date: "10-01", value: 115 },
                { date: "11-01", value: 122 },
                { date: "12-01", value: 130 },
            ],
        },
    },

    // 2. [횡보장] 박스권 매매 (지루한 흐름)
    {
        id: "scenario_2",
        config: {
            period: { startDate: "", endDate: "" },
            market: { type: "", sectors: [] },
            parameters: [],
        },
        result: {
            stats: { totalReturn: 3.2, winRate: 51.5, mdd: -5.4 },
            chartData: [
                { date: "01-01", value: 100 },
                { date: "02-01", value: 104 },
                { date: "03-01", value: 101 },
                { date: "04-01", value: 103 },
                { date: "05-01", value: 99 },
                { date: "06-01", value: 102 },
                { date: "07-01", value: 105 },
                { date: "08-01", value: 101 },
                { date: "09-01", value: 103 },
                { date: "10-01", value: 100 },
                { date: "11-01", value: 104 },
                { date: "12-01", value: 103 },
            ],
        },
    },

    // 3. [급등주] 변동성 폭발 (코인 스타일)
    {
        id: "scenario_3",
        config: {
            period: { startDate: "", endDate: "" },
            market: { type: "", sectors: [] },
            parameters: [],
        },
        result: {
            stats: { totalReturn: 45.3, winRate: 42.1, mdd: -25.8 },
            chartData: [
                { date: "01-01", value: 100 },
                { date: "02-01", value: 95 },
                { date: "03-01", value: 90 },
                { date: "04-01", value: 110 },
                { date: "05-01", value: 140 },
                { date: "06-01", value: 130 },
                { date: "07-01", value: 160 },
                { date: "08-01", value: 120 },
                { date: "09-01", value: 145 },
                { date: "10-01", value: 135 },
                { date: "11-01", value: 150 },
                { date: "12-01", value: 180 },
            ],
        },
    },

    // 4. [하락장] 손절 실패 (우하향)
    {
        id: "scenario_4",
        config: {
            period: { startDate: "", endDate: "" },
            market: { type: "", sectors: [] },
            parameters: [],
        },
        result: {
            stats: { totalReturn: -22.1, winRate: 35.0, mdd: -30.2 },
            chartData: [
                { date: "01-01", value: 100 },
                { date: "02-01", value: 95 },
                { date: "03-01", value: 90 },
                { date: "04-01", value: 85 },
                { date: "05-01", value: 88 },
                { date: "06-01", value: 80 },
                { date: "07-01", value: 75 },
                { date: "08-01", value: 70 },
                { date: "09-01", value: 72 },
                { date: "10-01", value: 68 },
                { date: "11-01", value: 65 },
                { date: "12-01", value: 60 },
            ],
        },
    },

    // 5. [단타] 짧은 수익 누적 (계단식 상승)
    {
        id: "scenario_5",
        config: {
            period: { startDate: "", endDate: "" },
            market: { type: "", sectors: [] },
            parameters: [],
        },
        result: {
            stats: { totalReturn: 8.4, winRate: 71.0, mdd: -2.1 },
            chartData: [
                { date: "01-01", value: 100 },
                { date: "02-01", value: 101 },
                { date: "03-01", value: 101 },
                { date: "04-01", value: 102 },
                { date: "05-01", value: 102 },
                { date: "06-01", value: 103 },
                { date: "07-01", value: 104 },
                { date: "08-01", value: 104 },
                { date: "09-01", value: 105 },
                { date: "10-01", value: 106 },
                { date: "11-01", value: 106 },
                { date: "12-01", value: 108 },
            ],
        },
    },

    // 6. [V자 반등] 급락 후 회복 (롤러코스터)
    {
        id: "scenario_6",
        config: {
            period: { startDate: "", endDate: "" },
            market: { type: "", sectors: [] },
            parameters: [],
        },
        result: {
            stats: { totalReturn: 5.5, winRate: 48.0, mdd: -18.5 },
            chartData: [
                { date: "01-01", value: 100 },
                { date: "02-01", value: 90 },
                { date: "03-01", value: 85 },
                { date: "04-01", value: 82 },
                { date: "05-01", value: 88 },
                { date: "06-01", value: 95 },
                { date: "07-01", value: 100 },
                { date: "08-01", value: 105 },
                { date: "09-01", value: 102 },
                { date: "10-01", value: 108 },
                { date: "11-01", value: 110 },
                { date: "12-01", value: 105 },
            ],
        },
    },

    // 7. [대박 후 쪽박] 펌프 앤 덤프 (산 모양)
    {
        id: "scenario_7",
        config: {
            period: { startDate: "", endDate: "" },
            market: { type: "", sectors: [] },
            parameters: [],
        },
        result: {
            stats: { totalReturn: -5.0, winRate: 40.0, mdd: -40.0 },
            chartData: [
                { date: "01-01", value: 100 },
                { date: "02-01", value: 110 },
                { date: "03-01", value: 130 },
                { date: "04-01", value: 150 },
                { date: "05-01", value: 140 },
                { date: "06-01", value: 120 },
                { date: "07-01", value: 100 },
                { date: "08-01", value: 90 },
                { date: "09-01", value: 85 },
                { date: "10-01", value: 90 },
                { date: "11-01", value: 92 },
                { date: "12-01", value: 95 },
            ],
        },
    },

    // 8. [초고속 성장] AI 버블 (J커브)
    {
        id: "scenario_8",
        config: {
            period: { startDate: "", endDate: "" },
            market: { type: "", sectors: [] },
            parameters: [],
        },
        result: {
            stats: { totalReturn: 88.2, winRate: 60.5, mdd: -15.0 },
            chartData: [
                { date: "01-01", value: 100 },
                { date: "02-01", value: 105 },
                { date: "03-01", value: 110 },
                { date: "04-01", value: 115 },
                { date: "05-01", value: 125 },
                { date: "06-01", value: 140 },
                { date: "07-01", value: 160 },
                { date: "08-01", value: 190 },
                { date: "09-01", value: 180 },
                { date: "10-01", value: 200 },
                { date: "11-01", value: 210 },
                { date: "12-01", value: 230 },
            ],
        },
    },

    // 9. [배당주] 저변동성 (거북이)
    {
        id: "scenario_9",
        config: {
            period: { startDate: "", endDate: "" },
            market: { type: "", sectors: [] },
            parameters: [],
        },
        result: {
            stats: { totalReturn: 6.5, winRate: 90.0, mdd: -1.5 },
            chartData: [
                { date: "01-01", value: 100 },
                { date: "02-01", value: 100.5 },
                { date: "03-01", value: 101 },
                { date: "04-01", value: 101.5 },
                { date: "05-01", value: 102 },
                { date: "06-01", value: 102.5 },
                { date: "07-01", value: 103 },
                { date: "08-01", value: 103.5 },
                { date: "09-01", value: 104 },
                { date: "10-01", value: 105 },
                { date: "11-01", value: 105.5 },
                { date: "12-01", value: 106.5 },
            ],
        },
    },

    // 10. [복구 불능] 끝없는 추락 (L자형)
    {
        id: "scenario_10",
        config: {
            period: { startDate: "", endDate: "" },
            market: { type: "", sectors: [] },
            parameters: [],
        },
        result: {
            stats: { totalReturn: -55.0, winRate: 20.0, mdd: -60.0 },
            chartData: [
                { date: "01-01", value: 100 },
                { date: "02-01", value: 80 },
                { date: "03-01", value: 70 },
                { date: "04-01", value: 60 },
                { date: "05-01", value: 50 },
                { date: "06-01", value: 45 },
                { date: "07-01", value: 45 },
                { date: "08-01", value: 44 },
                { date: "09-01", value: 46 },
                { date: "10-01", value: 45 },
                { date: "11-01", value: 43 },
                { date: "12-01", value: 45 },
            ],
        },
    },
];
