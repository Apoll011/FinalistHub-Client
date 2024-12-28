import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Button, Modal, Form, Toast, ToastContainer, Badge } from 'react-bootstrap';
import { Cart, CurrencyDollar, People, Tag } from 'react-bootstrap-icons';
import { SalesApi, TicketAvailability, TicketSaleCreate } from "api";
import { useParams } from "react-router-dom";

// Queue for processing sales
class SalesQueue {
    private queue: TicketSaleCreate[] = [];
    private processing = false;

    async addSale(sale: TicketSaleCreate, onSuccess: () => void, onError: (error: Error | never | unknown) => void) {
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
            await SaleApi.sellTickets(sale);
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
    sellTickets: (data: TicketSaleCreate) => new SalesApi().sellTicketsSalesTicketsPost({ticketSaleCreate: data}),
    getEventTickets: (eventId: string) => new SalesApi().checkTicketAvailabilitySalesTicketsEventIdAvailabilityGet({eventId: eventId})
};

interface Notification {
    id: number;
    message: string;
    variant: string;
}

const TicketSaleModal: React.FC<{
    show: boolean;
    handleClose: () => void;
    ticket: TicketAvailability;
    onSaleQueued: () => void;
}> = ({ show, handleClose, ticket, onSaleQueued }) => {
    const [form, setForm] = useState({ ticketId: '', quantity: 1 });

    useEffect(() => {
        if (ticket) {
            setForm({ ticketId: ticket.ticketId, quantity: 1 });
        }
    }, [ticket]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        salesQueue.addSale(
            form,
            () => onSaleQueued(),
            (error) => console.error('Sale failed:', error)
        );
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    <Cart className="me-2" />
                    Vender {ticket?.ticketType}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                        <div>
                            <Tag className="me-2" />
                            <span className="fw-bold">Preço:</span>
                        </div>
                        <span className="text-primary fw-bold">${ticket?.price}</span>
                    </div>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">
                            <People className="me-2" />
                            Quantidade
                        </Form.Label>
                        <Form.Control
                            type="number"
                            value={form.quantity}
                            onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
                            required
                            min="1"
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

const TicketSalesPage = () => {
    const [tickets, setTickets] = useState<TicketAvailability[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<TicketAvailability|null>(null);
    const [showModal, setShowModal] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { eventId } = useParams();

    const addNotification = (message: string, variant: string) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, variant }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    const fetchTickets = useCallback(async () => {
        try {
            const [ticketData] = await Promise.allSettled([
                SaleApi.getEventTickets(eventId as string)
            ]);
            if (ticketData.status === 'fulfilled') {
                setTickets(ticketData.value.tickets);
            } else if (ticketData.reason?.response?.status === 404) {
                addNotification("Esse evento não possui bilhetes", "danger");
                setTickets([]);
            }
        } catch (error) {
            addNotification(`Erro: ${error}`, "danger");
        }
    }, [eventId]);

    useEffect(() => {
        fetchTickets();
        const intervalId = setInterval(fetchTickets, 50000);
        return () => clearInterval(intervalId);
    }, [fetchTickets]);

    const handleSaleSuccess = () => {
        addNotification('Venda registrada com sucesso!', 'success');
        fetchTickets();
    };

    return (
        <div className="p-4">
            <ToastContainer position="top-end" className="p-3">
                {notifications.map(({ id, message, variant }) => (
                    <Toast key={id} onClose={() => setNotifications(prev => prev.filter(n => n.id !== id))}>
                        <Toast.Header className={`bg-${variant} text-white`}>
                            <strong className="me-auto">Notificação</strong>
                        </Toast.Header>
                        <Toast.Body>{message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0">
                    Venda de Bilhetes
                </h1>
                <div className="bg-light p-2 rounded">
                    <CurrencyDollar className="me-2" />
                    Total de bilhetes: {tickets.length}
                </div>
            </div>

            <Row className="g-4">
                {tickets.map((ticket) => (
                    <Col key={ticket.ticketId} md={4}>
                        <Card className="h-100 shadow-sm hover-shadow">
                            <Card.Body>
                                <Card.Title className="d-flex justify-content-between align-items-center">
                                    <span>
                                        <Tag className="me-2" />
                                        {ticket.ticketType}
                                    </span>
                                    <Badge bg={ticket.available ? "success" : "danger"}>
                                        {ticket.available ? "Disponível" : "Indisponível"}
                                    </Badge>
                                </Card.Title>
                                <hr />
                                <div className="d-flex justify-content-between mb-3">
                                    <div>
                                        <CurrencyDollar className="me-1" />
                                        <span className="fw-bold">${ticket.price}</span>
                                    </div>
                                    <div>
                                        <People className="me-1" />
                                        <span>Vendidos: {ticket.totalSold}</span>
                                    </div>
                                </div>
                                <Button
                                    variant={ticket.available ? "primary" : "secondary"}
                                    className="w-100"
                                    onClick={() => {
                                        setSelectedTicket(ticket);
                                        setShowModal(true);
                                    }}
                                    disabled={!ticket.available}
                                >
                                    <Cart className="me-2" />
                                    {ticket.available ? "Vender" : "Indisponível"}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {selectedTicket && (
                <TicketSaleModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    ticket={selectedTicket}
                    onSaleQueued={handleSaleSuccess}
                />
            )}
        </div>
    );
};

export default TicketSalesPage;