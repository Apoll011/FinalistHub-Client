import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Form, Alert } from 'react-bootstrap';
import {SalesApi, TicketAvailability, TicketSaleCreate} from "api";
import {useParams} from "react-router-dom";

const SaleApi = {
    sellTickets: (data: TicketSaleCreate) => new SalesApi().sellTicketsSalesTicketsPost({ticketSaleCreate: data}),
    getEventTickets: (eventId: string) => new SalesApi().checkTicketAvailabilitySalesTicketsEventIdAvailabilityGet({eventId: eventId})
};

const TicketSaleModal: React.FC<{ show: boolean, handleClose: () => void, ticket: TicketAvailability, handleSaleSuccess: () => void }> = ({ show, handleClose, ticket, handleSaleSuccess }) => {
    const [form, setForm] = useState({ ticketId: '', quantity: 1 });
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

    useEffect(() => {
        if (ticket) {
            setForm({ ticketId: ticket.ticketId, quantity: 1 });
        }
    }, [ticket]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await SaleApi.sellTickets(form);
            handleSaleSuccess();
        } catch (error) {
            setAlert({ show: true, message: "Erro: " + error, variant: 'danger' });
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Vender bilhete {ticket?.ticketType}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {alert.show && (
                    <Alert variant={alert.variant} onClose={() => setAlert({ show: false, message: "", variant: "" })} dismissible>
                        {alert.message}
                    </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control
                            type="number"
                            value={form.quantity}
                            onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
                            required
                            min="1"
                        />
                    </Form.Group>
                    <div className="text-end">
                        <Button variant="secondary" className="me-2" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            Vender
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
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const { eventId } = useParams();

    const fetchTickets = async () => {
        try {
            const [ticketData] = await Promise.allSettled([
                SaleApi.getEventTickets(eventId as string)
            ]);
            if (ticketData.status === 'fulfilled') {
                setTickets(ticketData.value.tickets);
            } else if (ticketData.reason?.response?.status === 404) {
                setAlert({ show: true, message: "Esse evento não possui bilhetes", variant: 'danger' });
                setTickets([]);
            } else {
                console.warn('Failed to fetch tickets:', ticketData.reason);
            }

        } catch (error) {
            setAlert({ show: true, message: "Erro: " + error, variant: 'danger' });
        }
    };

    useEffect(() => {
        fetchTickets().then(() => console.log("Dados refrescados"));
        const intervalId = setInterval(() => {
            fetchTickets().then(() => console.log("Dados refrescados"));
        }, 50000);

        return () => clearInterval(intervalId);
    }, [eventId]);

    const handleSaleSuccess = () => {
        setAlert({ show: true, message: 'Vendido com sucesso!', variant: 'success' });
        setShowModal(false);
        fetchTickets().then(() => console.log("Dados refrescados"));
    };

    return (
        <div className="p-4">
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ show: false, message: "", variant: "" })} dismissible>
                    {alert.message}
                </Alert>
            )}
            <h1 className="mb-4">Venda de Bilhetes</h1>
            <Row>
                {tickets.map((ticket) => (
                    <Col key={ticket.ticketId} md={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{ticket.ticketType}</Card.Title>
                                <Card.Text>Preço: ${ticket.price}</Card.Text>
                                <Card.Text>Vendido: {ticket.totalSold}</Card.Text>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        setSelectedTicket(ticket);
                                        setShowModal(true);
                                    }}
                                    disabled={!ticket.available}
                                >
                                    Vender
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
                    handleSaleSuccess={handleSaleSuccess}
                />
            )}
        </div>
    );
};

export default TicketSalesPage;
