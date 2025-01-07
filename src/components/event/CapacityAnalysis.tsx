import React from "react";
import {CapacityAnalysisEvent} from "api";
import {Card, Table} from "react-bootstrap";

export const CapacityAnalysis: React.FC<{ capacityAnalysis: CapacityAnalysisEvent[] | undefined }> = ({ capacityAnalysis }) => {
    return (
        <Card className="h-100">
            <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <h4 className="mb-0">Eventos para Acontecer</h4>
                    </div>
                </div>
                <Table className="mt-4" responsive>
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Data</th>
                        <th>Bilhetes Vendidos</th>
                    </tr>
                    </thead>
                    <tbody>
                    {capacityAnalysis && capacityAnalysis.length > 0 ? (
                            capacityAnalysis.map((event: CapacityAnalysisEvent) => (
                                <tr key={event.eventId}>
                                    <td>{event.name}</td>
                                    <td>{new Date(event.date).toLocaleDateString()}</td>
                                    <td>{event.ticketsSold}</td>
                                </tr>
                            ))) :
                        !capacityAnalysis ? (
                            <tr>
                                <td colSpan={3} className="text-center">
                                    Carregando...
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center">
                                    Nenhum Eventos para Acontecer
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};
