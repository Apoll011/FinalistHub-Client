import React, { useState, useEffect } from 'react';
import {Table, Form, Button, Row, Col, Card, Spinner} from 'react-bootstrap';
import TransactionsList from "components/financial/TransactionsList.tsx";
import {FinanceApi, GetTransferHistoryFinanceAccountsTransferHistoryGetRequest, TransactionResponse} from "api";

// API functions placeholder
const apiFunctions = {
    getTransferHistory: async (params: GetTransferHistoryFinanceAccountsTransferHistoryGetRequest | undefined) => await new FinanceApi().getTransferHistoryFinanceAccountsTransferHistoryGet(params),
};

const TransferHistoryPage = () => {
    const [transfers, setTransfers] = useState<TransactionResponse[]>([]);
    const [filters, setFilters] = useState<GetTransferHistoryFinanceAccountsTransferHistoryGetRequest>({ startDate: null, endDate: null });
    const [summary, setSummary] = useState({ total_transfers: 0, total_amount_transferred: 0 });

    // Fetch transfer history on component mount or filters change
    useEffect(() => {
        fetchTransferHistory();
    }, [filters]);

    const fetchTransferHistory = async () => {
        const response = await apiFunctions.getTransferHistory(filters);
        if (response) {
            setTransfers(response.transfers || []);
            setSummary({
                total_transfers: response.totalTransfers || 0,
                total_amount_transferred: response.totalAmountTransferred || 0,
            });
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: new Date(value) }));
    };

    return (
        <div className="container mt-4">
            <h1>Transfer History</h1>
            <Card className="mb-4">
                <Card.Body>
                    <div>
                        <h4>Total Transfers: {summary.total_transfers}</h4>
                        <h4>Total Amount Transferred: {summary.total_amount_transferred}</h4>
                    </div>
                </Card.Body>
            </Card>

            <Row className="my-6">
                <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
                    <Card className="mb-4">
                    <Card.Body>
                            <Form className="mb-4">
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={filters.startDate}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={filters.endDate}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={fetchTransferHistory}>
                                    Apply Filters
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
