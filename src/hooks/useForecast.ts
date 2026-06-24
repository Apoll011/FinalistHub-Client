import {useCallback, useEffect, useState} from "react";
import {CashflowForecast, FinanceApi} from "api";

export function useForecast(days: number) {
    const [forecastData, setForecastData] = useState<CashflowForecast | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const fetchForecast = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await new FinanceApi().forecastCashflowFinanceCashflowForecastGet({ days });
            setForecastData(response);
        } catch {
            setError('Failed to fetch forecast data');
        } finally {
            setLoading(false);
        }
    }, [days]);
    
    useEffect(() => {
        void fetchForecast();
    }, [fetchForecast]);
    
    return { forecastData, loading, error, refetch: fetchForecast };
    
}
