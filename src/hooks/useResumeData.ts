import {Balance, CapacityAnalysisResponse, EventsApi, FinanceApi, ProfitReportResponse} from "api";
import { useCachedData } from "./useCachedData";
import {TIMES} from "utils/times.ts";

export const useResumeData = (enabled = true) => {
    const financeApi = new FinanceApi();
    const eventsApi = new EventsApi();
    
    const balanceData = useCachedData<Balance>(
        async () => ({
            currentBalance: (await financeApi.getTotalBalanceFinanceBalanceGet()).currentBalance,
            lastUpdated: new Date(),
        }),
        'balance-cache',
        TIMES.minutes(5),
        { enabled }
    );
    
    const eventToHappen = useCachedData<CapacityAnalysisResponse>(
        () => eventsApi.getCapacityAnalysisEventsCapacityAnalysisGet(),
        'events-cache',
        TIMES.minutes(5),
        { enabled }
    );
    
    const profitData = useCachedData<ProfitReportResponse>(
        () => financeApi.getProfitReportFinanceProfitGet(),
        'profit-cache'
        , TIMES.minutes(5),
        { enabled }
    );
    
    return { balanceData, eventToHappen, profitData };
};
