import React, { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Form, Button, Table, Modal, Toast, ToastContainer } from 'react-bootstrap';
import {
    Cart, BoxSeam, CashCoin, Plus, ArrowRepeat,
    ExclamationTriangle, Search, Archive
} from 'react-bootstrap-icons';
import { SalesApi, EventsApi, Item, SaleCreate, ItemCreate } from "api";
import { useParams } from "react-router-dom";

// Sales Queue for background processing
class SalesQueue {
    private queue: SaleCreate[] = [];
    private processing = false;

    async addSale(sale: SaleCreate, onSuccess: () => void, onError: (error: Error | never | unknown) => void) {
        this.queue.push(sale);
        if (!this.processing) {
            this.processQueue(onSuccess, onError);
        }
    }

    private async processQueue(onSuccess: () => void, onError: (error: Error | never | unknown) => void) {
        if (this.processing || this.queue.length === 0) return;

        this.processing = true;
        const sale = this.queue.shift()!;

        try {
            await SaleApi.sellStockItem(sale);
            onSuccess();
        } catch (error) {
            onError(error);
        } finally {
            this.processing = false;
            if (this.queue.length > 0) {
                await this.processQueue(onSuccess, onError);
            }
        }
    }
}

const salesQueue = new SalesQueue();

const SaleApi = {
    sellStockItem: (data: SaleCreate) => new SalesApi().sellStockItemSalesStockItemsPost({saleCreate: data}),
    registerItem: (id: string, data: ItemCreate) => new EventsApi().addEventItemsEventsEventIdItemsPost({eventId: id, itemCreate: data}),
    getInventoryAlerts: (id: string, threshold: number) => new SalesApi().getInventoryAlertsSalesInventoryAlertsEventIdGet({eventId: id, threshold: threshold}),
    createBulkSale: (data: SaleCreate[]) => new SalesApi().createBulkSaleSalesBulkSalePost({saleCreate: data}),
    getEventItems: (eventId: string) => new EventsApi().getEventItemsEventsEventIdItemsGet({eventId: eventId}),
    updateItemQuantity: (itemId: string, quantity: number) =>
        new EventsApi().updateItemQuantityEventsItemsItemIdQuantityPut({
            itemId: itemId,
            quantity: quantity
        }),
};

interface Notification {
    id: number;
    message: string;
    variant: string;
}

