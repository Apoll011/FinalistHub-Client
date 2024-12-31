import React, { useState, useEffect } from 'react';
import {Modal, Button, Form, Col, Row, Card, Alert, Spinner} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import {
    EventDetailsResponse,
    EventsApi,
    Ticket,
    Item,
    ItemCreate, ObservationInput, DateInput, AccountResponse, FinanceApi
} from 'api';
import {getStatusBadge} from "pages/dashboard/events/EventsPage.tsx";
import {useAuth} from "hooks/useAuth.tsx";

const EditEventPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [accounts, setAccounts] = useState<AccountResponse[]>([]);
    const [event, setEvent] = useState<EventDetailsResponse | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [items, setItems] = useState<Item[]>([]);
    const [accountId, setAccountId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();
    const eventsApi = new EventsApi();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEventData().then(() => console.log("Dados refrescados"));
        const intervalId = setInterval(() => {
            fetchEventData().then(() => console.log("Dados refrescados"));
        }, 100000);

        return () => clearInterval(intervalId);
    }, [id]);

    const fetchEventData = async () => {
        try {
            const [eventDetailsResult, eventTicketsResult, eventItemsResult, accountResults] = await Promise.allSettled([
                eventsApi.getEventDetailsEventsEventIdDetailsGet({ eventId: id as string }),
                eventsApi.getEventTicketsEventsEventIdTicketsGet({ eventId: id as string }),
                eventsApi.getEventItemsEventsEventIdItemsGet({ eventId: id as string }),
                new FinanceApi().getAccountsFinanceAccountsGet()
        ]);

            // Handle each result independently
            if (eventDetailsResult.status === 'fulfilled') {
                setEvent(eventDetailsResult.value);
            } else {
                console.warn('Failed to fetch event details:', eventDetailsResult.reason);
            }

            if (eventTicketsResult.status === 'fulfilled') {
                setTickets(eventTicketsResult.value);
            } else if (eventTicketsResult.reason?.response?.status === 404) {
                console.info('Tickets not found (404)');
                setTickets([]); // Default to an empty list
            } else {
                console.warn('Failed to fetch tickets:', eventTicketsResult.reason);
            }

            if (eventItemsResult.status === 'fulfilled') {
                setItems(eventItemsResult.value);
            } else if (eventItemsResult.reason?.response?.status === 404) {
                console.info('Items not found (404)');
                setItems([]); // Default to an empty list
            } else {
                console.warn('Failed to fetch items:', eventItemsResult.reason);
            }

            if (accountResults.status === 'fulfilled') {
                setAccounts(accountResults.value);
            }  else {
                console.warn('Failed to fetch accounts:', accountResults.reason);
            }

            setLoading(false);
        } catch (error) {
            setError('Um erro inesperado occoreu: ' + error);
            setLoading(false);
        }

    };

    const handleModalOpen = (type: string) => {
        setModalType(type);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setModalType('');
    };

    const handleAddTicket = async (formData: {type: string, price: number}) => {
        try {
            setLoading(true);
            await eventsApi.createTicketEventsEventIdTicketsPost({
                eventId: id as string,
                ticketCreate: {
                    type: formData.type,
                    price: parseFloat(String(formData.price)),
                }
            });
            await fetchEventData();
            handleModalClose();
        } catch {
            setError('Erro ao adicionar bilhete!');
        }
        setLoading(false);
    };

    const handleAddItem = async (formData: ItemCreate) => {
        try {
            setLoading(true);
            await eventsApi.addEventItemsEventsEventIdItemsPost({
                eventId: id as string,
                itemCreate: {
                    name: formData.name,
                    quantity: parseInt(String(formData.quantity)),
                    price: parseFloat(String(formData.price))
                }
            });
            await fetchEventData();
            handleModalClose();
        } catch  {
            setError('Erro ao adicionar Item!');
        }
        setLoading(false);
    };

    const handleAddObservation = async (formData: ObservationInput) => {
        try {
            setLoading(true);
            await eventsApi.addObservationEventsEventIdObservationsPost({
                eventId: id as string,
                observationInput: {
                    content: formData.content
                }
            });
            await fetchEventData();
            handleModalClose();
        } catch  {
            setError('Erro ao adicionar observação');
        }
        setLoading(false);
    };

    const handleEventAction = async (action: string, dateInput: DateInput = {date: "", time: ""}) => {
        try {
            setLoading(true);
            switch (action) {
                case 'cancel':
                    await eventsApi.cancelEventEventsEventIdCancelPatch({eventId: id as string});
                    break;
                case 'reschedule':
                    await eventsApi.rescheduleEventEventsEventIdReschedulePatch({
                        eventId: id as string,
                        dateInput: dateInput
                    });
                    break;
                case 'close':
                    if (!accountId) throw Error("Expected Account!")
                    await eventsApi.closeEventEventsEventClosePost({closeEventRequest: {eventId: id as string, userId: user?.id.toString() as string, toAccountId: accountId as string}});
                    break;
                case 'reopen':
                    await eventsApi.reopenEventEventsEventIdReopenPatch({eventId: id as string});
                    break;
            }
            setAccountId(null);
            await fetchEventData();
            handleModalClose();
        } catch (err) {
            setError(`Erro ao ${action} evento ` + err);
        }
        setLoading(false);
    };

    if (loading && !event) return <div className="text-center py-5">
        <Spinner animation="border" variant="primary"/>
    </div>;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!event) return <Alert variant="warning">Evento não encontrado</Alert>;

    return (
        <div className="container my-5">
            <h1 className="mb-4">Editar Evento: {event.name}</h1>

            <Card className="mb-4">
                <Card.Body>
                    <h5>Informações Gerais</h5>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome do Evento</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={event.name}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Data</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={event.date}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Local</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={event.location}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Estado</Form.Label>
                                    <br/>
                                    {getStatusBadge(event.status)}
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Body>
                    <h5>Bilhetes</h5>
                    <Button onClick={() => handleModalOpen('ticket')} className="mb-3">
                        Adicionar Bilhetes
                    </Button>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Preço</th>
                                <th>Disponivel</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tickets.map((ticket, index) => (
                                <tr key={index}>
                                    <td>{ticket.type}</td>
                                    <td>{ticket.price}$</td>
                                    <td>{ticket.available ? "Yes" : "No"}</td>
                                    <td><Button
                                        variant="primary"
                                        className="me-2"
                                        onClick={() => {
                                            new EventsApi().changeAvailabilityEventsTicketIdAvailablePatch({
                                                ticketId: ticket.id,
                                                available: !ticket.available
                                            });
                                            fetchEventData();
                                        }}
                                        disabled={event.status !== 'active' || loading}
                                    >
                                        {ticket.available ? "Fora de Estoque" : "Em Estoque"}
                                    </Button>
                                        <Button
                                            variant="danger"
                                            className="me-2"
                                            onClick={() => {
                                                new EventsApi().deleteTicketEventsEventIdTicketsDelete({
                                                    eventId: event.id,
                                                    ticketId: ticket.id
                                                });
                                                fetchEventData();
                                            }}
                                            disabled={event.status !== 'active' || loading}
                                        >
                                            Deletar
                                        </Button></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Body>
                    <h5>Items</h5>
                    <Button onClick={() => handleModalOpen('item')} className="mb-3">
                        Adicionar Item
                    </Button>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Preço</th>
                                <th>Quantidade</th>
                                <th>Ações</th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.price}$</td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            className="me-2"
                                            onClick={() => {
                                                new EventsApi().deleteItemEventsEventIdItemsDelete({
                                                    eventId: event.id,
                                                    itemId: item.id
                                                });
                                                fetchEventData();
                                            }}
                                            disabled={event.status !== 'active' || loading}
                                        >
                                            Deletar
                                        </Button></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Body>
                    <h5>Observações</h5>
                    <Button onClick={() => handleModalOpen('observation')} disabled={loading} className="mb-3">
                        Adicionar Observações
                    </Button>
                    <ul className="list-unstyled">
                        {event.observations?.map((obs, index) => (
                            <li key={index} className="mb-2">{obs.content}</li>
                        ))}
                    </ul>
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Body>
                    <h5>Ações</h5>
                    <Button
                        variant="warning"
                        className="m-2"
                        onClick={() => handleModalOpen('cancel')}
                        disabled={event.status !== 'active' || loading}
                    >
                        Cancelar Evento
                    </Button>
                    <Button
                        variant="primary"
                        className="m-2"
                        onClick={() => handleModalOpen('reschedule')}
                        disabled={event.status !== 'active' || loading}
                    >
                        Reagendar Evento
                    </Button>
                    <Button
                        variant="success"
                        className="m-2"
                        onClick={() => handleModalOpen('close')}
                        disabled={event.status !== 'active' || loading}
                    >
                        Fechar Evento
                    </Button>
                    <Button
                        variant="success"
                        className="m-2"
                        onClick={() => handleModalOpen('reopen')}
                        disabled={event.status !== 'cancelled' || loading}
                    >
                        Reabrir Evento
                    </Button>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === 'ticket' && 'Add New Ticket'}
                        {modalType === 'item' && 'Add New Item'}
                        {modalType === 'observation' && 'Add Observation'}
                        {modalType === 'cancel' && 'Cancel Event'}
                        {modalType === 'reschedule' && 'Reschedule Event'}
                        {modalType === 'close' && 'Close Event'}
                        {modalType === 'reopen' && 'Reopen Event'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalType === 'ticket' && (
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            const target = e.target as HTMLFormElement;
                            handleAddTicket({
                                type: target.type.value,
                                price: target.price.value
                            }).then(() => console.log("Adding Ticket"));
                        }}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipo do Bilhete</Form.Label>
                                <Form.Control type="text" name="type" required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Preço</Form.Label>
                                <Form.Control type="number" name="price" step="0.01" required />
                            </Form.Group>
                            <Button disabled={loading} type="submit">Adicionar Bilhete</Button>
                        </Form>
                    )}

                    {modalType === 'item' && (
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            const target = e.target as HTMLFormElement;
                            handleAddItem({
                                name: target.iname.value,
                                quantity: target.quantity.value,
                                price: target.price.value
                            }).then(() => console.log("Adding Item"));
                        }}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nome do Item</Form.Label>
                                <Form.Control type="text" name="iname" required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Quantidade</Form.Label>
                                <Form.Control type="number" name="quantity" required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Preço</Form.Label>
                                <Form.Control type="number" name="price" step="0.01" required />
                            </Form.Group>
                            <Button disabled={loading}  type="submit">Add Item</Button>
                        </Form>
                    )}

                    {modalType === 'observation' && (
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            const target = e.target as HTMLFormElement;
                            handleAddObservation({
                                content: target.content.value
                            }).then(() => console.log("Adding Item"));
                        }}>
                            <Form.Group className="mb-3">
                                <Form.Label>Observação</Form.Label>
                                <Form.Control as="textarea" name="content" rows={3} required />
                            </Form.Group>
                            <Button disabled={loading}  type="submit">Adicionar Observação</Button>
                        </Form>
                    )}

                    {modalType === 'reschedule' && (
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            const target = e.target as HTMLFormElement;
                            handleEventAction('reschedule', {date: target.date.value, time:   target.time.value});
                        }}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nova Data (Atenção Mês/Dia/Ano eu sei Irritante))</Form.Label>
                                <Form.Control type="date" name="date" id="date" defaultValue={event.date} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nova Hora</Form.Label>
                                <Form.Control type="time" name="time" id="time" defaultValue={event.time} required />
                            </Form.Group>
                            <Button disabled={loading}  type="submit">Reagendar</Button>
                        </Form>
                    )}

                    {(modalType === 'cancel' || modalType === 'close' || modalType === 'reopen') && (
                        <div>
                            <p>Tems certeza que queres {modalType} este evento?</p>
                            {modalType === 'close' && (
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
                            )}
                            <Button
                                disabled={loading}
                                variant={modalType === 'cancel' ? 'warning' : 'success'}
                                onClick={() => handleEventAction(modalType)}
                            >
                                Confirmar {modalType}
                            </Button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EditEventPage;