import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Nav, Tab } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
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

const apiFunctions = {
    getMonthlyTransactions: async () => await new FinanceApi().getMonthlyTransactionsFinanceTransactionsMonthlyGet(),
    getWeeklyTransactions: async () => await new FinanceApi().getWeeklyTransactionsFinanceTransactionsWeeklyGet()
};

const TransactionsPage = () => {
    const [monthlyData, setMonthlyData] = useState<MonthlyFinancialReport | null>(null);
    const [weeklyData, setWeeklyData] = useState<WeeklyFinancialReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeView, setActiveView] = useState('weekly');

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
        } catch (err) {
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

    const getChartData = (transactions:  TransactionResponse[]) => {
        if (!transactions) return null;

        const dailyTotals = transactions.reduce((acc, transaction) => {
            const date =  new Date(transaction.createdAt).toISOString();
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

        return {
            labels: Object.keys(dailyTotals),
            datasets: [
                {
                    label: 'Revenue',
                    data: Object.values(dailyTotals).map(d => d.revenue),
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: 'Expenses',
                    data: Object.values(dailyTotals).map(d => d.expenses),
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                }
            ]
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
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
                        return formatCurrency(value);
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
                    <Tab.Container activeKey={activeView} onSelect={setActiveView}>
                        <Row className="mb-4">
                            <Col>
                                <Nav variant="pills">
                                    <Nav.Item>
                                        <Nav.Link eventKey="weekly">Weekly Report</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="monthly">Monthly Report</Nav.Link>
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
                                                        <Card.Title>Total Revenue</Card.Title>
                                                        <h3 className="text-success">
                                                            {formatCurrency(weeklyData.totalRevenue)}
                                                        </h3>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={4}>
                                                <Card className="text-center">
                                                    <Card.Body>
                                                        <Card.Title>Total Expenses</Card.Title>
                                                        <h3 className="text-danger">
                                                            {formatCurrency(weeklyData.totalExpenses)}
                                                        </h3>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={4}>
                                                <Card className="text-center">
                                                    <Card.Body>
                                                        <Card.Title>Net Income</Card.Title>
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
                                                        <Card.Title>Weekly Transactions Trend</Card.Title>
                                                        <div style={{ height: '300px' }}>
                                                            <Line data={getChartData(weeklyData.transactions)} options={chartOptions} />
                                                        </div>
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
                                                        <Card.Title>Total Revenue</Card.Title>
                                                        <h3 className="text-success">
                                                            {formatCurrency(monthlyData.totalRevenue)}
                                                        </h3>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={4}>
                                                <Card className="text-center">
                                                    <Card.Body>
                                                        <Card.Title>Total Expenses</Card.Title>
                                                        <h3 className="text-danger">
                                                            {formatCurrency(monthlyData.totalExpenses)}
                                                        </h3>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col md={4}>
                                                <Card className="text-center">
                                                    <Card.Body>
                                                        <Card.Title>Net Income</Card.Title>
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
                                                        <Card.Title>Monthly Transactions Trend</Card.Title>
                                                        <div style={{ height: '300px' }}>
                                                            <Line data={getChartData(monthlyData.transactions)} options={chartOptions} />
                                                        </div>
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