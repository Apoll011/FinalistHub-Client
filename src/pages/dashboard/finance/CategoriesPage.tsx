import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Modal, Card, Spinner, Alert, Col, Row } from 'react-bootstrap';
import {
    CategoriesApi,
    CategoryUsageResponse,
    ListCategoriesCategoriesGetRequest,
    TransactionCategoryCreate,
    TransactionCategoryResponse,
    TransactionResponse
} from 'api';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    LineElement,
    Legend,
    PointElement
);

const apiFunctions = {
    createCategory: async (data: TransactionCategoryCreate) => new CategoriesApi().createCategoryCategoriesPost({ transactionCategoryCreate: data }),
    listCategories: async (params: ListCategoriesCategoriesGetRequest | undefined) => new CategoriesApi().listCategoriesCategoriesGet(params),
    updateCategory: async (id: string, data: TransactionCategoryCreate) => new CategoriesApi().updateCategoryCategoriesCategoryIdPut({ categoryId: id, transactionCategoryCreate: data }),
    deleteCategory: async (id: string) => new CategoriesApi().deleteCategoryCategoriesCategoryIdDelete({ categoryId: id }),
    getCategoryUsage: async (categoryId: string) =>
        new CategoriesApi().getCategoryUsageCategoriesCategoryIdUsageGet({ categoryId: categoryId }),
};

const CategoriesPage = () => {
    const [categories, setCategories] = useState<TransactionCategoryResponse[]>([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [selectedCategory, setSelectedCategory] = useState<TransactionCategoryResponse | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [categoryUsageData, setCategoryUsageData] = useState<CategoryUsageResponse | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const getTransactionsByDay = (transactions: Array<TransactionResponse>) => {
        const dailyData: Record<string, number> = {};

        transactions.forEach((transaction) => {
            const date = new Date(transaction.createdAt).toLocaleDateString();
            dailyData[date] = (dailyData[date] || 0) + 1;
        });

        const sortedDates = Object.keys(dailyData).sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );

        return {
            labels: sortedDates,
            data: sortedDates.map((date) => dailyData[date]),
        };
    };

    const transactionsByDay = categoryUsageData
        ? getTransactionsByDay(categoryUsageData.transactions)
        : { labels: [], data: [] };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await apiFunctions.listCategories({ skip: 0, limit: 100 });
            setCategories(response || []);
        } catch {
            setError('Failed to fetch categories. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategory.name || !newCategory.description) return;

        try {
            setLoading(true);
            await apiFunctions.createCategory(newCategory);
            setNewCategory({ name: '', description: '' });
            setShowAddModal(false);
            fetchCategories();
        } catch {
            setError('Failed to create category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'CVE'
        }).format(amount);
    };

    const handleEditCategory = async () => {
        if (!selectedCategory?.id) return;

        const response = await apiFunctions.updateCategory(selectedCategory.id, selectedCategory);
        if (response) {
            setShowEditModal(false);
            fetchCategories();
        }
    };

    const fetchCategoryUsage = async (categoryId: string) => {
        try {
            const response = await apiFunctions.getCategoryUsage(categoryId);
            setCategoryUsageData(response);
        } catch {
            setError('Failed to fetch category usage data. Please try again.');
        }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            setLoading(true);
            await apiFunctions.deleteCategory(id);
            fetchCategories();
        } catch {
            setError('Não é possivel deletar esta categoria pois ele é usada.');
        } finally {
            setLoading(false);
        }
    };

    const CategoryClick = async (categoryId: string) => {
        try {
            setLoading(true);
            await fetchCategoryUsage(categoryId);
            setShowModal(true);
        } catch {
            setError('Failed to update category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Categorias</h1>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    Adicionar Categoria
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="table-responsive rounded-3 rounded-bottom-3">
                <Table hover>
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td className="w-25">{category.name}</td>
                            <td className="w-25">{category.description}</td>
                            <td className="w-25">
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => CategoryClick(category.id)}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Estatísticas'}
                                </Button>
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setShowEditModal(true);
                                    }}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Editar'}
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteCategory(category.id)}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Apagar'}
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>

            {/* Add Category Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Nova Categoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nome da Categoria"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Descrição"
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleCreateCategory}
                        disabled={!newCategory.name || !newCategory.description || loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Criar categoria'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Category Modal */}
            {selectedCategory && (
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar {selectedCategory.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Nome</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedCategory.name}
                                    onChange={(e) =>
                                        setSelectedCategory({ ...selectedCategory, name: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Descrição</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedCategory.description as string}
                                    onChange={(e) =>
                                        setSelectedCategory({ ...selectedCategory, description: e.target.value })
                                    }
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" disabled={loading} onClick={() => setShowEditModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" disabled={loading} onClick={handleEditCategory}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Salvar'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Category Usage Modal */}
            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                setCategoryUsageData(null);
                setSelectedCategory(null);
            }} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Estatísticas de Uso: {selectedCategory?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {categoryUsageData ? (
                        <div>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <Card>
                                        <Card.Body>
                                            <h6>Total de Transações</h6>
                                            <p>{categoryUsageData.totalTransactions}</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card>
                                        <Card.Body>
                                            <h6>Última Utilização</h6>
                                            <p>{categoryUsageData.lastUsed ? new Date(categoryUsageData.lastUsed).toLocaleDateString() : 'Nunca'}</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card>
                                        <Card.Body>
                                            <h6>Total</h6>
                                            <p>{formatCurrency(categoryUsageData.totalAmount)}</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card>
                                        <Card.Body>
                                            <h6>Média</h6>
                                            <p>{formatCurrency(categoryUsageData.averageAmount)}</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Line
                                        data={{
                                            labels: transactionsByDay.labels,
                                            datasets: [
                                                {
                                                    label: 'Total de Transações por Dia',
                                                    data: transactionsByDay.data,
                                                    fill: false,
                                                    borderColor: 'rgba(75, 192, 192, 1)',
                                                    backgroundColor: 'rgba(75, 192, 192, 0.4)',
                                                    tension: 0.2,
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    display: true,
                                                    position: 'top',
                                                },
                                            },
                                            scales: {
                                                x: {
                                                    title: {
                                                        display: true,
                                                        text: 'Dias',
                                                    },
                                                },
                                                y: {
                                                    beginAtZero: true,
                                                    title: {
                                                        display: true,
                                                        text: 'Transações',
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </Col>
                            </Row>
                        </div>
                    ) : (
                        <Spinner animation="border" />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowModal(false);
                        setCategoryUsageData(null);
                        setSelectedCategory(null);
                    }}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CategoriesPage;