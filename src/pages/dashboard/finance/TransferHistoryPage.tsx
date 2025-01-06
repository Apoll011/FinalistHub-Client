import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import TransactionsList from "components/financial/TransactionsList";
import { FinanceApi, GetTransferHistoryFinanceAccountsTransferHistoryGetRequest, TransactionResponse } from "api";

interface TransferSummary {
    total_transfers: number;
    total_amount_transferred: string;
}

interface FilterDates {
    startDate: Date;
    endDate: Date;
}

const TransferHistoryPage = () => {
    const [transfers, setTransfers] = useState<TransactionResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<FilterDates>({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate: new Date()
    });
    const [summary, setSummary] = useState<TransferSummary>({
        total_transfers: 0,
        total_amount_transferred: "0 CVE"
    });
    
    const fetchTransferHistory = async () => {
        setLoading(true);
        try {
            const api = new FinanceApi();
            const response = await api.getTransferHistoryFinanceAccountsTransferHistoryGet({
                startDate: filters.startDate,
                endDate: filters.endDate
            } as GetTransferHistoryFinanceAccountsTransferHistoryGetRequest);
            
            if (response) {
                setTransfers(response.transfers || []);
                setSummary({
                    total_transfers: response.totalTransfers || 0,
                    total_amount_transferred: formatCurrency(response.totalAmountTransferred) || "0 CVE",
                });
            }
        } catch (error) {
            console.error('Failed to fetch transfer history:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchTransferHistory();
    }, []); // Only fetch on mount, not on filter changes
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'CVE'
        }).format(amount);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchTransferHistory();
    };
    
    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Histórico de Movimentação</h1>
            </div>
            
            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <div className="row g-3 align-items-end">
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className="text-muted fw-bold">Data Inicial</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={filters.startDate.toISOString().split('T')[0]}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            startDate: new Date(e.target.value)
                                        }))}
                                        className="border-0 shadow-sm"
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-4">
                                <Form.Group>
                                    <Form.Label className="text-muted fw-bold">Data Final</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={filters.endDate.toISOString().split('T')[0]}
                                        onChange={(e) => setFilters(prev => ({
                                            ...prev,
                                            endDate: new Date(e.target.value)
                                        }))}
                                        className="border-0 shadow-sm"
                                    />
                                </Form.Group>
                            </div>
                            
                            <div className="col-md-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100 shadow-sm"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Carregando...
                                        </>
                                    ) : (
                                        'Aplicar Filtros'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            
            <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <Card className="shadow-sm h-100">
                        <Card.Body className="d-flex flex-column">
                            <div className="text-muted mb-2">Total de Movimentação</div>
                            <h2 className="mb-0 mt-auto">{summary.total_transfers}</h2>
                        </Card.Body>
                    </Card>
                </div>
                
                <div className="col-md-6">
                    <Card className="shadow-sm h-100">
                        <Card.Body className="d-flex flex-column">
                            <div className="text-muted mb-2">Total Movimentado</div>
                            <h2 className="mb-0 mt-auto">{summary.total_amount_transferred}</h2>
                        </Card.Body>
                    </Card>
                </div>
            </div>
            
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <TransactionsList transactions={transfers} />
            )}
        </div>
    );
};

export default TransferHistoryPage;