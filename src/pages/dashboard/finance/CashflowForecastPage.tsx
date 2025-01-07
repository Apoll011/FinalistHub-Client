import React, { useState } from 'react';
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
    ChartData,
    ChartOptions
} from 'chart.js';
import {formatCurrency} from "utils/currency.ts";
import {useForecast} from "hooks/useForecast.ts";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const CashflowForecastPage = () => {
    const [days, setDays] = useState(30);
    
    const { forecastData, loading, error, refetch: fetchForecast } = useForecast(days);
    
    const chartData: ChartData<"line", number[], string> | null = forecastData ? {
        labels: forecastData.dailyForecasts.map(f => new Date(f.date).toISOString().split('T')[0]),
        datasets: [
            {
                label: 'Saldo Projetado',
                data: forecastData.dailyForecasts.map(f => f.projectedBalance),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            },
            {
                label: 'Receita Projetada',
                data: forecastData.dailyForecasts.map(f => f.projectedRevenue),
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
            },
            {
                label: 'Despesas Projetadas',
                data: forecastData.dailyForecasts.map(f => f.projectedExpenses),
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }
        ]
    } as ChartData<"line", number[], string> : null;

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Previsão de Fluxo de Caixa'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
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
                    callback: function(value) {
                        return formatCurrency(value as number);
                    }
                }
            }
        }
    };

    return (
        <Container fluid className="p-4">
            <Row className="mb-4">
                <Col>
                    <h1 className="mb-4">Previsão de Fluxo de Caixa</h1>
                    <Card>
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Período de Previsão (Dias)</Form.Label>
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
                                                Carregando...
                                            </>
                                        ) : (
                                            'Atualizar Previsão'
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
            
            {forecastData ? (
                <>
                    <Row className="mb-4">
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Saldo Inicial</Card.Title>
                                    <h3 className="text-primary">
                                        {formatCurrency(forecastData.startingBalance)}
                                    </h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Período de Previsão</Card.Title>
                                    <h3 className="text-primary">
                                        {forecastData.forecastPeriodDays} Dias
                                    </h3>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Saldo Final Projetado</Card.Title>
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
                                    <div style={{height: '400px'}}>
                                        <Line data={chartData as ChartData<"line", number[], string>}
                                              options={chartOptions}/>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Detalhes da Previsão Diário</Card.Title>
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                            <tr>
                                                <th>Data</th>
                                                <th>Ganho Projetada</th>
                                                <th>Gastos Projetados</th>
                                                <th>Saldo Projetado</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {forecastData.dailyForecasts.map((forecast) => (
                                                <tr key={forecast.date.toISOString()}>
                                                    <td>{new Date(forecast.date).toISOString().split('T')[0]}</td>
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
            ) : (
                <div className="text-center py-5">
                <Spinner animation="border" variant="primary"/>
                </div>
                )}
        </Container>
    );
};

export default CashflowForecastPage;