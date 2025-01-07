import React, {useEffect, useState} from "react";
import {Card, Spinner} from "react-bootstrap";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import {Balance, FinanceApi, RevenueSource, TopRevenueSourcesResponse} from "api";
import {ErrorState, LoadingState, useApiData} from "hooks/useApiData.tsx";
import {formatCurrency} from "utils/currency.ts";
import {useCachedData} from "hooks/useCachedData.ts";
import {TIMES} from "utils/times.ts";

const useTopRevenueSources = (data:  TopRevenueSourcesResponse | null) => {
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

const TopRevenueSourcesChart = () => {
  const data  = useCachedData<TopRevenueSourcesResponse>(
      () => new FinanceApi().getTopRevenueSourcesFinanceTopRevenueSourcesGet({limit: 3}),
      'top-revenue-sources-cache',
      TIMES.NEVER
  );
  
  const { sources, topRevenueChartSeries, topRevenueChartLabels } = useTopRevenueSources(data);
  
  const performanceChartOptions: ApexOptions = {
    dataLabels: { enabled: false },
    labels: topRevenueChartLabels,
    colors: ["#28a745", "#ffc107", "#dc3545"],
    plotOptions: {
      radialBar: {
        startAngle: -160,
        endAngle: -450,
        hollow: {
          size: "55%",
        },
        track: {
          background: "transparent",
        },
        dataLabels: {
          show: false,
        },
      },
    },
    chart: { type: "radialBar" },
    stroke: { lineCap: "round" },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 5000,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
  };
  
  return (
      <Card className="h-100">
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4 className="mb-0">Top 3 Fontes de Rendimento</h4>
            </div>
          </div>
          
          { sources ? (
              <div className="d-flex justify-content-around">
                <div className="mb-3">
                  <Chart
                      options={performanceChartOptions}
                      series={topRevenueChartSeries}
                      type="radialBar"
                      width="100%"
                  />
                </div>
                <div className="align-items-center justify-content-around">
                  {sources.map((source, index) => <div key={source.category}>
                    <h3 className="mt-3 mb-1 fw-bold"><i
                        className={`fe fe-dollar-sign text-${getSourceColor(index)} fs-3`}></i> {formatCurrency(source.totalAmount)} ({source.transactionCount})
                    </h3>
                    <small>{source.category}</small>
                  </div>)}
                </div>
              </div>
          ) : (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary"/>
              </div>
          )}
        </Card.Body>
      </Card>
  );
};

const getSourceColor = (index: number) => {
  const colors = ["success", "warning", "danger"];
  return colors[index % colors.length];
};

export default TopRevenueSourcesChart;
