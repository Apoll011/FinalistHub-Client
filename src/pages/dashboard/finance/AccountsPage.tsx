import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal, Form, Button, Spinner } from 'react-bootstrap';
import { Bank, CreditCard, Wallet, ArrowUpRight, Calendar } from 'react-bootstrap-icons';
import {AccountCreate, AccountResponse, AccountStatement, FinanceApi} from "api";
import {PlusCircle} from "react-feather";
import TransactionsList from "components/financial/TransactionsList.tsx";
import TransactionForm from "components/financial/TransactionForm.tsx";
import TransferForm from "components/financial/TransferForm.tsx";
import {formatCurrency} from "utils/currency.ts";

const apiFunctions = {
    getAccounts: async () => await new FinanceApi().getAccountsFinanceAccountsGet(),
    getAccountStatement: async (accountId: string, startDate: Date, endDate: Date) => await new FinanceApi().getAccountStatementFinanceAccountsAccountIdStatementGet({
        accountId,
        startDate,
        endDate
    }),
    createAccount: async (data: AccountCreate) => await new FinanceApi().createAccountFinanceAccountsPost({accountCreate: data})
};

const AccountsPage = () => {
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, setEndDate] = useState(new Date());
    const [statementData, setStatementData] = useState<AccountStatement | null>(null);
    const [loadingStatement, setLoadingStatement] = useState(false);

    const [showAddRevenueModal, setShowAddRevenueModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);


    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [newAccount, setNewAccount] = useState<AccountCreate>({
        name: '',
        type: 'bank',
        description: ''
    });


    const fetchAccounts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiFunctions.getAccounts();
            setAccounts(response);
        } catch {
            setError('Failed to fetch accounts');
        } finally {
            setLoading(false);
        }
    };

    const fetchStatement = async () => {
        if (!selectedAccount) {
            return
        }
        try {
            setLoadingStatement(true);
            const response = await apiFunctions.getAccountStatement(
                selectedAccount.id,
                startDate,
                endDate
            );
            setStatementData(response);
        } catch {
            setError('Failed to fetch account statement');
        } finally {
            setLoadingStatement(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const getAccountIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'bank':
                return <Bank className="text-primary" size={24} />;
            case 'cash':
                return <CreditCard className="text-success" size={24} />;
            default:
                return <Wallet className="text-info" size={24} />;
        }
    };

    const handleAccountClick = (account: AccountResponse | null) => {
        setSelectedAccount(account);
        setShowModal(true);
        setStatementData(null);
    };

    const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setCreateLoading(true);
            await apiFunctions.createAccount(newAccount as AccountCreate);
            setShowCreateModal(false);
            setNewAccount({ name: '', type: 'bank', description: '' });
            fetchAccounts();
        } catch {
            setError('Failed to create account');
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <Container fluid className="p-4 bg-light min-vh-100">
            <Row className="mb-4">
                <Col xs={12} className="d-flex justify-content-between align-items-center">
                    <div>
                        <h1 className="display-4 mb-0">Contas</h1>
                    </div>
                    <Col xs="auto">
                        <Button variant="primary" className="bg-success mx-3" onClick={() => setShowAddRevenueModal(true)}>
                            Adicionar Receita
                        </Button>
                        <Button variant="primary" className="bg-warning mx-3" onClick={() => setShowAddExpenseModal(true)}>
                            Adicionar Despesa
                        </Button>
                        <Button variant="primary" className="bg-info  mx-3 " onClick={() => setShowTransferModal(true)}>
                            Transferir Dinheiro
                        </Button>
                        <Button
                            variant="primary"
                            className="align-items-center shadow-sm"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <PlusCircle size={20} className="me-2" />
                            Nova Conta
                        </Button>
                    </Col>
                </Col>
            </Row>

            {error && (
                <Row className="mb-4">
                    <Col>
                        <div className="alert alert-danger">{error}</div>
                    </Col>
                </Row>
            )}

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Row>
                    {accounts.map((account) => (
                        <Col key={account.id} lg={4} md={6} className="mb-4">
                            <Card
                                className="h-100 shadow-sm hover-shadow transition-all"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleAccountClick(account)}
                            >
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="d-flex align-items-center">
                                            {getAccountIcon(account.type)}
                                            <h3 className="mb-0 ms-2">{account.name}</h3>
                                        </div>
                                        <ArrowUpRight size={20} className="text-primary" />
                                    </div>
                                    <Card.Subtitle className="mb-3 text-muted">
                                        {account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account
                                    </Card.Subtitle>
                                    <p className="text-muted mb-3">{account.description}</p>
                                    <div className="mt-auto">
                                        <h2 className={`mb-0 ${account.currentBalance >= 0 ? 'text-success' : 'text-danger'}`}>
                                            {formatCurrency(account.currentBalance)}
                                        </h2>
                                        <small className="text-muted">
                                            Saldo Atual
                                        </small>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div className="d-flex align-items-center">
                            {selectedAccount && getAccountIcon(selectedAccount.type)}
                            <span className="ms-2">Extrato de {selectedAccount?.name}</span>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="mb-4">
                        <Col md={5}>
                            <Form.Group>
                                <Form.Label>Data de Início</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <Calendar size={18} />
                                    </span>
                                    <Form.Control
                                        type="date"
                                        value={startDate.toISOString().split('T')[0]}
                                        onChange={(e) => setStartDate(new Date(e.target.value))}
                                    />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={5}>
                            <Form.Group>
                                <Form.Label>Data Final</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <Calendar size={18} />
                                    </span>
                                    <Form.Control
                                        type="date"
                                        value={endDate.toISOString().split('T')[0]}
                                        onChange={(e) => setEndDate(new Date(e.target.value))}
                                    />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={2} className="d-flex align-items-end">
                            <Button
                                variant="primary"
                                onClick={fetchStatement}
                                disabled={loadingStatement}
                                className="w-100"
                            >
                                {loadingStatement ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    'Obter Extrato'
                                )}
                            </Button>
                        </Col>
                    </Row>

                    {statementData && (
                        <>
                            <Row className="mb-4">
                                <Col md={4}>
                                    <Card className="bg-light">
                                        <Card.Body className="text-center">
                                            <Card.Title>Saldo de Abertura</Card.Title>
                                            <h4>{formatCurrency(statementData.openingBalance)}</h4>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="bg-light">
                                        <Card.Body className="text-center">
                                            <Card.Title>Saldo Final</Card.Title>
                                            <h4>{formatCurrency(statementData.closingBalance)}</h4>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="bg-light">
                                        <Card.Body className="text-center">
                                            <Card.Title>Variação Líquida</Card.Title>
                                            <h4 className={statementData.closingBalance - statementData.openingBalance >= 0 ? 'text-success' : 'text-danger'}>
                                                {formatCurrency(statementData.closingBalance - statementData.openingBalance)}
                                            </h4>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <TransactionsList transactions={statementData.transactions} />
                        </>
                    )}
                </Modal.Body>
            </Modal>
            <Modal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                centered
            >
                <Modal.Header closeButton className="border-0">
                    <Modal.Title>Criar nova Conta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateAccount}>
                        <Form.Group className="mb-3">
                            <Form.Label>Account Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nome da Conta"
                                value={newAccount.name}
                                onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tipo de Conta</Form.Label>
                            <div className="d-flex gap-3">
                                <Button
                                    variant={newAccount.type === 'bank' ? 'primary' : 'outline-primary'}
                                    className="flex-grow-1 py-3"
                                    onClick={() => setNewAccount({...newAccount, type: 'bank'})}
                                    type="button"
                                >
                                    <Bank size={24} className="mb-2" />
                                    <div>Conta no Banco</div>
                                </Button>
                                <Button
                                    variant={newAccount.type === 'cash' ? 'primary' : 'outline-primary'}
                                    className="flex-grow-1 py-3"
                                    onClick={() => setNewAccount({...newAccount, type: 'cash'})}
                                    type="button"
                                >
                                    <Wallet size={24} className="mb-2" />
                                    <div>Conta de Caixa</div>
                                </Button>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Descrição da Conta"
                                value={newAccount.description as string}
                                onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={createLoading}
                                className="py-2"
                            >
                                {createLoading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            className="me-2"
                                        />
                                        Criando Conta...
                                    </>
                                ) : (
                                    'Criar Conta'
                                )}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <style>{`
                .hover-shadow:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
            `}</style>
            <TransactionForm
                show={showAddRevenueModal}
                onHide={() => setShowAddRevenueModal(false)}
                transactionType="revenue"
            />
            <TransactionForm
                show={showAddExpenseModal}
                onHide={() => setShowAddExpenseModal(false)}
                transactionType="expense"
            />
            <TransferForm
                show={showTransferModal}
                onHide={() => setShowTransferModal(false)}
            />
        </Container>
    );
};

export default AccountsPage;