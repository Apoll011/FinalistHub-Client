import {Card, Spinner} from "react-bootstrap";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import {FinanceApi, TopRevenueSourcesResponse} from "api";
import {formatCurrency} from "utils/currency.ts";
import {useCachedData} from "hooks/useCachedData.ts";
import {TIMES} from "utils/times.ts";
import {useTopRevenueSources} from "hooks/useTopRevenueSources.ts";



const TopRevenueSourcesChart = () => {
  const data  = useCachedData<TopRevenueSourcesResponse>(
      () => new FinanceApi().getTopRevenueSourcesFinanceTopRevenueSourcesGet({limit: 3}),
      'top-revenue-sources-cache',
      TIMES.minutes(10)
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
      <Card className="h-100 shadow-sm border-0">
        <Card.Body>
          <div className="d-flex align-items-start justify-content-between mb-3">
            <div>
              <p className="text-uppercase text-muted fw-semibold small mb-1">Receita</p>
              <h4 className="mb-0">Top 3 fontes de rendimento</h4>
            </div>
          </div>
          
          { sources === undefined || sources === null ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary"/>
              </div>
          ) : Array.isArray(sources) && sources.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted mb-0">Nenhuma fonte de rendimento encontrada.</p>
              </div>
          ) : (
              <div className="row g-4 align-items-center">
                <div className="col-lg-6">
                  <Chart
                      options={performanceChartOptions}
                      series={topRevenueChartSeries}
                      type="radialBar"
                      width="100%"
                  />
                </div>
                <div className="col-lg-6">
                  <div className="d-grid gap-3">
                    {sources.map((source, index) => (
                        <div key={source.category} className="p-3 rounded-3 bg-light">
                          <div className="d-flex align-items-center justify-content-between">
                            <div>
                              <div className="fw-semibold">{source.category}</div>
                              <small className="text-muted">{source.transactionCount} transações</small>
                            </div>
                            <div className={`text-${getSourceColor(index)} fw-bold`}>
                              {formatCurrency(source.totalAmount)}
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
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
