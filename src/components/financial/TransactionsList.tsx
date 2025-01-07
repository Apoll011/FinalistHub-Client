import React from 'react';
import {Card, ListGroup, Badge, Row, Col} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {ArrowUp, ArrowDown, ArrowLeftRight} from 'react-bootstrap-icons';
import {TransactionResponse} from 'api';
import {formatCurrency} from "utils/currency.ts";
import {useAccountNames} from "hooks/useAccountNames.ts";

interface TransactionsListProps {
    transactions: TransactionResponse[]
}

const TransactionsList: React.FC<TransactionsListProps> = ({transactions }) => {
    const navigate = useNavigate();

    const swappedTransactions = [...transactions].reverse();

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'revenue':
                return <ArrowUp className="text-white" size={24}/>;
            case 'expense':
                return <ArrowDown className="text-warning" size={24}/>;
            default:
                return <ArrowLeftRight className="text-white" size={24}/>;
        }
    };
    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'revenue':
                return 'success';
            case 'expense':
                return 'danger';
            default:
                return 'info';
        }
    };
    const getTransactionName = (type: string) => {
        switch (type) {
            case 'revenue':
                return 'Ganho';
            case 'expense':
                return 'Despesa';
            default:
                return 'Movimentação';
        }
    };

    const handleTransactionClick = (id: string) => {
        navigate(`/finance/transactions/${id}`);
    };
    
    const { isLoading: loadingAccounts, getAccountName } = useAccountNames(
        transactions.flatMap(t => [t.fromAccountId, t.toAccountId])
    );

    return (
        <Row className="g-4">
            {loadingAccounts ? (
                <Col xs={12} className="text-center py-5">
                    <Card.Text className="text-muted fs-5">Carregando...</Card.Text>
                </Col>
            ) : transactions.length > 0 ? (
                swappedTransactions.map((transaction) => (
                    <Col key={transaction.id} xs={12} md={6} lg={4}>
                        <Card
                            className="h-100 shadow-sm transition-transform hover-lift"
                            style={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease',
                            }}
                            onClick={() => handleTransactionClick(transaction.id)}
                            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
                            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            <Card.Header
                                className={`bg-${getTransactionColor(transaction.type)} bg-opacity-10 border-0`}>
                                <div className="d-flex align-items-center justify-content-between p-2">
                                    {getTransactionIcon(transaction.type)}
                                    <Badge bg={getTransactionColor(transaction.type)} className="px-3 py-2">
                                        {getTransactionName(transaction.type)}
                                    </Badge>
                                </div>
                            </Card.Header>

                            <Card.Body className="pt-3">
                                <Card.Title className="mb-3 text-truncate">
                                    {transaction.description || 'Sem descrição'}
                                </Card.Title>
                                <Card.Subtitle className="mb-3 text-primary fw-bold fs-4">
                                    {formatCurrency(transaction.amount)}
                                </Card.Subtitle>

                                <ListGroup variant="flush">
                                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">De conta</span>
                                        <span className="fw-medium">
                                            {getAccountName(transaction.fromAccountId) || 'Loading...'}
                                        </span>
                                    </ListGroup.Item>

                                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Para a conta</span>
                                        <span className="fw-medium">
                                            {getAccountName(transaction.toAccountId) || 'Loading...'}
                                        </span>
                                    </ListGroup.Item>

                                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                        <span className="text-muted">Data</span>
                                        <span className="fw-medium">
                                            {new Date(transaction.createdAt).toLocaleDateString('pt-PT', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </span>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                ))
            ) : (
                <Col xs={12} className="text-center py-5">
                    <Card.Text className="text-muted fs-5">Sem transações disponível</Card.Text>
                </Col>
            )}
        </Row>
    );
};

export default TransactionsList;
