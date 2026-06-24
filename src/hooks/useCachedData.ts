import {useCallback, useEffect, useRef, useState} from "react";

interface CachedData<T> {
    data: T | null;
    lastUpdated: number | null;
}

interface UseCachedDataOptions {
    enabled?: boolean;
    staleTime?: number | null;
    refreshOnFocus?: boolean;
}

const readCache = <T,>(cacheKey: string): CachedData<T> => {
    try {
        const stored = localStorage.getItem(cacheKey);
        if (!stored) {
            return { data: null, lastUpdated: null };
        }

        const parsed = JSON.parse(stored) as { data?: T; lastUpdated?: number | string | Date | null };
        const lastUpdated =
            parsed.lastUpdated === null || parsed.lastUpdated === undefined
                ? null
                : new Date(parsed.lastUpdated).getTime();

        return {
            data: parsed.data ?? null,
            lastUpdated: Number.isFinite(lastUpdated) ? lastUpdated : null,
        };
    } catch {
        return { data: null, lastUpdated: null };
    }
};

const isStale = (lastUpdated: number | null, staleTime: number | null) => {
    if (staleTime === null) {
        return false;
    }

    if (lastUpdated === null) {
        return true;
    }

    return Date.now() - lastUpdated >= staleTime;
};

export function useCachedData<T>(
    fetchFn: () => Promise<T>,
    cacheKey: string,
    interval: number | null = 10000,
    options: UseCachedDataOptions = {}
): T | null {
    const { enabled = true, staleTime = interval, refreshOnFocus = true } = options;
    const [cache, setCache] = useState<CachedData<T>>(() => readCache<T>(cacheKey));
    const cacheRef = useRef(cache);
    const fetchFnRef = useRef(fetchFn);
    const pendingRequestRef = useRef<Promise<T> | null>(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        cacheRef.current = cache;
    }, [cache]);

    useEffect(() => {
        fetchFnRef.current = fetchFn;
    }, [fetchFn]);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const updateCache = useCallback((newData: T) => {
        const newCache = { data: newData, lastUpdated: Date.now() };
        setCache(newCache);
        localStorage.setItem(cacheKey, JSON.stringify(newCache));
    }, [cacheKey]);

    const refresh = useCallback(async (force = false) => {
        if (!enabled) {
            return cacheRef.current.data;
        }

        if (pendingRequestRef.current) {
            return pendingRequestRef.current;
        }

        const storedCache = readCache<T>(cacheKey);
        const cacheToUse = storedCache.data !== null ? storedCache : cacheRef.current;

        if (!force && cacheToUse.data !== null && !isStale(cacheToUse.lastUpdated, staleTime)) {
            if (cacheToUse !== cacheRef.current) {
                setCache(cacheToUse);
            }

            return cacheToUse.data;
        }

        const pendingRequest = fetchFnRef.current()
            .then((newData) => {
                if (mountedRef.current) {
                    updateCache(newData);
                }

                return newData;
            })
            .finally(() => {
                pendingRequestRef.current = null;
            });

        pendingRequestRef.current = pendingRequest;
        return pendingRequest;
    }, [cacheKey, enabled, staleTime, updateCache]);

    useEffect(() => {
        if (!enabled) {
            return;
        }

        const storedCache = readCache<T>(cacheKey);
        setCache(storedCache);
        void refresh();

        if (interval === null) {
            return;
        }

        const intervalId = window.setInterval(() => {
            void refresh();
        }, interval);

        return () => window.clearInterval(intervalId);
    }, [cacheKey, enabled, interval, refresh]);

    useEffect(() => {
        if (!enabled || !refreshOnFocus || interval === null) {
            return;
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                void refresh();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [enabled, interval, refresh, refreshOnFocus]);
    
    return cache.data;
}