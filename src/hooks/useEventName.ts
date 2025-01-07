import { useEffect, useState } from "react";
import { EventsApi } from "api";
import {useCachedData} from "hooks/useCachedData.ts";
import {TIMES} from "utils/times.ts";

interface EntityState<T> {
    data: T;
    isLoading: boolean;
    error: Error | null;
}

export const useEventName = (eventId: string | null | undefined) => {
    const cacheKey = `eventName_${eventId}`;
    const fetchEventName = async () => {
        if (!eventId) return 'N/A';
        const response = await new EventsApi().getEventDataEventsEventIdGet({ eventId });
        return response.name || 'N/A';
    };
    
    const cachedData = useCachedData(fetchEventName, cacheKey, TIMES.NEVER);
    
    const [state, setState] = useState<EntityState<string>>({
        data: cachedData || 'N/A',
        isLoading: Boolean(eventId && !cachedData),
        error: null,
    });
    
    useEffect(() => {
        if (!eventId) {
            setState({ data: 'N/A', isLoading: false, error: null });
            return;
        }
        
        if (!cachedData) {
            const fetchEvent = async () => {
                try {
                    const data = await fetchEventName();
                    setState({ data, isLoading: false, error: null });
                } catch (error) {
                    setState({ data: 'N/A', isLoading: false, error: error as Error });
                }
            };
            fetchEvent();
        }
    }, [eventId, cachedData]);
    
    return state;
};
