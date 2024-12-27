import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Badge, Form } from 'react-bootstrap';
import {EventsApi, Event } from "api";
import {ListEvents} from "components/event/ListEvents.tsx";
import {useAuth} from "hooks/useAuth";
import ShowIfAdmin from "components/auth/admin/show_if_admin.tsx";


const EventsPage = () => {
    const { isAdmin } = useAuth();

    const [events, setEvents] = useState<Event[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const fetchEvents = async () => {
        try {
            const data = await new EventsApi().getCalendarEventsCalendarGet();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        fetchEvents().then(() => console.log("Getting data."));
    }, []);



    const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCreateError(null);

        const target = e.target as HTMLFormElement;

        const formData = {
            name: target.ename.value,
            date: target.date.value,
            time: target.time.value,
            location: target.location.value,
            description: target.description.value
        };

        try {
            await new EventsApi().createEventEventsPost({
                eventCreate: formData
            });
            setShowCreateModal(false);
            target.reset();
        } catch (error) {
            setCreateError('Erro ao criar Evento! Tente outra vez.');
            console.error('Error creating event:', error);
        }
        fetchEvents().then(() => console.log("Getting data."));
    };


    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2>Calendário de Eventos</h2>
                </Col>
                <ShowIfAdmin>
                    <Col xs="auto">
                        <Button variant="primary" onClick={() => setShowCreateModal(isAdmin)}>
                            Criar Novo Evento
                        </Button>
                    </Col>
                </ShowIfAdmin>
            </Row>


            <ListEvents events={events}/>

            <ShowIfAdmin>
                <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Criar Novo Evento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {createError && (
                        <div className="alert alert-danger">{createError}</div>
                    )}
                    <Form onSubmit={handleCreateSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="ename"
                                placeholder="Enter event name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Data</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Hora</Form.Label>
                            <Form.Control
                                type="time"
                                name="time"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Local</Form.Label>
                            <Form.Control
                                type="text"
                                name="location"
                                placeholder="Enter location"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                rows={3}
                                placeholder="Enter event description"
                                required
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                Criar Evento
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            </ShowIfAdmin>
        </Container>
    );
};

export const getStatusBadge = (status: string) => {
    type StatusType = 'closed' | 'cancelled' | 'active';

    const statusColors: Record<StatusType, string> = {
        closed: 'success',
        cancelled: 'danger',
        active: 'info',
    };

    const statusName: Record<StatusType, string> = {
        closed: 'Fechado',
        cancelled: 'Cancelado',
        active: 'A realizar',
    };

    const normalizedStatus = status.toLowerCase() as StatusType;

    if (!Object.keys(statusColors).includes(normalizedStatus)) {
        return <Badge bg="secondary">Desconhecido</Badge>;
    }

    return (
        <Badge bg={statusColors[normalizedStatus]}>
            {statusName[normalizedStatus]}
        </Badge>
    );
};


export default EventsPage;