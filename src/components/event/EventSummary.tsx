import {EventsApi, EventStatisticsResponse} from "api";
import {Card, Spinner} from "react-bootstrap";
import React from "react";
import AdminOnly from "components/auth/admin/admin_only.tsx";
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
        <Card className="h-100">
            <Card.Body>
                { data ? (
                    <>
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h4 className="mb-0">Sumario de Eventos</h4>
                                <p className="text-muted">
                                    Intervalo de Datas: {new Date(data.dateRange.start).toLocaleDateString()} - {new Date(data.dateRange.end).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-around mt-4">
                            <div className="text-center">
                                <i className="fe fe-calendar text-primary fs-3"></i>
                                <h1 className="mt-3 mb-1 fw-bold">{data.totalEvents}</h1>
                                <p>Total de Eventos</p>
                            </div>
                            <div className="text-center">
                                <i className="fe fe-check-circle text-success fs-3"></i>
                                <h1 className="mt-3 mb-1 fw-bold">{data.activeEvents}</h1>
                                <p>Eventos Ativos</p>
                            </div>
                            <div className="text-center">
                                <i className="fe fe-lock text-warning fs-3"></i>
                                <h1 className="mt-3 mb-1 fw-bold">{data.closedEvents}</h1>
                                <p>Eventos Fechados</p>
                            </div>
                            <div className="text-center">
                                <i className="fe fe-x-circle text-danger fs-3"></i>
                                <h1 className="mt-3 mb-1 fw-bold">{data.cancelledEvents}</h1>
                                <p>Eventos Cancelados</p>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <h5>Ganho Total</h5>
                            <h2 className="fw-bold text-success"><AdminOnly content={formatCurrency(data.totalRevenue)}/></h2>
                        </div>
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
