import {EventsApi, EventStatisticsResponse} from "api";
import {Card, Col, Row, Spinner} from "react-bootstrap";
import React from "react";
import {useCachedData} from "hooks/useCachedData.ts";
import {formatCurrency} from "utils/currency.ts";
import {TIMES} from "utils/times.ts";

export const EventSummary = () => {
    const eventsApi = new EventsApi();
    
    const data = useCachedData<EventStatisticsResponse>(
        async () => await eventsApi.getEventsStatisticsEventsStatisticsGet(),
        'events-summary-cache',
        TIMES.minutes(5)
    );

    return  (
        <Card className="h-100 shadow-sm border-0">
            <Card.Body>
                { data ? (
                    <>
                        <div className="d-flex align-items-start justify-content-between mb-4">
                            <div>
                                <p className="text-uppercase text-muted fw-semibold small mb-1">Resumo de eventos</p>
                                <h4 className="mb-1">Atividade recente</h4>
                                <p className="text-muted mb-0">
                                    {new Date(data.dateRange.start).toLocaleDateString()} - {new Date(data.dateRange.end).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-end">
                                <p className="text-muted small mb-1">Receita total</p>
                                <h3 className="mb-0 text-success">{formatCurrency(data.totalRevenue)}</h3>
                            </div>
                        </div>
                        <Row className="g-3">
                            {[
                                { label: "Total de eventos", value: data.totalEvents, color: "primary", icon: "fe-calendar" },
                                { label: "Eventos ativos", value: data.activeEvents, color: "success", icon: "fe-check-circle" },
                                { label: "Eventos fechados", value: data.closedEvents, color: "warning", icon: "fe-lock" },
                                { label: "Eventos cancelados", value: data.cancelledEvents, color: "danger", icon: "fe-x-circle" },
                            ].map((item) => (
                                <Col sm={6} xl={3} key={item.label}>
                                    <div className="p-3 rounded-3 bg-light h-100">
                                        <div className={`text-${item.color} mb-2`}>
                                            <i className={`fe ${item.icon} fs-4`}></i>
                                        </div>
                                        <div className="fw-semibold small text-muted">{item.label}</div>
                                        <div className="fw-bold fs-3">{item.value}</div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </>
                ) : (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary"/>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};
