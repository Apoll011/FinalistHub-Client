import { useState, useEffect } from 'react';
import { FinanceApi } from 'api';

interface AccountNamesState {
    accountNames: { [key: string]: string };
    isLoading: boolean;
    error: Error | null;
}

export const useAccountNames = (accountIds: (string | null | undefined)[]) => {
    const [state, setState] = useState<AccountNamesState>({
        accountNames: {},
        isLoading: true,
        error: null
    });
    
    useEffect(() => {
        const fetchAccountNames = async () => {
            try {
                const uniqueIds = Array.from(new Set(accountIds.filter(Boolean)));
                const cachedNames: { [key: string]: string } = {};
                const idsToFetch: string[] = [];
                
                // Check localStorage for cached account names
                uniqueIds.forEach((id) => {
                    if (!id) return;
                    const cached = localStorage.getItem(`accountName_${id}`);
                    if (cached) {
                        cachedNames[id] = cached;
                    } else {
                        idsToFetch.push(id);
                    }
                });
                
                if (idsToFetch.length > 0) {
                    const api = new FinanceApi();
                    const fetchedNames = Object.fromEntries(
                        await Promise.all(
                            idsToFetch.map(async (id) => {
                                try {
                                    const response = await api.getAccountBalanceFinanceAccountsAccountIdBalanceGet({ accountId: id });
                                    const name = response.name || 'Conta Desconhecida';
                                    localStorage.setItem(`accountName_${id}`, name);
                                    return [id, name];
                                } catch (error) {
                                    console.error(`Failed to fetch account name for ID: ${id}`, error);
                                    return [id, 'N/A'];
                                }
                            })
                        )
                    );
                    
                    setState((prev) => ({
                        accountNames: { ...prev.accountNames, ...cachedNames, ...fetchedNames },
                        isLoading: false,
                        error: null
                    }));
                } else {
                    setState({
                        accountNames: cachedNames,
                        isLoading: false,
                        error: null
                    });
                }
            } catch (error) {
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: error as Error
                }));
            }
        };
        
        if (accountIds.some(Boolean)) {
            fetchAccountNames();
        } else {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, []);
    
    const getAccountName = (id: string | null | undefined) => {
        if (!id) return 'Conta Desconhecida';
        return state.accountNames[id] || 'N/A';
    };
    
    return {
        accountNames: state.accountNames,
        isLoading: state.isLoading,
        error: state.error,
        getAccountName
    };
};
