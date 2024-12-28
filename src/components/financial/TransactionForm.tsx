import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from 'hooks/useAuth';
import {AccountResponse, CategoriesApi, FinanceApi, TransactionCategoryResponse, TransactionCreate} from "api";
import Swal from "sweetalert2";

const PAYMENT_METHODS = [
    { value: 'cash', label: 'Dinheiro' },
    { value: 'credit_card', label: 'Cartão de Crédito' },
    { value: 'debit_card', label: 'Cartão de Débito' },
    { value: 'bank_transfer', label: 'Transferência Bancária' },
    { value: 'other', label: 'Outro' }
];

const TransactionForm = ({
                             show,
                             onHide,
                             transactionType
                         }: {
    show: boolean;
    onHide: () => void;
    transactionType: 'revenue' | 'expense';
}) => {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [categories, setCategories] = useState<TransactionCategoryResponse[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchData();
    }, [show]);

    const fetchData = async () => {
        try {
            const accountsResponse = await new FinanceApi().getAccountsFinanceAccountsGet();
            const categoriesResponse = await new CategoriesApi().listCategoriesCategoriesGet();
            setAccounts(accountsResponse);
            setCategories(categoriesResponse);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAddRevenueSubmit = async (formData: TransactionCreate) => {
        try {
            await new FinanceApi().createTransactionFinanceTransactionsPost({transactionCreate: formData});
            onHide();
            await Swal.fire({
                title: 'Ganho registrado com sucesso!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch {
            await Swal.fire({
                title: 'Erro adicionando ganho!',
                text: 'Please try again',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };
    const handleAddExpenseSubmit = async (formData: TransactionCreate) => {
        try {
            await new FinanceApi().createTransactionFinanceTransactionsPost({transactionCreate: formData});
            onHide();
            await Swal.fire({
                title: 'Gasto adicionado com sucesso!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch {
            await Swal.fire({
                title: 'Error adicionando gasto',
                text: 'Por favor tente novamente',
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
            const data = {
                type: transactionType,
                amount: Number(formData.get('amount')),
                description: formData.get('description'),
                paymentMethod: formData.get('payment_method'),
                [transactionType === 'expense' ? 'fromAccountId' : 'toAccountId']: formData.get('account_id'),
                categoryId: formData.get('category_id'),
                receiptNumber: formData.get('receipt_number'),
                notes: formData.get('notes'),
                createdBy: user?.id.toString(),
                createdAt: new Date(selectedDate),
                updatedAt: new Date()
            };

            const onSubmit = transactionType === "expense" ? handleAddExpenseSubmit : handleAddRevenueSubmit;

            await onSubmit(data as TransactionCreate);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddCategory = async () => {
        try {
            setIsSubmitting(true);
            await new CategoriesApi().createCategoryCategoriesPost({transactionCategoryCreate: newCategory});
            await fetchData();
            setShowCategoryModal(false);
            setNewCategory({ name: '', description: '' });
        } catch (error) {
            console.error('Error adding category:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Modal show={show} onHide={onHide} size="lg">
                <Modal.Header
                    closeButton
                    className={`border-bottom ${transactionType === 'expense' ? 'bg-warning' : 'bg-success'} text-white`}
                >
                    <Modal.Title className="h4">
                        {transactionType === 'revenue' ? 'Adicionar Receita' : 'Adicionar Despesa'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descrição</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="description"
                                        placeholder="Digite a descrição"
                                        required
                                    />
                                </Form.Group>
                            </Col>
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
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Forma de Pagamento</Form.Label>
                                    <Form.Select name="payment_method" required>
                                        <option value="">Selecione a forma de pagamento</option>
                                        {PAYMENT_METHODS.map(method => (
                                            <option key={method.value} value={method.value}>
                                                {method.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Data da Transação</Form.Label>
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
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        {transactionType === 'expense' ? 'Conta de Origem' : 'Conta de Destino'}
                                    </Form.Label>
                                    <Form.Select name="account_id" required>
                                        <option value="">Selecione a conta</option>
                                        {accounts.map(account => (
                                            <option key={account.id} value={account.id}>
                                                {account.name} ({account.type})
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Categoria</Form.Label>
                                    <div className="d-flex gap-2">
                                        <Form.Select name="category_id" required className="flex-grow-1">
                                            <option value="">Selecione a categoria</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => setShowCategoryModal(true)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Número do Recibo (Opcional)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="receipt_number"
                                        placeholder="Digite o número do recibo"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
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
                                {isSubmitting ? 'Enviando...' : (transactionType === 'revenue' ? 'Adicionar Receita' : 'Adicionar Despesa')}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Nova Categoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            placeholder="Digite o nome da categoria"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control
                            type="text"
                            value={newCategory.description}
                            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            placeholder="Digite a descrição da categoria"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowCategoryModal(false)}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleAddCategory}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Salvando...' : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TransactionForm;