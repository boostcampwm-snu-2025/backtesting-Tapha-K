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

// 3. 백테스팅 결과 데이터
export interface BacktestResult {
    stats: {
        totalReturn: number;
        winRate: number;
        mdd: number;
    };
    chartData: { date: string; value: number }[];
}

// 4. 저장된 전략 데이터 구조
export interface SavedStrategy {
    id: string;
    name: string;
    description: string;
    config: StrategyConfig;
    result: BacktestResult;
    createdAt: string;
}
