import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from 'hooks/useAuth.ts';
import {AccountResponse, FinanceApi, TransactionCreate} from "api";
import Swal from "sweetalert2";

const TransferForm = ({
                          show,
                          onHide,
                      }: {
    show: boolean;
    onHide: () => void;
}) => {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fromAccount, setFromAccount] = useState('');
    const [toAccount, setToAccount] = useState('');

    useEffect(() => {
        fetchAccounts();
    }, [show]);

    const fetchAccounts = async () => {
        try {
            const accountsResponse = await new FinanceApi().getAccountsFinanceAccountsGet();
            setAccounts(accountsResponse);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const handleTransferSubmit = async (formData: TransactionCreate) => {
        try {
            await new FinanceApi().createTransactionFinanceTransactionsPost({transactionCreate: formData});
            onHide();
            await Swal.fire({
                title: 'Tranferencia feita com sucesso!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch {
            await Swal.fire({
                title: 'Erro tranferindo o dinheiro!',
                text: 'Please try again',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const form = e.currentTarget;
            const formData = new FormData(form);
            const amount = Number(formData.get('amount'));

            const fromAccountData = accounts.find(acc => acc.id.toString() === fromAccount);
            const toAccountData = accounts.find(acc => acc.id.toString() === toAccount);

            const data = {
                amount: amount,
                fromAccountId: fromAccount,
                toAccountId: toAccount,
                description: `Transferência de ${fromAccountData?.name || ''} para ${toAccountData?.name || ''}`,
                notes: formData.get('notes'),
                createdBy: user?.id.toString(),
                createdAt: new Date(selectedDate),
                updatedAt: new Date(),
                type: "transfer"
            } as TransactionCreate;

            await handleTransferSubmit(data);
            onHide();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header
                closeButton
                className="border-bottom bg-primary text-white"
            >
                <Modal.Title className="h4">
                    Transferência entre Contas
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Conta de Origem</Form.Label>
                                <Form.Select
                                    name="from_account_id"
                                    required
                                    value={fromAccount}
                                    onChange={(e) => setFromAccount(e.target.value)}
                                >
                                    <option value="">Selecione a conta de origem</option>
                                    {accounts.map(account => (
                                        <option
                                            key={account.id}
                                            value={account.id}
                                            disabled={account.id.toString() === toAccount}
                                        >
                                            {account.name} ({account.type})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Conta de Destino</Form.Label>
                                <Form.Select
                                    name="to_account_id"
                                    required
                                    value={toAccount}
                                    onChange={(e) => setToAccount(e.target.value)}
                                >
                                    <option value="">Selecione a conta de destino</option>
                                    {accounts.map(account => (
                                        <option
                                            key={account.id}
                                            value={account.id}
                                            disabled={account.id.toString() === fromAccount}
                                        >
                                            {account.name} ({account.type})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Valor</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="amount"
                                    step="0.01"
                                    placeholder="Digite o valor"
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Data da Transferência</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Observações (Opcional)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="notes"
                                    placeholder="Adicione observações"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <Button
                            variant="secondary"
                            onClick={onHide}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Transferindo...' : 'Transferir'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default TransferForm;