import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartData
} from 'chart.js';
import {CashflowForecast, FinanceApi} from "api";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const apiFunctions = {
    // To be filled in
    getForecastCashflow: async (days?: number) => await new FinanceApi().forecastCashflowFinanceCashflowForecastGet({ days })
};

const CashflowForecastPage = () => {
    const [forecastData, setForecastData] = useState<CashflowForecast | null>(null);
    const [days, setDays] = useState(30);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchForecast = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiFunctions.getForecastCashflow(days);
            setForecastData(response);
        } catch (err) {
            setError('Failed to fetch forecast data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForecast();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'CVE'
        }).format(value);
    };

    const chartData: ChartData<"line", number[], any> | null = forecastData ? {
        labels: forecastData.dailyForecasts.map(f => new Date(f.date).toISOString()),
        datasets: [
            {
                label: 'Projected Balance',
                data: forecastData.dailyForecasts.map(f => f.projectedBalance),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Projected Revenue',
                data: forecastData.dailyForecasts.map(f => f.projectedRevenue),
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
            },
            {
                label: 'Projected Expenses',
                data: forecastData.dailyForecasts.map(f => f.projectedExpenses),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }
        ]
    } as ChartData<"line", number[], any> : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Cashflow Forecast'
            },
            tooltip: {
                callbacks: {
                    label: function(context: { dataset: { label: string; }; parsed: { y: number | null; }; }) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += formatCurrency(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: function(value: number) {
                        return formatCurrency(value);
                    }
                }
            }
        }
    };

    return (
        <Container fluid className="p-4">
            <Row className="mb-4">
                <Col>
                    <h1 className="mb-4">Cashflow Forecast</h1>
                    <Card>
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Forecast Period (Days)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={days}
                                            onChange={(e) => setDays(parseInt(e.target.value))}
                                            min={1}
                                            max={365}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="text-end">
                                    <Button
                                        variant="primary"
                                        onClick={fetchForecast}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    className="me-2"
                                                />
                                                Loading...
                                            </>
                                        ) : (
                                            'Update Forecast'
                                        )}
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {error && (
                <Row className="mb-4">
                    <Col>
                        <div className="alert alert-danger">{error}</div>
                    </Col>
                </Row>
            )}

            {forecastData && (
                <>
                    <Row className="mb-4">
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Starting Balance</Card.Title>
                                    <h3 className="text-primary">
                                        {formatCurrency(forecastData.startingBalance)}
                                    </h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Forecast Period</Card.Title>
                                    <h3 className="text-primary">
                                        {forecastData.forecastPeriodDays} Days
                                    </h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Projected Final Balance</Card.Title>
                                    <h3 className="text-primary">
                                        {formatCurrency(
                                            forecastData.dailyForecasts[
                                            forecastData.dailyForecasts.length - 1
                                                ].projectedBalance
                                        )}
                                    </h3>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col>
                            <Card>
                                <Card.Body>
                                    <div style={{ height: '400px' }}>
                                        <Line data={chartData as ChartData<"line", number[], any>} options={chartOptions} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Daily Forecast Details</Card.Title>
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Projected Revenue</th>
                                                <th>Projected Expenses</th>
                                                <th>Projected Balance</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {forecastData.dailyForecasts.map((forecast) => (
                                                <tr key={forecast.date.toString()}>
                                                    <td>{new Date(forecast.date).toISOString()}</td>
                                                    <td>{formatCurrency(forecast.projectedRevenue)}</td>
                                                    <td>{formatCurrency(forecast.projectedExpenses)}</td>
                                                    <td>{formatCurrency(forecast.projectedBalance)}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default CashflowForecastPage;