import {Balance, CapacityAnalysisResponse, EventsApi, FinanceApi, ProfitReportResponse} from "api";
import { useCachedData } from "./useCachedData";

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
        'events-cache'
    ) ?? { capacityAnalysis: [] };
    
    const profitData = useCachedData<ProfitReportResponse>(
        () => financeApi.getProfitReportFinanceProfitGet(),
        'profit-cache'
    );
    
    return { balanceData, eventToHappen, profitData };
};
