import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Container, Form, Row, Spinner} from 'react-bootstrap';
import {Event, EventsApi, EventStatus, SearchEventsEventsSearchGetRequest, SearchEventsResponse} from 'api';
import {ListEvents} from "components/event/ListEvents.tsx";

const SearchEventsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useState<SearchEventsEventsSearchGetRequest>({
        query: '',
        status: null,
        startDate: '',
        endDate: ''
    });

    const fetchEventDetails = async (eventId:string) => {
        try {
            return await new EventsApi().getEventDataEventsEventIdGet({
                eventId: eventId
            });
        } catch (error) {
            console.error(`Error fetching event ${eventId}:`, error);
            return null;
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const eventIds: SearchEventsResponse = await new EventsApi().searchEventsEventsSearchGet(searchParams);
            const eventDetailsPromises:Promise<Event | null>[] = eventIds.events.map(id => fetchEventDetails(id));
            const eventDetails:(Event|null)[] = await Promise.all(eventDetailsPromises);
            setEvents(eventDetails.filter(event => event !== null));
        } catch (error) {
            console.error('Error searching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch().then(() => {});
    }, []);

    return (
        <Container fluid className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2>Pesquisar Eventos</h2>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>Pesquisar</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nome do evento..."
                                                value={searchParams.query}
                                                onChange={(e) => setSearchParams({
                                                    ...searchParams,
                                                    query: e.target.value
                                                })}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>Estado</Form.Label>
                                            <Form.Select
                                                value={searchParams.status || ''}
                                                onChange={(e) => {
                                                    setSearchParams({
                                                        ...searchParams,
                                                        status: e.target.value === '' ? null : (e.target.value as EventStatus),
                                                    });
                                                }}
                                            >
                                                <option value="">Todos</option>
                                                <option value="active">A realizar</option>
                                                <option value="closed">Fechado</option>
                                                <option value="cancelled">Cancelado</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>Data Início</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={searchParams.startDate as string}
                                                onChange={(e) => {
                                                    setSearchParams({
                                                        ...searchParams,
                                                        startDate: e.target.value as string
                                                    });
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Group>
                                            <Form.Label>Data Fim</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={searchParams.endDate as string}
                                                onChange={(e) => {
                                                    setSearchParams({
                                                        ...searchParams,
                                                        endDate: e.target.value as string
                                                    });
                                                }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="d-flex justify-content-end">
                                        <Button
                                            variant="primary"
                                            onClick={handleSearch}
                                            disabled={loading}
                                        >
                                            {loading ? <Spinner animation="border" size="sm" /> : 'Pesquisar'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {events.length === 0 ? (
                    <Col>
                        <Card>
                            <Card.Body className="text-center">
                                {loading ? <Spinner animation="border" size="sm" /> : 'Nenhum evento encontrado'}
                            </Card.Body>
                        </Card>
                    </Col>
                ) : (
                    <ListEvents events={events}/>
                )}
            </Row>
        </Container>
    );
};

export default SearchEventsPage;