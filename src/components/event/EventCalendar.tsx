import {EventsApi, Event} from "api";
import React, {useState} from "react";
import {Card, Col, Row, Spinner} from "react-bootstrap";
import {Calendar} from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {useNavigate} from "react-router-dom";
import {getStatusBadge} from "pages/dashboard/events/EventsPage.tsx";
import {useCachedData} from "hooks/useCachedData.ts";
import {TIMES} from "utils/times.ts";


export const EventCalendar = () => {
    const navigate = useNavigate();

    const eventsByDate = useCachedData<{ [key: string]: Event[]; }>(
        async () => {
            return  (await new EventsApi().getCalendarEventsCalendarGet({all: true})).reduce((acc, event) => {
                const date = new Date(event.date).toISOString().split("T")[0];
                acc[date] = acc[date] || [];
                acc[date].push(event as Event);
                return acc;
            }, {} as { [key: string]: Event[] });
        },
        'events-calendar',
        TIMES.ONE_MINUTE
    );

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    
    const handleDayClick = (value: Date) => {
        if (!eventsByDate) return;
        const date = value.toISOString().split("T")[0];
        if (eventsByDate[date]) {
            setSelectedDate(date);
        } else {
            setSelectedDate(null);
        }
    };

    const handleEditClick = (eventId: string) => {
        navigate(`/event/${eventId}`);
    };

    return (
        <Row className="g-4">
            <Col xl={4} lg={12}>
                <Card className="h-100 shadow-sm border-0">
                    <Card.Body>
                        <div className="d-flex align-items-start justify-content-between mb-3">
                            <div>
                                <p className="text-uppercase text-muted fw-semibold small mb-1">Agenda</p>
                                <h4 className="mb-0">Calendário de eventos</h4>
                            </div>
                        </div>
                        { eventsByDate ? (
                            <Calendar
                                onClickDay={handleDayClick}
                                tileClassName={({ date }) => {
                                    const dateString = date.toISOString().split("T")[0];
                                    return eventsByDate[dateString] ? "fw-bold text-white bg-warning rounded-2" : "";
                                }}
                                tileContent={({ date }) => {
                                    const dateString = date.toISOString().split("T")[0];
                                    return eventsByDate[dateString] ? (
                                        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-1">
                                            <div className="rounded-circle bg-danger" style={{ width: "4px", height: "4px" }}></div>
                                        </div>
                                    ) : null;
                                }}
                            />
                        ) : (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary"/>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Col>
            <Col xl={8} lg={12}>
                <Card className="h-100 shadow-sm border-0">
                    <Card.Body>
                        {eventsByDate && selectedDate ? (
                            <div className="h-full">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div>
                                        <p className="text-uppercase text-muted fw-semibold small mb-1">Detalhes do dia</p>
                                        <h4 className="mb-0">{selectedDate.toString()}</h4>
                                    </div>
                                </div>
                                <div className="overflow-y-auto overflow-x-hidden" style={{ height: "50vh" }}>
                                    <div className="row g-3 px-1">
                                        {eventsByDate[selectedDate].map((event) => (
                                            <div className="col-md-6" key={event.id}>
                                                <Card
                                                    className="h-100 border-0 shadow-sm"
                                                    role="button"
                                                    style={{cursor: "pointer"}}
                                                    onClick={() => handleEditClick(event.id)}
                                                >
                                                    <Card.Body>
                                                        <div className="d-flex align-items-start justify-content-between mb-2">
                                                            <h5 className="mb-0">{event.name}</h5>
                                                            {getStatusBadge(event.status)}
                                                        </div>
                                                        <p className="text-muted mb-2">{event.description || "Nenhuma descrição fornecida."}</p>
                                                        <div className="small text-muted">
                                                            <div><strong>Hora:</strong> {event.time}</div>
                                                            <div><strong>Local:</strong> {event.location}</div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : !eventsByDate ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary"/>
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <h4 className="mb-2">Selecione uma data com eventos</h4>
                                <p className="text-muted mb-0">Escolha um dia marcado no calendário para ver os eventos agendados.</p>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};