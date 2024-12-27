import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import TransactionsList from "components/financial/TransactionsList.tsx";
import {FinanceApi, GetTransferHistoryFinanceAccountsTransferHistoryGetRequest, TransactionResponse} from "api";

// API functions placeholder
const apiFunctions = {
    getTransferHistory: async (params: GetTransferHistoryFinanceAccountsTransferHistoryGetRequest | undefined) => await new FinanceApi().getTransferHistoryFinanceAccountsTransferHistoryGet(params),
};

const TransferHistoryPage = () => {
    const [transfers, setTransfers] = useState<TransactionResponse[]>([]);
    const [filters, setFilters] = useState({ startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)), endDate: new Date() });
    const [summary, setSummary] = useState({ total_transfers: 0, total_amount_transferred: "0 CVE" });

    // Fetch transfer history on component mount or filters change
    useEffect(() => {
        fetchTransferHistory();
    }, [filters]);

    const fetchTransferHistory = async () => {
        const response = await apiFunctions.getTransferHistory(filters as GetTransferHistoryFinanceAccountsTransferHistoryGetRequest);
        if (response) {
            setTransfers(response.transfers || []);
            setSummary({
                total_transfers: response.totalTransfers || 0,
                total_amount_transferred: formatCurrency(response.totalAmountTransferred) || "0 CVE",
            });
        }
    };

    const formatCurrency = (amount:number) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'CVE'
        }).format(amount);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLFormElement>) => {
        const { name, value } = e.target as HTMLFormElement;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: new Date(value) }));
    };

    /**
     * @ts-ignore
     */
    return (
        <div className="container mt-4">
            <h1>Histórico de Movimentação</h1>
            <Card className="mb-4">
                <Card.Body>
                    <div>
                        <h4>Total de Movimentação: {summary.total_transfers}</h4>
                        <h4>Total Movimentado: {summary.total_amount_transferred}</h4>
                    </div>
                </Card.Body>
            </Card>

            <Row className="my-6">
                <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
                    <Card className="mb-4">
                    <Card.Body>
                            <Form className="mb-4">
                                <Form.Group className="mb-3">
                                    <Form.Label>Data Inicial</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={filters.startDate.toISOString().split('T')[0]}
                                        onChange={(e) => handleFilterChange(e)}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Data Final</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={filters.endDate.toISOString().split('T')[0]}
                                        onChange={(e) => handleFilterChange(e)}
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={fetchTransferHistory}>
                                    Aplicar Filtros
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={8} lg={12} md={12} xs={12}>
                    <TransactionsList transactions={transfers}/>
                </Col>
            </Row>

        </div>
    );
};

export default TransferHistoryPage;
