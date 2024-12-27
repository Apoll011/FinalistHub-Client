import React, {useEffect, useState} from "react";
import {Alert} from "react-bootstrap";


export const useApiData = <T,>(
    apiCall: () => Promise<T>,
    defaultValue: T
) => {
    const [data, setData] = useState<T>(defaultValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await apiCall();
                console.log(result);
                setData(result);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
                setError(errorMessage);
                console.error(`API Error: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};

export const LoadingState = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
    </div>
);

export const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <Alert variant="destructive">
        {message || 'An error occurred while fetching data. Please try again later.'}
    </Alert>
);
