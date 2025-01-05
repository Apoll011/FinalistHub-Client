import React, { useState, useEffect, useCallback } from 'react';
import {Card, Row, Col, Button, Modal, Form, Toast, ToastContainer, Badge, Spinner} from 'react-bootstrap';
import { Cart, CurrencyDollar, Box, Tag, Calendar, ClockHistory } from 'react-bootstrap-icons';
import {
    AccountResponse,
    FinanceApi,
    ItemStatus,
    StandaloneItem,
    StandaloneItemSaleCreate,
    StandaloneItemsApi
} from "api";
import {useAuth} from "hooks/useAuth.tsx";
import ShowIfAdmin from "components/auth/admin/show_if_admin.tsx";

const StandaloneApi = {
    sellItem: (itemId: string, data: StandaloneItemSaleCreate) => new StandaloneItemsApi().sellItemStandaloneItemsItemIdSellPost({itemId: itemId, standaloneItemSaleCreate: data}),
    getItems: (status: ItemStatus | undefined) => new StandaloneItemsApi().getItemsStandaloneItemsGet({status: status}),
    closeItem: (itemId: string, userId: number, accountId: string) => new StandaloneItemsApi().closeItemStandaloneItemsItemIdClosePost({itemId: itemId, closeItemRequest: {userId: userId.toString(), toAccountId: accountId}}),
    createItem: (data: { name: string; description: string; price: number; quantity: number }) =>
        new StandaloneItemsApi().createStandaloneItemStandaloneItemsPost({ standaloneItemCreate: data }),
    updateItem: (item: StandaloneItem, data: { quantity: number }) =>
        new StandaloneItemsApi().updateItemStandaloneItemsItemIdPut({
            itemId: item.id,
            standaloneItemUpdate: {
                name: item.name,
                description: item.description,
                price: item.price,
                quantity: data.quantity
            }
        }),
};

interface Notification {
    id: number;
    message: string;
    variant: string;
}

