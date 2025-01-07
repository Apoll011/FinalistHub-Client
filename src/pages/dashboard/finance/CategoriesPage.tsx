import React, {useState, useMemo} from 'react';
import {Form, Button, Modal, Card, Spinner, Alert, Col, Row} from 'react-bootstrap';
import {
    CategoriesApi,
    CategoryUsageResponse,
    TransactionCategoryResponse,
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
import {useCategories} from "hooks/useCategories.ts";
import {CategoryGrid} from "components/financial/CategoryCard.tsx";
import {formatCurrency} from "utils/currency.ts";

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

const CategoryForm: React.FC<{
    initialData?: TransactionCategoryResponse;
    onSubmit: (data: Omit<TransactionCategoryResponse, 'id'>) => Promise<void>;
    loading?: boolean;
}> = ({ initialData, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
    });
    
    return (
        <Form onSubmit={async (e) => {
            e.preventDefault();
            await onSubmit(formData);
        }}>
            <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        name: e.target.value
                    }))}
                    required
                />
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Descrição</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        description: e.target.value
                    }))}
                    required
                />
            </Form.Group>
            
            <div className="d-grid">
                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        'Salvar'
                    )}
                </Button>
            </div>
        </Form>
    );
};

const StatsDisplay: React.FC<{
    usage: CategoryUsageResponse;
}> = ({ usage }) => {
    const chartData = useMemo(() => {
        const dailyData: Record<string, number> = {};
        usage.transactions.forEach((transaction) => {
            const date = new Date(transaction.createdAt).toLocaleDateString();
            dailyData[date] = (dailyData[date] || 0) + 1;
        });
        
        const sortedDates = Object.keys(dailyData).sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );
        
        return {
            labels: sortedDates,
            datasets: [{
                label: 'Transações por Dia',
                data: sortedDates.map(date => dailyData[date]),
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.4)',
                tension: 0.2,
            }],
        };
    }, [usage.transactions]);
    
    return (
        <div>
            <Row className="g-4 mb-4">
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Total de Transações</Card.Title>
                            <h3 className="mb-0">{usage.totalTransactions}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Última Utilização</Card.Title>
                            <h3 className="mb-0">
                                {usage.lastUsed ? new Date(usage.lastUsed).toLocaleDateString() : 'Nunca'}
                            </h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Total</Card.Title>
                            <h3 className="mb-0">{formatCurrency(usage.totalAmount)}</h3>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Body>
                            <Card.Title>Média por Transação</Card.Title>
                            <h3 className="mb-0">{formatCurrency(usage.averageAmount)}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <Card>
                <Card.Body>
                    <Card.Title>Histórico de Transações</Card.Title>
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Data',
                                    },
                                },
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Número de Transações',
                                    },
                                },
                            },
                        }}
                    />
                </Card.Body>
            </Card>
        </div>
    );
};

const CategoriesPage: React.FC = () => {
    const { categories, loading, error, refetch } = useCategories();
    const [selectedCategory, setSelectedCategory] = useState<TransactionCategoryResponse | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [categoryUsage, setCategoryUsage] = useState<CategoryUsageResponse | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    
    const handleCreateCategory = async (data: Omit<TransactionCategoryResponse, 'id'>) => {
        try {
            setActionLoading(true);
            await new CategoriesApi().createCategoryCategoriesPost({
                transactionCategoryCreate: data
            });
            await refetch();
            setShowAddModal(false);
        } catch (error) {
            console.error('Failed to create category:', error);
        } finally {
            setActionLoading(false);
        }
    };
    
    const handleUpdateCategory = async (data: Omit<TransactionCategoryResponse, 'id'>) => {
        if (!selectedCategory) return;
        
        try {
            setActionLoading(true);
            await new CategoriesApi().updateCategoryCategoriesCategoryIdPut({
                categoryId: selectedCategory.id,
                transactionCategoryCreate: data
            });
            await refetch();
            setShowEditModal(false);
        } catch (error) {
            console.error('Failed to update category:', error);
        } finally {
            setActionLoading(false);
        }
    };
    
    const handleDeleteCategory = async (id: string) => {
        try {
            setActionLoading(true);
            await new CategoriesApi().deleteCategoryCategoriesCategoryIdDelete({
                categoryId: id
            });
            await refetch();
        } catch (error) {
            console.error('Failed to delete category:', error);
        } finally {
            setActionLoading(false);
        }
    };
    
    const handleViewStats = async (category: TransactionCategoryResponse) => {
        try {
            setActionLoading(true);
            const usage = await new CategoriesApi().getCategoryUsageCategoriesCategoryIdUsageGet({
                categoryId: category.id
            });
            setCategoryUsage(usage);
            setSelectedCategory(category);
            setShowStatsModal(true);
        } catch (error) {
            console.error('Failed to fetch category usage:', error);
        } finally {
            setActionLoading(false);
        }
    };
    
    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Categorias</h1>
                <Button
                    variant="primary"
                    onClick={() => setShowAddModal(true)}
                    disabled={loading || actionLoading}
                >
                    Adicionar Categoria
                </Button>
            </div>
            
            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}
            
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <CategoryGrid
                    categories={categories}
                    onEdit={(category) => {
                        setSelectedCategory(category);
                        setShowEditModal(true);
                    }}
                    onDelete={handleDeleteCategory}
                    onViewStats={handleViewStats}
                    loading={actionLoading}
                />
            )}
            
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Nova Categoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CategoryForm
                        onSubmit={handleCreateCategory}
                        loading={actionLoading}
                    />
                </Modal.Body>
            </Modal>
            
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Categoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCategory && (
                        <CategoryForm
                            initialData={selectedCategory}
                            onSubmit={handleUpdateCategory}
                            loading={actionLoading}
                        />
                    )}
                </Modal.Body>
            </Modal>
            
            <Modal
                show={showStatsModal}
                onHide={() => setShowStatsModal(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Estatísticas: {selectedCategory?.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {actionLoading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" />
                        </div>
                    ) : categoryUsage ? (
                        <StatsDisplay usage={categoryUsage} />
                    ) : null}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CategoriesPage;