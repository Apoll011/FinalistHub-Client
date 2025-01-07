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
        <Row className="my-6">
            <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
                <Card className="h-100">
                    <Card.Body>
                        <h2 className="text-xl font-semibold mb-4">Calendário de Eventos</h2>
                        { eventsByDate ? (
                            <Calendar
                                onClickDay={handleDayClick}
                                tileClassName={({ date }) => {
                                    const dateString = date.toISOString().split("T")[0];
                                    return eventsByDate[dateString] ? "fw-bold text-white bg-warning" : "";
                                }}
                                tileContent={({ date }) => {
                                    const dateString = date.toISOString().split("T")[0];
                                    return eventsByDate[dateString] ? (
                                        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-1">
                                            <div className="rounded-circle bg-danger" style={{ width: '4px', height: '4px' }}></div>
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
            <Col xl={8} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
                <Card className="h-100">
                    <Card.Body>
                        {eventsByDate && selectedDate ? (
                            <div className="h-full">
                                <h3 className="text-lg font-semibold mb-4">
                                    Eventos em {selectedDate.toString()}
                                </h3>
                                <div className="overflow-y-auto overflow-x-hidden" style={{ height: "50vh" }}>
                                    <div className="row g-3 px-2">
                                        {eventsByDate[selectedDate].map((event) => (
                                            <div className="col-md-6" key={event.id}>
                                                <Card
                                                    className="h-100"
                                                    style={{cursor: "pointer"}}
                                                    onClick={() => handleEditClick(event.id)}
                                                >
                                                    <Card.Body>
                                                        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
                                                            <div className="text-lg font-bold mb-2">{event.name}</div>
                                                            <div className="text-sm text-gray-600 mb-1">
                                                                <strong>Hora:</strong> {event.time}
                                                            </div>
                                                            <div className="text-sm text-gray-600 mb-1">
                                                                <strong>Local:</strong> {event.location}
                                                            </div>
                                                            <div className="text-sm text-gray-600 mb-2">
                                                                <strong>Descrição:</strong> {event.description || "Nenhuma descrição fornecida."}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                <strong>Estado:</strong> {getStatusBadge(event.status)}
                                                            </div>
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
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Nenhuma data com eventos selecionada</h3>
                                <p className="text-sm text-gray-600">Selecione um dia que tem eventos no calendário para ve-los.</p>
                            </div>
                        )}
                    </Card.Body>
                </Card>


            </Col>
        </Row>
    );
};