export const SalesDashboard = () => {
    const [showSaleModal, setShowSaleModal] = useState(false);
    const [selectedItemForRecount, setSelectedItemForRecount] = useState<Item | null>(null);
    const [recountQuantity, setRecountQuantity] = useState<number>(0);
    const [showRecountModal, setShowRecountModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { id } = useParams();
    const [items_list, setItemsList] = useState<Item[]>([]);
    const [threshold, setThreshold] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const [saleForm, setSaleForm] = useState({
        itemId: "",
        quantitySold: 1
    });

    const addNotification = (message: string, variant: string) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, variant }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    const fetchData = useCallback(async () => {
        try {
            const [items] = await Promise.allSettled([
                SaleApi.getEventItems(id as string)
            ]);
            if (items.status === 'fulfilled') {
                setItemsList(items.value);
            } else if (items.reason?.response?.status === 404) {
                addNotification("Esse evento não possui Items", 'danger');
            }
        } catch (error) {
            addNotification(`Erro: ${error}`, 'danger');
        }
    }, [id, threshold]);

    const filteredItems = items_list.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [registerForm, setRegisterForm] = useState({
        name: '',
        price: 0,
        quantity: 0,
        eventId: id as string
    });

    const handleItemClick = (item: Item) => {
        setSelectedItem(item);
        setSaleForm(prev => ({
            ...prev,
            itemId: item.id
        }));
        setShowSaleModal(true);
    };

    const handleSale = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedItem) {
            addNotification('No item selected', 'danger');
            return;
        }

        salesQueue.addSale(
            saleForm,
            () => {
                addNotification('Venda registrada com sucesso!', 'success');
                setSaleForm({ itemId: "", quantitySold: 1 });
                setSelectedItem(null);
                fetchData();
            },
            (error) => {
                addNotification(`Erro: ${error}`, 'danger');
            }
        );
        setShowSaleModal(false);
    };

    const handleRegisterItem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await SaleApi.registerItem(registerForm.eventId, registerForm);
            addNotification('Item registrado com sucesso!', 'success');
            setShowRegisterModal(false);
            setRegisterForm({ name: '', price: 0, quantity: 0, eventId: id as string });
            fetchData();
        } catch (error) {
            addNotification(`Erro: ${error}`, 'danger');
        }
    };

    const handleRecount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedItemForRecount || !id) {
            addNotification('No item selected for recount', 'danger');
            return;
        }

        try {
            await SaleApi.updateItemQuantity(selectedItemForRecount.id, recountQuantity);
            addNotification('Item atualizado com sucesso!', 'success');
            setShowRecountModal(false);
            setSelectedItemForRecount(null);
            setRecountQuantity(0);
            fetchData();
        } catch (error) {
            addNotification(`Erro: ${error}`, 'danger');
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 50000);
        return () => clearInterval(intervalId);
    }, [fetchData]);

    return (
        <div className="p-4">
            <ToastContainer position="top-end" className="p-3">
                {notifications.map(({ id, message, variant }) => (
                    <Toast key={id} onClose={() =>
                        setNotifications(prev => prev.filter(n => n.id !== id))
                    }>
                        <Toast.Header className={`bg-${variant} text-white`}>
                            <strong className="me-auto">Notificação</strong>
                        </Toast.Header>
                        <Toast.Body>{message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>

            <Row className="mb-4 align-items-center">
                <Col>
                    <h1 className="mb-0">
                        <BoxSeam className="me-2" />
                        Gestão de Stock
                    </h1>
                </Col>
                <Col className="text-end">
                    <Button
                        variant="primary"
                        className="d-inline-flex align-items-center"
                        onClick={() => setShowRegisterModal(true)}
                    >
                        <Plus className="me-2" />
                        Registrar Item
                    </Button>
                </Col>
            </Row>

            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                            <Archive className="me-2"/>
                            Inventário
                        </h5>
                        <div className="d-flex align-items-center">
                            <h5 className="mb-0">
                                <ExclamationTriangle className="me-2 text-warning"/>
                                Alertas de Stock
                            </h5>
                            <Form.Group className="me-4 d-flex align-items-center">
                                <Form.Label className="me-2 mb-0">Limite:</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={threshold}
                                    onChange={(e) => setThreshold(parseInt(e.target.value))}
                                    min="1"
                                    style={{width: '100px'}}
                                />
                            </Form.Group>
                            <div className="position-relative">
                                <Search
                                    className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"/>
                                <Form.Control
                                    type="text"
                                    placeholder="Pesquisar items..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="ps-5"
                                />
                            </div>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Table responsive hover>
                        <thead className="table-light">
                        <tr>
                            <th>Nome</th>
                            <th>Quantidade</th>
                            <th>Preço</th>
                            <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item: Item) => (
                                <tr
                                    key={item.id}
                                    className={`align-middle ${item.quantity <= threshold ? 'table-warning' : ''}`}
                                >
                                    <td>{item.name}</td>
                                    <td>
                                            <span className={`badge bg-${
                                                item.quantity === 0 ? 'danger' :
                                                    item.quantity <= threshold ? 'warning' :
                                                        'success'
                                            }`}>
                                                {item.quantity}
                                            </span>
                                    </td>
                                    <td>
                                        <CashCoin className="me-1" />
                                        {item.price.toFixed(2).replace(".", "$")}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleItemClick(item)}
                                            >
                                                <Cart className="me-1" />
                                                Vender
                                            </Button>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedItemForRecount(item);
                                                    setRecountQuantity(item.quantity);
                                                    setShowRecountModal(true);
                                                }}
                                            >
                                                <ArrowRepeat className="me-1" />
                                                Recontar
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-4">
                                    <BoxSeam className="me-2" size={24} />
                                    Sem Items
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showSaleModal} onHide={() => setShowSaleModal(false)} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>
                        <Cart className="me-2" />
                        Nova Venda de {selectedItem?.name || ''}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                            <div>
                                <BoxSeam className="me-2" />
                                <span className="fw-bold">Estoque Disponível:</span>
                            </div>
                            <span className={`badge bg-${
                                selectedItem?.quantity === 0 ? 'danger' :
                                    selectedItem?.quantity && selectedItem?.quantity <= threshold ? 'warning' :
                                        'success'
                            }`}>
                                {selectedItem?.quantity || 0}
                            </span>
                        </div>
                    </div>
                    <Form onSubmit={handleSale}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                                <Cart className="me-2" />
                                Quantidade
                            </Form.Label>
                            <Form.Control
                                type="number"
                                value={saleForm.quantitySold}
                                onChange={(e) => setSaleForm({ ...saleForm, quantitySold: parseInt(e.target.value) })}
                                required
                                min="1"
                                max={selectedItem?.quantity}
                                className="form-control-lg"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="outline-secondary" onClick={() => setShowSaleModal(false)}>
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={!selectedItem?.quantity}
                            >
                                <Cart className="me-2" />
                                Confirmar Venda
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showRecountModal} onHide={() => setShowRecountModal(false)} centered>
                <Modal.Header closeButton className="bg-secondary text-white">
                    <Modal.Title>
                        <ArrowRepeat className="me-2" />
                        Recontar {selectedItemForRecount?.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                            <div>
                                <BoxSeam className="me-2" />
                                <span className="fw-bold">Estoque Atual:</span>
                            </div>
                            <span className="badge bg-secondary">
                                {selectedItemForRecount?.quantity || 0}
                            </span>
                        </div>
                    </div>
                    <Form onSubmit={handleRecount}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                                <ArrowRepeat className="me-2" />
                                Nova Quantidade
                            </Form.Label>
                            <Form.Control
                                type="number"
                                value={recountQuantity}
                                onChange={(e) => setRecountQuantity(parseInt(e.target.value))}
                                required
                                min="0"
                                className="form-control-lg"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowRecountModal(false)}
                            >
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                <ArrowRepeat className="me-2" />
                                Atualizar Quantidade
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} centered>
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title>
                        <Plus className="me-2" />
                        Registrar Novo Item
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleRegisterItem}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                                <Archive className="me-2" />
                                Nome
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={registerForm.name}
                                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                                required
                                className="form-control-lg"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                                <CashCoin className="me-2" />
                                Preço
                            </Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                value={registerForm.price}
                                onChange={(e) => setRegisterForm({ ...registerForm, price: parseFloat(e.target.value) })}
                                required
                                className="form-control-lg"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">
                                <BoxSeam className="me-2" />
                                Quantidade Inicial
                            </Form.Label>
                            <Form.Control
                                type="number"
                                value={registerForm.quantity}
                                onChange={(e) => setRegisterForm({ ...registerForm, quantity: parseInt(e.target.value) })}
                                required
                                min="0"
                                className="form-control-lg"
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="outline-secondary" onClick={() => setShowRegisterModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="success" type="submit">
                                <Plus className="me-2" />
                                Registrar Item
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default SalesDashboard;