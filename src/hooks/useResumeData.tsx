import {Balance, CapacityAnalysisResponse, EventsApi, FinanceApi, ProfitReportResponse} from "api";
import { useCachedData } from "./useCachedData";
import {TIMES} from "utils/times.ts";

export const useResumeData = () => {
    const financeApi = new FinanceApi();
    const eventsApi = new EventsApi();
    
    const balanceData = useCachedData<Balance>(
        async () => ({
            currentBalance: (await financeApi.getTotalBalanceFinanceBalanceGet()).currentBalance,
            lastUpdated: new Date(),
        }),
        'balance-cache'
    );
    
    const eventToHappen = useCachedData<CapacityAnalysisResponse>(
        () => eventsApi.getCapacityAnalysisEventsCapacityAnalysisGet(),
        'events-cache',
        TIMES.ONE_MINUTE
    );
    
    const profitData = useCachedData<ProfitReportResponse>(
        () => financeApi.getProfitReportFinanceProfitGet(),
        'profit-cache'
    );
    
    return { balanceData, eventToHappen, profitData };
};
