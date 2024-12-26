import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import {FinanceApi, CategorySpendingAnalysis} from "api";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const apiFunctions = {
     getCategorySpending: async (startDate?: Date, endDate?: Date) => await new FinanceApi().analyzeCategorySpendingFinanceCategoriesSpendingAnalysisGet({ startDate, endDate })
};

const CategorySpendingAnalysisComponent = () => {
    const [spendingData, setSpendingData] = useState<CategorySpendingAnalysis | null>(null);
    const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, setEndDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiFunctions.getCategorySpending(startDate, endDate);
            setSpendingData(response);
        } catch (err) {
            setError('Failed to fetch spending analysis data');
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

    const formatPercentage = (value: number) => {
        return `${value.toFixed(1)}%`;
    };

    const chartData = spendingData ? {
        labels: spendingData.categories.map(cat => cat.category),
        datasets: [{
            data: spendingData.categories.map(cat => cat.totalAmount),
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#FF6384',
                '#36A2EB'
            ]
        }]
    } : null;

    const chartOptions = {
        plugins: {
            legend: {
                position: 'right',
            },
            tooltip: {
                callbacks: {
                    label: function(context: { raw: any; dataset: { data: any[]; }; }) {
                        const value = context.raw;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${formatCurrency(value)} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <Container fluid className="p-4">
            <Row className="mb-4">
                <Col>
                    <h1>Category Spending Analysis</h1>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Start Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={startDate.toISOString()}
                                            onChange={(e) => setStartDate(new Date(e.target.value))}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>End Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={endDate.toISOString()}
                                            onChange={(e) => setEndDate(new Date(e.target.value))}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4} className="d-flex align-items-end">
                                    <Button
                                        variant="primary"
                                        onClick={fetchData}
                                        disabled={loading}
                                        className="mb-3"
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
                                            'Update Analysis'
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

            {spendingData && (
                <>
                    <Row className="mb-4">
                        <Col md={12}>
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col md={8}>
                                            <div style={{ height: '400px' }}>
                                                <Doughnut data={chartData} options={chartOptions} />
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <Card>
                                                <Card.Body className="text-center">
                                                    <Card.Title>Total Spending</Card.Title>
                                                    <h2 className="text-primary">
                                                        {formatCurrency(spendingData.totalSpending)}
                                                    </h2>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Detailed Category Breakdown</Card.Title>
                                    <div className="table-responsive">
                                        <table className="table table-striped">
                                            <thead>
                                            <tr>
                                                <th>Category</th>
                                                <th>Total Amount</th>
                                                <th>Average Amount</th>
                                                <th>Transaction Count</th>
                                                <th>% of Total</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {spendingData.categories.map((category) => (
                                                <tr key={category.category}>
                                                    <td>{category.category}</td>
                                                    <td>{formatCurrency(category.totalAmount)}</td>
                                                    <td>{formatCurrency(category.averageAmount)}</td>
                                                    <td>{category.transactionCount}</td>
                                                    <td>{formatPercentage(category.percentageOfTotal)}</td>
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

export default CategorySpendingAnalysisComponent;