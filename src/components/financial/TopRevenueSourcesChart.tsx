// @ts-ignore
import React from "react";
import { Card } from "react-bootstrap";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import {FinanceApi} from "api";
import {ErrorState, LoadingState, useApiData} from "components/api_component.tsx";


const TopRevenueSourcesChart = () => {
  const { data, loading, error } = useApiData(
      () => new FinanceApi().getTopRevenueSourcesFinanceTopRevenueSourcesGet({limit: 3}),
      { sources: [] }
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'CVE'
    }).format(amount);
  };


  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  const sources = data.sources;

  const topRevenueChartSeries = sources.map((source: { totalAmount: number; }) => source.totalAmount);
  const topRevenueChartLabels = sources.map((source: { description: string; }) => source.description);

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

  return <Card className="h-100">
    <Card.Body>
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <h4 className="mb-0">Top 3 Fontes de Rendimento</h4>
        </div>
      </div>
      <div className="mb-3">
        <Chart
            options={performanceChartOptions}
            series={topRevenueChartSeries}
            type="radialBar"
            width="100%"
        />
      </div>
      <div className="align-items-center justify-content-around">
        {sources.map((source, index) => <div key={source.description}>
              <h3 className="mt-3 mb-1 fw-bold"><i className={`fe fe-dollar-sign text-${getSourceColor(index)} fs-3`}></i> {formatCurrency(source.totalAmount)}
              </h3>
          <small>{source.description}</small>
        </div>)}
      </div>
    </Card.Body>
  </Card>;
};

// Function to determine color based on source index
const getSourceColor = (index: number) => {
  const colors = ["success", "warning", "danger"];
  return colors[index % colors.length];
};

export default TopRevenueSourcesChart;