const ItemSaleModal: React.FC<{
    show: boolean;
    handleClose: () => void;
    item: StandaloneItem;
    onSaleQueued: () => void;
}> = ({ show, handleClose, item, onSaleQueued }) => {
    const [form, setForm] = useState<StandaloneItemSaleCreate>({
        quantity: 1,
        paymentMethod: 'cash'
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleClose();
        StandaloneApi.sellItem(item.id, form)
            .then(() => {
                onSaleQueued();
            })
            .catch((error) => console.error('Sale failed:', error));
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    <Cart className="me-2" />
                    Vender {item?.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-4">
                    <div className="bg-light p-3 rounded mb-3">
                        <h6 className="fw-bold mb-2">Detalhes do Item</h6>
                        <p className="mb-2">{item.description}</p>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>
                                <Tag className="me-2" />
                                <span className="fw-bold">Preço:</span>
                            </span>
                            <span className="text-primary fw-bold">{item?.price.toFixed(2).replace(".", "$")}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <span>
                                <Box className="me-2" />
                                <span className="fw-bold">Estoque Disponível:</span>
                            </span>
                            <span>{item.quantity} unidades</span>
                        </div>
                    </div>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                            <Box className="me-2" />
                            Quantidade
                        </Form.Label>
                        <Form.Control
                            type="number"
                            value={form.quantity}
                            onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
                            required
                            min="1"
                            max={item.quantity}
                            className="form-control-lg"
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            <Cart className="me-2" />
                            Confirmar Venda
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

const CloseItemModal:React.FC<{
    show: boolean;
    handleClose: () => void;
    item: StandaloneItem;
    onClose: () => void;
}> = ({ show, handleClose, item, onClose }) => {
    const { user } = useAuth();

    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [accountId, setAccountId] = useState<string | null>(null);

    useEffect(() => {
        new FinanceApi().getAccountsFinanceAccountsGet().then((accounts) => {
            setAccounts(accounts);
        });
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleClose();
        StandaloneApi.closeItem(item.id, user!.id, accountId!).then(r => onClose());
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-warning text-white">
                <Modal.Title>
                    Fechar {item?.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Conta de Destino
                            </Form.Label>
                            <Form.Select name="account_id" onChange={(e) => setAccountId(e.target.value)} required>
                                <option value="">Selecione a conta</option>
                                {accounts.map(account => (
                                    <option key={account.id} value={account.id}>
                                        {account.name} ({account.type})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="warning" type="submit">
                            Fechar
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

const AddItemModal: React.FC<{
    show: boolean;
    handleClose: () => void;
    onItemCreated: () => void;
}> = ({ show, handleClose, onItemCreated }) => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: 0,
        quantity: 0
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleClose();
        StandaloneApi.createItem(form)
            .then(() => {
                onItemCreated();
            })
            .catch((error) => console.error('Item creation failed:', error));
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-success text-white">
                <Modal.Title>
                    <Box className="me-2" />
                    Adicionar Novo Item
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                            Nome do Item
                        </Form.Label>
                        <Form.Control
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="form-control-lg"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                            Descrição
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                            className="form-control-lg"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                            <CurrencyDollar className="me-2" />
                            Preço
                        </Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                            required
                            min="0"
                            className="form-control-lg"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                            <Box className="me-2" />
                            Quantidade
                        </Form.Label>
                        <Form.Control
                            type="number"
                            value={form.quantity}
                            onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
                            required
                            min="0"
                            className="form-control-lg"
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="success" type="submit">
                            <Box className="me-2" />
                            Criar Item
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

const EditStockModal: React.FC<{
    show: boolean;
    handleClose: () => void;
    item: StandaloneItem;
    onStockUpdated: () => void;
}> = ({ show, handleClose, item, onStockUpdated }) => {
    const [quantity, setQuantity] = useState(item.quantity);

    useEffect(() => {
        setQuantity(item.quantity);
    }, [item]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleClose();
        StandaloneApi.updateItem(item, { quantity })
            .then(() => {
                onStockUpdated();
            })
            .catch((error) => console.error('Stock update failed:', error));
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-info text-white">
                <Modal.Title>
                    <Box className="me-2" />
                    Atualizar Estoque: {item.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-4">
                    <div className="bg-light p-3 rounded mb-3">
                        <h6 className="fw-bold mb-2">Detalhes do Item</h6>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>
                                <Box className="me-2" />
                                <span className="fw-bold">Estoque Atual:</span>
                            </span>
                            <span>{item.quantity} unidades</span>
                        </div>
                    </div>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                            <Box className="me-2" />
                            Nova Quantidade
                        </Form.Label>
                        <Form.Control
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            required
                            min="0"
                            className="form-control-lg"
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="info" type="submit">
                            <Box className="me-2" />
                            Atualizar Estoque
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};


const StandaloneSalesPage = () => {
    const [items, setItems] = useState<StandaloneItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<StandaloneItem|null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showCloseModal, setShowCloseModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditStockModal, setShowEditStockModal] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [loading, setLoading] = useState(true);

    const addNotification = (message: string, variant: string) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, variant }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    const fetchItems = useCallback(async () => {
        try {
            const items = await StandaloneApi.getItems('active');
            setItems(items);
            setLoading(false);
        } catch (error) {
            addNotification(`Erro: ${error}`, "danger");
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleSaleSuccess = () => {
        addNotification('Venda registrada com sucesso!', 'success');
        fetchItems();
    };

    const handleSaleClose = () => {
        addNotification('Item fechado com sucesso!', 'success');
        fetchItems();
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="p-4">
            <ToastContainer position="top-end" className="p-3">
                {notifications.map(({ id, message, variant }) => (
                    <Toast key={id} onClose={() => setNotifications((prev) => prev.filter((n) => n.id !== id))}>
                        <Toast.Header className={`bg-${variant} text-white`}>
                            <strong className="me-auto">Notificação</strong>
                        </Toast.Header>
                        <Toast.Body>{message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">Venda de Items</h1>
                <div className="bg-light p-2 rounded">
                    Total de items ativos: {items.length}
                </div>
                <ShowIfAdmin>
                    <Button
                        variant="success"
                        onClick={() => setShowAddModal(true)}
                    >
                        <Box className="me-2" />
                        Adicionar Item
                    </Button>
                </ShowIfAdmin>
            </div>

            { loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary"/>
                </div>
            ) : (
                <Row className="g-4">
                    {items.map((item) => (
                        <Col key={item.id} md={4}>
                            <Card className="h-100 shadow-sm hover-shadow">
                                <Card.Body>
                                    <Card.Title className="d-flex justify-content-between align-items-center mb-3">
                                    <span>
                                        <Tag className="me-2" />
                                        {item.name}
                                    </span>
                                        <Badge bg={item.status === 'active' ? "success" : "secondary"}>
                                            {item.status === 'active' ? "Ativo" : "Fechado"}
                                        </Badge>
                                    </Card.Title>
                                    <Card.Text className="mb-3">{item.description}</Card.Text>
                                    <div className="bg-light p-3 rounded mb-3">
                                        <div className="d-flex justify-content-between mb-2">
                                            <div>
                                                <CurrencyDollar className="me-1" />
                                                <span className="fw-bold">Preço:</span>
                                            </div>
                                            <span className="text-primary fw-bold">${item.price}</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <Box className="me-1" />
                                                <span className="fw-bold">Estoque:</span>
                                            </div>
                                            <span>{item.quantity} unidades</span>
                                        </div>
                                    </div>
                                    <div className="small text-muted mb-3">
                                        <div>
                                            <Calendar className="me-1" />
                                            Criado em: {formatDate(item.createdAt)}
                                        </div>
                                        <div>
                                            <ClockHistory className="me-1" />
                                            Atualizado em: {formatDate(item.updatedAt)}
                                        </div>
                                    </div>
                                    <Button
                                        variant={item.quantity > 0 ? "primary" : "secondary"}
                                        className="w-100"
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setShowModal(true);
                                        }}
                                        disabled={item.quantity === 0 || item.status !== 'active'}
                                    >
                                        <Cart className="me-2" />
                                        {item.quantity > 0 && item.status === 'active' ? "Vender" : "Indisponível"}
                                    </Button>
                                    <Button
                                        variant="info"
                                        className="w-100 mt-2"
                                        onClick={() => {
                                            setSelectedItem(item);
                                            setShowEditStockModal(true);
                                        }}
                                        disabled={item.status !== 'active'}
                                    >
                                        <Box className="me-2" />
                                        Atualizar Estoque
                                    </Button>
                                    <ShowIfAdmin>
                                        <Button
                                            variant= "warning"
                                            className="w-100 mt-2"
                                            onClick={() => {
                                                setSelectedItem(item);
                                                setShowCloseModal(true);
                                            }}
                                            disabled={item.status !== 'active'}
                                        >
                                            Fechar Item
                                        </Button>
                                    </ShowIfAdmin>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}



            {selectedItem && (
                <>
                    <ItemSaleModal
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        item={selectedItem}
                        onSaleQueued={handleSaleSuccess}
                    />
                    <CloseItemModal
                        show={showCloseModal}
                        handleClose={() => setShowCloseModal(false)}
                        item={selectedItem}
                        onClose={handleSaleClose}
                    />
                    <EditStockModal
                        show={showEditStockModal}
                        handleClose={() => setShowEditStockModal(false)}
                        item={selectedItem}
                        onStockUpdated={() => {
                            addNotification('Estoque atualizado com sucesso!', 'success');
                            fetchItems();
                        }}
                    />
                </>
            )}
            <AddItemModal
                show={showAddModal}
                handleClose={() => setShowAddModal(false)}
                onItemCreated={() => {
                    addNotification('Item criado com sucesso!', 'success');
                    fetchItems();
                }}
            />
        </div>
    );
};

export default StandaloneSalesPage;