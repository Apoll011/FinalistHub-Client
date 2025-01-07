import { useEffect, useState } from "react";
import { AuthApi } from "api";
import {useCachedData} from "hooks/useCachedData.ts";
import {TIMES} from "utils/times.ts";

interface UserState<T> {
    data: T;
    isLoading: boolean;
    error: Error | null;
}

export const useUserName = (userId: string | null | undefined) => {
    const cacheKey = `userName_${userId}`;
    const fetchUserName = async () => {
        if (!userId) return 'N/A';
        const response = await new AuthApi().getNameAuthNameGet({ userId });
        return response || 'N/A';
    };
    
    const cachedUserName = useCachedData(fetchUserName, cacheKey, TIMES.NEVER);
    
    const [state, setState] = useState<UserState<string>>({
        data: cachedUserName || 'N/A',
        isLoading: Boolean(userId && !cachedUserName),
        error: null,
    });
    
    useEffect(() => {
        if (!userId) {
            setState({ data: 'N/A', isLoading: false, error: null });
            return;
        }
        
        if (!cachedUserName) {
            const fetchData = async () => {
                try {
                    const response = await fetchUserName();
                    setState({ data: response, isLoading: false, error: null });
                } catch (error) {
                    setState({ data: 'N/A', isLoading: false, error: error as Error });
                }
            };
            fetchData();
        } else {
            setState({ data: cachedUserName, isLoading: false, error: null });
        }
    }, [userId, cachedUserName]);
    
    return state;
};