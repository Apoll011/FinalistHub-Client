import React, {useEffect, useState} from 'react';
import { Card, Row, Col, Form, Button, Table, Modal, Alert } from 'react-bootstrap';
import {SalesApi, EventsApi, Item, SaleCreate, ItemCreate, InventoryAlertResponse} from "api";
import {useParams} from "react-router-dom";

const SaleApi = {
    sellStockItem: (data: SaleCreate) => new SalesApi().sellStockItemSalesStockItemsPost({saleCreate: data}),
    registerItem: (id: string, data: ItemCreate) => new EventsApi().addEventItemsEventsEventIdItemsPost({eventId: id, itemCreate: data}),
    getInventoryAlerts: (id: string, threshold: number) => new SalesApi().getInventoryAlertsSalesInventoryAlertsEventIdGet({eventId: id ,threshold: threshold}),
    createBulkSale: (data: SaleCreate[]) => new SalesApi().createBulkSaleSalesBulkSalePost({saleCreate: data}),
    getEventItems: (eventId: string) => new EventsApi().getEventItemsEventsEventIdItemsGet({eventId: eventId}),
    updateItemQuantity: (itemId: string, quantity: number) =>
        new EventsApi().updateItemQuantityEventsItemsItemIdQuantityPut({
            itemId: itemId,
            quantity: quantity
        }),
};

