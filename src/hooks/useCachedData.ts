import {useEffect, useState} from "react";

interface CachedData<T> {
    data: T | null;
    lastUpdated: Date | null;
}

export function useCachedData<T>(
    fetchFn: () => Promise<T>,
    cacheKey: string,
    interval: number = 10000
): T | null {
    const [cache, setCache] = useState<CachedData<T>>(() => {
        const stored = localStorage.getItem(cacheKey);
        return stored ? JSON.parse(stored) : { data: null, lastUpdated: null };
    });
    
    const updateCache = (newData: T) => {
        const newCache = { data: newData, lastUpdated: new Date() };
        setCache(newCache);
        localStorage.setItem(cacheKey, JSON.stringify(newCache));
    };
    
    useEffect(() => {
        fetchFn().then(updateCache);
        const intervalId = setInterval(() => fetchFn().then(updateCache), interval);
        return () => clearInterval(intervalId);
    }, [interval, cacheKey]);
    
    return cache.data;
}