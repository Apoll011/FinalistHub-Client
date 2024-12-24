import {ErrorState, LoadingState, useApiData} from "components/api_component.tsx";
import {EventsApi} from "api";
import {Card} from "react-bootstrap";
import React from "react";
import AdminOnly from "components/admin_only.tsx";

export const EventSummary = () => {
    const { data, loading, error } = useApiData(
        () => new EventsApi().getEventsStatisticsEventsStatisticsGet(),
        {totalEvents: 0,
            activeEvents: 0,
            closedEvents: 0,
            cancelledEvents: 0,
            totalRevenue: 0,
            dateRange: {
                start: "2024-1-1",
                end: "2024-12-31"
            }
        }
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'CVE'
        }).format(amount);
    };


    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;

    return (
        <Card className="h-100">
            <Card.Body>
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
            </Card.Body>
        </Card>
    );
};