export const SalesDashboard = () => {
    const [showSaleModal, setShowSaleModal] = useState(false);
    const [selectedItemForRecount, setSelectedItemForRecount] = useState<Item | null>(null);
    const [recountQuantity, setRecountQuantity] = useState<number>(0);
    const [showRecountModal, setShowRecountModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const { id } = useParams();
    const [items_list, setItemsList] = useState<Item[]>([]);
    const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlertResponse>({lowStockItems: []});
    const [threshold , setThreshold] = useState(10);

    const [saleForm, setSaleForm] = useState({
        itemId: "",
        quantitySold: 1
    });

    const fetchData = async () => {
        try {
            const [items, inventoryAlerts] = await Promise.allSettled([
                SaleApi.getEventItems(id as string),
                SaleApi.getInventoryAlerts(id as string, threshold)
            ]);
            if (items.status === 'fulfilled') {
                setItemsList(items.value);
            } else if (items.reason?.response?.status === 404) {
                setAlert({ show: true, message: "Esse evento não possui Items", variant: 'danger' });
            } else {
                console.warn('Failed to fetch items:', items.reason);
            }

            if (inventoryAlerts.status === 'fulfilled') {
                setInventoryAlerts(inventoryAlerts.value);
            } else {
                console.warn('Failed to fetch inventory alerts:', inventoryAlerts.reason);
            }


        } catch (error) {
            setAlert({ show: true, message: "Erro: " + error, variant: 'danger' });
        }
    };


    const items: Item[] = items_list as Item[];

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
            setAlert({ show: true, message: 'No item selected', variant: 'danger' });
            return;
        }

        try {
            await SaleApi.sellStockItem(saleForm);
            setAlert({ show: true, message: 'Sale completed successfully!', variant: 'success' });
            setShowSaleModal(false);
            setSaleForm({ itemId: "", quantitySold: 1 });
            setSelectedItem(null);
        } catch (error) {
            setAlert({ show: true, message: "Erro: " + error, variant: 'danger' });
        }
        fetchData().then(() => console.log("Dados refrescados"));
    };

    const handleRegisterItem = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await SaleApi.registerItem(registerForm.eventId, registerForm);
            setAlert({ show: true, message: 'Item registered successfully!', variant: 'success' });
            setShowRegisterModal(false);
            setRegisterForm({ name: '', price: 0, quantity: 0, eventId: id as string });
        } catch (error) {
            setAlert({ show: true, message: "Erro: " + error, variant: 'danger' });
        }
        fetchData().then(() => console.log("Dados refrescados"));
    };

    const handleRecount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedItemForRecount || !id) {
            setAlert({ show: true, message: 'No item selected for recount', variant: 'danger' });
            return;
        }

        try {
            await SaleApi.updateItemQuantity(selectedItemForRecount.id, recountQuantity);
            setAlert({ show: true, message: 'Item atualizado com sucesso!', variant: 'success' });
            setShowRecountModal(false);
            setSelectedItemForRecount(null);
            setRecountQuantity(0);
            await fetchData();
        } catch (error) {
            setAlert({ show: true, message: "Erro: " + error, variant: 'danger' });
        }
    };

    useEffect(() => {
        fetchData().then(() => console.log("Dados refrescados"));
        const intervalId = setInterval(() => {
            fetchData().then(() => console.log("Dados refrescados"));
        }, 50000);

        return () => clearInterval(intervalId);
    }, [id]);

    return (
        <div className="p-4">
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ show: false,  message: "", variant: "" })} dismissible>
                    {alert.message}
                </Alert>
            )}

            <Row className="mb-4">
                <Col>
                    <h1>Vendas</h1>
                </Col>
                <Col className="text-end">
                    <Button variant="outline-primary" className="me-2" onClick={() => setShowRegisterModal(true)}>
                        Registrar Item
                    </Button>
                </Col>
            </Row>

            <Card className="mb-4">
                <Card.Header>
                    <h5 className="mb-0">Items</h5>
                </Card.Header>
                <Card.Body>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Quantidade em Stock</th>
                            <th>Preço</th>
                            <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {items && items.length > 0 ? (
                            items.map((item: Item) => (
                                <tr key={item.id}
                                    onClick={() => handleItemClick(item)}
                                    style={{cursor: "pointer"}}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price.toFixed(2).replace(".", "$")}</td>
                                    <td>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent triggering the sale modal
                                                setSelectedItemForRecount(item);
                                                setRecountQuantity(item.quantity);
                                                setShowRecountModal(true);
                                            }}
                                        >
                                            Recontar
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center">
                                    Sem Items
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Header>
                    <div className="d-flex justify-content-between">
                        <h2 className="mb-0">Itens com pouco stock</h2>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Limite</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={threshold}
                                    onChange={(e) => setThreshold(parseInt(e.target.value))}
                                    min="1"
                                />
                            </Form.Group>
                        </Form>
                    </div>

                </Card.Header>
                <Card.Body>
                    <Table responsive>
                        <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Quantidade Atual</th>
                            <th>Preço</th>
                            <th>Estado</th>
                        </tr>
                        </thead>
                        <tbody>
                        {inventoryAlerts?.lowStockItems?.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.currentQuantity}</td>
                                <td>{item.price.toFixed(2).replace(".", "$")}</td>
                                <td>
                                        <span className={`badge bg-${item.currentQuantity === 0 ? 'danger' : 'warning'}`}>
                                            {item.currentQuantity === 0 ? 'Sem Estoque' : 'Pouco Estoque'}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showSaleModal} onHide={() => setShowSaleModal(false)}>
                <Modal.Header closeButton>
                    Nova Venda de {selectedItem?.name || ''}
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSale}>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantidade</Form.Label>
                            <Form.Control
                                type="number"
                                value={saleForm.quantitySold}
                                onChange={(e) => setSaleForm({ ...saleForm, quantitySold: parseInt(e.target.value) })}
                                required
                                min="1"
                            />
                        </Form.Group>
                        <div className="text-end">
                            <Button variant="secondary" className="me-2" onClick={() => setShowSaleModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                Vender
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showRecountModal} onHide={() => setShowRecountModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Recontar {selectedItemForRecount?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleRecount}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nova Quantidade</Form.Label>
                            <Form.Control
                                type="number"
                                value={recountQuantity}
                                onChange={(e) => setRecountQuantity(parseInt(e.target.value))}
                                required
                                min="0"
                            />
                        </Form.Group>
                        <div className="text-end">
                            <Button
                                variant="secondary"
                                className="me-2"
                                onClick={() => setShowRecountModal(false)}
                            >
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                Atualizar Quantidade
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Registrar Novo Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleRegisterItem}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                value={registerForm.name}
                                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Preço</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                value={registerForm.price}
                                onChange={(e) => setRegisterForm({ ...registerForm, price: parseFloat(e.target.value) })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantidade Inicial</Form.Label>
                            <Form.Control
                                type="number"
                                value={registerForm.quantity}
                                onChange={(e) => setRegisterForm({ ...registerForm, quantity: parseInt(e.target.value) })}
                                required
                                min="0"
                            />
                        </Form.Group>
                        <div className="text-end">
                            <Button variant="secondary" className="me-2" onClick={() => setShowRegisterModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
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