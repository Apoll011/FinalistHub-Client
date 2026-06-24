import React from "react";
import {CapacityAnalysisEvent} from "api";
import {Alert, Badge, Card, Table} from "react-bootstrap";

export const CapacityAnalysis: React.FC<{ capacityAnalysis: CapacityAnalysisEvent[] | undefined }> = ({ capacityAnalysis }) => {
    const rows = capacityAnalysis ?? [];

    return (
        <Card className="h-100 shadow-sm border-0">
            <Card.Body>
                <div className="d-flex align-items-start justify-content-between mb-3">
                    <div>
                        <p className="text-uppercase text-muted fw-semibold small mb-1">Planeamento</p>
                        <h4 className="mb-0">Eventos a acontecer</h4>
                    </div>
                    <Badge bg="light" text="dark">{rows.length} eventos</Badge>
                </div>
                {!capacityAnalysis ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : rows.length === 0 ? (
                    <Alert variant="light" className="mb-0">
                        Nenhum evento próximo encontrado.
                    </Alert>
                ) : (
                    <Table responsive className="mb-0 align-middle">
                        <thead className="table-light">
                        <tr>
                            <th>Nome</th>
                            <th>Data</th>
                            <th className="text-end">Bilhetes vendidos</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map((event: CapacityAnalysisEvent) => (
                            <tr key={event.eventId}>
                                <td className="fw-semibold">{event.name}</td>
                                <td>{new Date(event.date).toLocaleDateString()}</td>
                                <td className="text-end">{event.ticketsSold}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );
};
