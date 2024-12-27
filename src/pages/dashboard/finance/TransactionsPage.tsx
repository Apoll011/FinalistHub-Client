import React, { useState, useEffect } from 'react';
// @ts-ignore
import {Container, Row, Col, Card, Spinner, Nav, Tab, SelectCallback} from 'react-bootstrap';
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
import {FinanceApi, MonthlyFinancialReport, TransactionResponse, WeeklyFinancialReport} from "api";
import TransactionsList from "components/financial/TransactionsList.tsx";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface DailyTotals {
    [date: string]: {
        revenue: number;
        expenses: number;
    };
}

const apiFunctions = {
    getMonthlyTransactions: async () => await new FinanceApi().getMonthlyTransactionsFinanceTransactionsMonthlyGet(),
    getWeeklyTransactions: async () => await new FinanceApi().getWeeklyTransactionsFinanceTransactionsWeeklyGet()
};

const TransactionsPage = () => {
    const [monthlyData, setMonthlyData] = useState<MonthlyFinancialReport | null>(null);
    const [weeklyData, setWeeklyData] = useState<WeeklyFinancialReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    type TabKey = 'weekly' | 'monthly';
    const [activeView, setActiveView] = useState<TabKey>('weekly');

    const isValidKey = (key: string | null): key is TabKey => {
        return key === 'weekly' || key === 'monthly';
    };

    const handleSelect: SelectCallback = (eventKey: string | null) => {
        if (eventKey && isValidKey(eventKey)) {
            setActiveView(eventKey);
        }
    };



    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [weeklyResponse, monthlyResponse] = await Promise.all([
                apiFunctions.getWeeklyTransactions(),
                apiFunctions.getMonthlyTransactions()
            ]);

            setWeeklyData(weeklyResponse);
            setMonthlyData(monthlyResponse);
        } catch {
            setError('Failed to fetch transaction data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'CVE'
        }).format(value);
    };

    type TransactionChartData = ChartData<'line', number[], string>;

    const getChartData = (transactions: TransactionResponse[]): TransactionChartData | null => {
        if (!transactions) return null;

        const dailyTotals = transactions.reduce<DailyTotals>((acc, transaction) => {
            const date: string = new Date(transaction.createdAt).toISOString();
            if (!acc[date]) {
                acc[date] = { revenue: 0, expenses: 0 };
            }
            if (transaction.type === 'revenue') {
                acc[date].revenue += transaction.amount;
            } else {
                acc[date].expenses += transaction.amount;
            }
            return acc;
        }, {});

        const chartData: TransactionChartData = {
            labels: Object.keys(dailyTotals).map(f => new Date(f).toISOString().split('T')[0]),
            datasets: [
                {
                    label: 'Ganhos',
                    data: Object.values(dailyTotals).map(d => d.revenue),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: 'Gastos',
                    data: Object.values(dailyTotals).map(d => d.expenses),
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                }
            ]
        };

        return chartData;
    };

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
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
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <>
                    <Tab.Container activeKey={activeView} onSelect={handleSelect}>
                        <Row className="mb-4">
                            <Col>
                                <Nav variant="pills">
                                    <Nav.Item>
                                        <Nav.Link eventKey="weekly">Relatório da Semana</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="monthly">Relatório do Mês</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                        </Row>

                        <Tab.Content>
                            <Tab.Pane eventKey="weekly" active={activeView === 'weekly'}>
                                {weeklyData && (
                                    <>
                                        <Row className="mb-4">
                                            <Col md={4}>
                                                <Card className="text-center">
                                                    <Card.Body>
                                                        <Card.Title>Total Ganho</Card.Title>
                                                        <h3 className="text-success">
                                                            {formatCurrency(weeklyData.totalRevenue)}
                                                        </h3>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={4}>
                                                <Card className="text-center">
                                                    <Card.Body>
                                                        <Card.Title>Total Gasto</Card.Title>
                                                        <h3 className="text-danger">
                                                            {formatCurrency(weeklyData.totalExpenses)}
                                                        </h3>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={4}>
                                                <Card className="text-center">
                                                    <Card.Body>
                                                        <Card.Title>Saldo</Card.Title>
                                                        <h3 className={weeklyData.netIncome >= 0 ? 'text-success' : 'text-danger'}>
                                                            {formatCurrency(weeklyData.netIncome)}
                                                        </h3>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row className="mb-4">
                                            <Col>
                                                <Card>
                                                    <Card.Body>
                                                        <Card.Title>Gráfico de Transações</Card.Title>
                                                        <div style={{ height: '300px' }}>
                                                            <Line data={getChartData(weeklyData.transactions) || { labels: [], datasets: [] }} options={chartOptions} />                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <TransactionsList transactions={weeklyData.transactions} />
                                    </>
                                )}
                            </Tab.Pane>

                            <Tab.Pane eventKey="monthly" active={activeView === 'monthly'}>
                                {monthlyData && (
                                    <>
                                        <Row className="mb-4">
                                            <Col md={4}>
                                                <Card className="text-center">
                                                    <Card.Body>
                                                        <Card.Title>Total Ganho</Card.Title>
                                                        <h3 className="text-success">
                                                            {formatCurrency(monthlyData.totalRevenue)}
                                                        </h3>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={4}>
                                                <Card className="text-center">
                                                    <Card.Body>
                                                        <Card.Title>Total Gasto</Card.Title>
                                                        <h3 className="text-danger">
                                                            {formatCurrency(monthlyData.totalExpenses)}
                                                        </h3>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={4}>
                                                <Card className="text-center">
                                                    <Card.Body>
                                                        <Card.Title>Saldo</Card.Title>
                                                        <h3 className={monthlyData.netIncome >= 0 ? 'text-success' : 'text-danger'}>
                                                            {formatCurrency(monthlyData.netIncome)}
                                                        </h3>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row className="mb-4">
                                            <Col>
                                                <Card>
                                                    <Card.Body>
                                                        <Card.Title>Gráfico de Transações</Card.Title>
                                                        <div style={{ height: '300px' }}>
                                                            <Line data={getChartData(monthlyData.transactions) || { labels: [], datasets: [] }} options={chartOptions} />                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <TransactionsList transactions={monthlyData.transactions} />
                                    </>
                                )}
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </>
            )}
        </Container>
    );
};

export default TransactionsPage;