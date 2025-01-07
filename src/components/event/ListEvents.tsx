import React, {useState} from "react";
import {Event, EventDetailsResponse, EventsApi} from "api";
import {useNavigate} from "react-router-dom";
import {generatePDF} from "components/pdf/PDFReport.tsx";
import {Button, Card, Col, Modal, Row, Table} from "react-bootstrap";
import {getStatusBadge} from "pages/dashboard/events/EventsPage.tsx";
import ShowIfAdmin from "components/auth/admin/show_if_admin.tsx";
import AdminOnly from "components/auth/admin/admin_only.tsx";
import {formatCurrency} from "utils/currency.ts";

export const ListEvents: React.FC<{events: Event[]}> = ({events}) => {
    const [selectedEvent, setSelectedEvent] = useState<EventDetailsResponse | null>(null);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    const handleEventClick = async (eventId: string) => {
        try {
            const data = await new EventsApi().getEventDetailsEventsEventIdDetailsGet({eventId: eventId});
            setSelectedEvent(data);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching event details:', error);
        }
    };

    const handleTicketSaleClick = (eventId: string) => {
        navigate(`/ticket/${eventId}`);
    };

    const handleItemSaleClick = (eventId: string) => {
        navigate(`/sale/${eventId}`);
    };

    const handleEditClick = (eventId: string) => {
        navigate(`/event/${eventId}`);
    };
    
    const getReport = async (reportID: string) => {
        const report = await new EventsApi().reportEventsEventIdReportGet({eventId: reportID});
        generatePDF(report).then(() => console.log("Printing..."));
    };

    return (
        <Row>
            {events.map((event) => (
                <Col key={event.id} lg={4} md={6} className="mb-4">
                    <Card style={{ cursor: 'pointer' }}>
                        <Card.Body onClick={() => handleEventClick(event.id)}>
                            <Card.Title>{event.name}</Card.Title>
                            <Card.Text>
                                <strong>Data:</strong> {event.date}<br />
                                <strong>Hora:</strong> {event.time}<br />
                                <strong>Local:</strong> {event.location}<br />
                                <strong>Estado:</strong> {getStatusBadge(event.status)}
                            </Card.Text>

                            <ShowIfAdmin>
                                <Col className={`d-flex mt-4 justify-content-end`}>
                                    <Button variant="outline-primary" onClick={(e) => {
                                        e.stopPropagation();
                                        getReport(event.id);
                                    }}>
                                        Gerar Relatório
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        className="ms-auto d-block"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(event.id);
                                        }}
                                    >
                                        Editar
                                    </Button>
                                </Col>
                            </ShowIfAdmin>
                            <Col className={`d-flex mt-4 justify-content-end ${event.status === "active" ? "d-block" : "d-none"}`}>
                                <Button
                                    variant="outline-secondary"
                                    className="d-block"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTicketSaleClick(event.id);
                                    }}
                                >
                                    Bilhetes
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    className="ms-2 d-block"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleItemSaleClick(event.id);
                                    }}
                                >
                                    Items
                                </Button>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            ))}

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                size="lg"
                centered
            >
                {selectedEvent && (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedEvent.name}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mb-4">
                                <h5>Detalhe de Eventos</h5>
                                <p>
                                    <strong>Data:</strong> {selectedEvent.date}<br />
                                    <strong>Hora:</strong> {selectedEvent.time}<br />
                                    <strong>Localização:</strong> {selectedEvent.location}<br />
                                    <strong>Estado:</strong> {getStatusBadge(selectedEvent.status)}<br />
                                </p>
                            </div>

                            <div className="mb-4">
                                <h5>Sumario de Vendas</h5>
                                <p><strong>Ganho Total:</strong> <AdminOnly content={formatCurrency(selectedEvent.sales.totalRevenue)}/></p>
                                <h6>Bilhetes Vendidos</h6>
                                <Table striped bordered hover size="sm" className="mb-4">
                                    <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Preço</th>
                                        <th>Quantidade Vendida</th>
                                        <th>Ganho</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedEvent.sales.ticketsSold.map((ticket, index) => (
                                        <tr key={index}>
                                            <td>{ticket.type}</td>
                                            <td>{formatCurrency(ticket.price)}</td>
                                            <td>{ticket.quantitySold}</td>
                                            <td>{formatCurrency(ticket.revenue)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>

                                <h6>Items Vendidos</h6>
                                <Table striped bordered hover size="sm">
                                    <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Quantidade Vendida</th>
                                        <th>Ganho</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedEvent.sales.itemsSold.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{formatCurrency(item.revenue)}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </Table>
                            </div>

                            {selectedEvent.observations.length > 0 && (
                                <div>
                                    <h5>Observações</h5>
                                    {selectedEvent.observations.map((observation, index) => (
                                        <p key={index}>{observation.content}</p>
                                    ))}
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <ShowIfAdmin>
                                <Button variant="primary" onClick={() => getReport(selectedEvent.id)}>
                                    Gerar Relatório
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => handleEditClick(selectedEvent.id)}
                                >
                                    Editar
                                </Button>
                            </ShowIfAdmin>
                        </Modal.Footer>
                    </>
                )}
            </Modal>
        </Row>
    )
}
