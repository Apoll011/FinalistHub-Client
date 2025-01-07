import {RevenueSource, TopRevenueSourcesResponse} from "api";
import {useEffect, useState} from "react";

export const useTopRevenueSources = (data:  TopRevenueSourcesResponse | null) => {
    const [sources, setSources] = useState<RevenueSource[] | null>(null);
    const [topRevenueChartSeries, setTopRevenueChartSeries] = useState<number[]>([]);
    const [topRevenueChartLabels, setTopRevenueChartLabels] = useState<string[]>([]);
    
    useEffect(() => {
        if (data) {
            setSources(data.sources);
            setTopRevenueChartSeries(data.sources.map((source) => source.totalAmount));
            setTopRevenueChartLabels(data.sources.map((source) => source.category));
        }
    }, [data]);
    
    return { sources, topRevenueChartSeries, topRevenueChartLabels };
}