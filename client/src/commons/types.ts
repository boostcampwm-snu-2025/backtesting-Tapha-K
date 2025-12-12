// 1. 전략 파라미터 (ParameterSection용)
export interface Parameter {
    id: string;
    category: "Trend" | "Oscillator" | "Volatility" | "Volume" | "Risk";
    label: string;
    value: string | number;
    unit?: string;
    description?: string;
}

// 2. 전체 전략 설정 (AI가 응답해줄 덩어리)
export interface StrategyConfig {
    period: {
        startDate: string;
        endDate: string;
    };
    market: {
        type: string;
        sectors: string[];
    };
    parameters: Parameter[];
}
