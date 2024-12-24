import React, { useState } from 'react';
import {Card, Table, Form, Pagination, Badge} from 'react-bootstrap';
import { useApiData } from "components/api_component";
import { FinanceApi, FinancialTransaction } from "api";

const ITEMS_PER_PAGE = 5;

export const TransactionsList = () => {
    const [timeFilter, setTimeFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    type transationType = "revenue" | "expense";

    const getTransationTypeBadge = (status: transationType) => {
        const statusColors: Record<transationType, string> = {
            'revenue': 'success',
            'expense': 'danger',
        };
        const statusName: Record<transationType, string> = {
            'revenue': 'Ganho',
            'expense': 'Gasto',
        };
        return <Badge bg={statusColors[status] || 'secondary'}>{statusName[status]}</Badge>;
    };

    const getApiCall = () => {
        switch (timeFilter) {
            case "monthly":
                return new FinanceApi().getMonthlyTransactionsFinanceTransactionsMonthlyGet();
            case "weekly":
                return new FinanceApi().getWeeklyTransactionsFinanceTransactionsWeeklyGet();
            default:
                return new FinanceApi().getTransactionsFinanceTransactionsGet();
        }
    };

    const { data, loading, error } = useApiData(getApiCall, { totalRevenue: 0, totalExpenses: 0, netIncome: 0, transactions: [] });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'CVE'
        }).format(amount);
    };

    if (loading) {
        return (
            <Card className="w-100">
                <Card.Body className="p-4">
                    <div className="text-center">Carregando...</div>
                </Card.Body>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-100">
                <Card.Body className="p-4">
                    <div className="text-danger">Error: {error}</div>
                </Card.Body>
            </Card>
        );
    }

    const transactions = data.transactions || [];
    const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedTransactions = transactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <Card className="w-100 h-full">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title className="mb-0">Transações</Card.Title>
                <Form.Select
                    style={{ width: 'auto' }}
                    value={timeFilter}
                    onChange={(e) => {
                        setTimeFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="all">Todas as Transações</option>
                    <option value="monthly">Transações deste Mês</option>
                    <option value="weekly">Transações desta Semana</option>
                </Form.Select>
            </Card.Header>
            <Card.Body>
                <div>
                    <span><strong>Total Ganho: </strong>{data.totalRevenue}</span><br/>
                    <span><strong>Total Gasto: </strong>{data.totalExpenses}</span><br/>
                    <span><strong>Total: </strong>{data.netIncome}</span>
                </div>
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Tipo</th>
                        <th>Data</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedTransactions.map((transaction: FinancialTransaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.description}</td>
                            <td>{formatCurrency(transaction.amount)}</td>
                            <td>{getTransationTypeBadge(transaction.type as transationType)}</td>
                            <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                <div className="d-flex justify-content-center mt-4 bottom-0 right-0 mx-4">
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        />

                        {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                            <Pagination.Item
                                key={page}
                                active={page === currentPage}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Pagination.Item>
                        ))}

                        <Pagination.Next
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            </Card.Body>
        </Card>
    );
};

export default TransactionsList;