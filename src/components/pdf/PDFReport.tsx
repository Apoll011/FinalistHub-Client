import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Image } from "react-bootstrap";
import {getStatusBadge} from "pages/dashboard/events/EventsPage.tsx";
import {formatCurrency} from "utils/currency.ts";

interface TicketSale {
    type: string;
    price: number;
    quantitySold: number;
    revenue: number;
}

interface ItemSale {
    name: string;
    price: number;
    quantitySold: number;
    revenue: number;
    remainingStock: number;
}

interface EventData {
    eventName: string;
    status: string;
    date: string;
    time: string;
    financialSummary: {
        ticketRevenue: number;
        itemRevenue: number;
        totalRevenue: number;
    };
    ticketSales: {
        details: TicketSale[];
        totalRevenue: number;
    };
    itemSales: {
        details: ItemSale[];
        totalRevenue: number;
    };
}

interface PDFReportProps {
    eventData: EventData;
}

const PDFReport: React.FC<PDFReportProps> = ({ eventData }) => {
    return (
        <div id="pdf-report" className="max-w-full mx-auto bg-white p-8">
            {/* Header */}
            <div className="border-b-2 border-gray-200 pb-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <Image src="/images/logo.png" alt="FinalistHub Logo" className="h-16 w-auto"/>
                        <div>
                            <h1 className="text-2xl font-bold">Comissão de Finalistas 24/25</h1>
                            <p className="text-gray-600">EICM</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Relatório de Evento</p>
                        <p className="text-sm text-gray-600">Gerado em: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Event Details */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Informações do Evento</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-gray-600 font-semibold">Nome</p>
                        <p className="font-bold text-lg">{eventData.eventName}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-gray-600 font-semibold">Estado</p>
                        <p className="font-bold text-lg">{getStatusBadge(eventData.status)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-gray-600 font-semibold">Data de Realização</p>
                        <p className="font-bold text-lg">{eventData.date}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded border">
                        <p className="text-gray-600 font-semibold">Hora de Realização</p>
                        <p className="font-bold text-lg">{eventData.time}</p>
                    </div>
                </div>
            </div>

            {/* Financial Summary */}
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Sumario Financeiro</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 border border-gray-300 rounded">
                        <p className="text-gray-600 font-semibold">Ganho com Bilhetes</p>
                        <p className="text-lg font-bold">{formatCurrency(eventData.financialSummary.ticketRevenue)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-300 rounded">
                        <p className="text-gray-600 font-semibold">Ganho com Venda</p>
                        <p className="text-lg font-bold">{formatCurrency(eventData.financialSummary.itemRevenue)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-300 rounded">
                        <p className="text-gray-600 font-semibold">Ganho Total</p>
                        <p className="text-lg font-bold">{formatCurrency(eventData.financialSummary.totalRevenue)}</p>
                    </div>
                </div>
            </div>

            {/* Ticket Sales */}
            <div className="mb-8" style={{ display: eventData.ticketSales.details.length !== 0 ? "block" : "none" }}>
                <h2 className="text-xl font-bold mb-4">Detalhe da Venda de Bilhetes</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300">
                        <thead className="bg-gray-50 border-b border-gray-300">
                        <tr>
                            <th className="p-3 text-left border-r border-gray-300">Tipo</th>
                            <th className="p-3 text-right border-r border-gray-300">Preço</th>
                            <th className="p-3 text-right border-r border-gray-300">Quantidade Vendida</th>
                            <th className="p-3 text-right">Ganho</th>
                        </tr>
                        </thead>
                        <tbody>
                        {eventData.ticketSales.details.map((ticket, index) => (
                            <tr key={index} className="border-b border-gray-300">
                                <td className="p-3 border-r border-gray-300">{ticket.type}</td>
                                <td className="p-3 text-right border-r border-gray-300">{formatCurrency(ticket.price)}</td>
                                <td className="p-3 text-right border-r border-gray-300">{ticket.quantitySold}</td>
                                <td className="p-3 text-right">{formatCurrency(ticket.revenue)}</td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot className="bg-gray-50 border-t border-gray-300">
                        <tr>
                            <td colSpan={3} className="p-3 font-bold text-right border-r border-gray-300">
                                Total com venda de Bilhetes
                            </td>
                            <td className="p-3 text-right font-bold">
                                {formatCurrency(eventData.ticketSales.totalRevenue)}
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Item Sales */}
            <div style={{ display: eventData.itemSales.details.length !== 0 ? "block" : "none" }}>
                <h2 className="text-xl font-bold mb-4">Detalhes com as vendas dos Items</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300">
                        <thead className="bg-gray-50 border-b border-gray-300">
                        <tr>
                            <th className="p-3 text-left border-r border-gray-300">Item</th>
                            <th className="p-3 text-right border-r border-gray-300">Preço</th>
                            <th className="p-3 text-right border-r border-gray-300">Quantidade Vendida</th>
                            <th className="p-3 text-right border-r border-gray-300">Ganho</th>
                            <th className="p-3 text-right">Stock Left</th>
                        </tr>
                        </thead>
                        <tbody>
                        {eventData.itemSales.details.map((item, index) => (
                            <tr key={index} className="border-b border-gray-300">
                                <td className="p-3 border-r border-gray-300">{item.name}</td>
                                <td className="p-3 text-right border-r border-gray-300">{formatCurrency(item.price)}</td>
                                <td className="p-3 text-right border-r border-gray-300">{item.quantitySold}</td>
                                <td className="p-3 text-right border-r border-gray-300">{formatCurrency(item.revenue)}</td>
                                <td className="p-3 text-right">{item.remainingStock}</td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot className="bg-gray-50 border-t border-gray-300">
                        <tr>
                            <td colSpan={3} className="p-3 font-bold text-right border-r border-gray-300">
                                Valor Total Ganho com Items
                            </td>
                            <td className="p-3 text-right font-bold border-r border-gray-300">
                                {formatCurrency(eventData.itemSales.totalRevenue)}
                            </td>
                            <td></td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const generatePDF = async (report: EventData): Promise<void> => {
    // Render the component to HTML string
    const htmlContent = ReactDOMServer.renderToString(<PDFReport eventData={report} />);

    // Create a new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        throw new Error('Could not open print window');
    }

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Relatório do Evento: ${report.eventName}</title>
        <meta charset="utf-8">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              margin: 0; /* Removes body margin */
              padding: 0;
            }
            @page {
              size: A4;
              margin: 0;
            }

        }
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          // Wait for resources to load
          window.onload = () => {
            setTimeout(() => {
              window.print();
              window.close();
            }, 1000);
          };
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
};
export default PDFReport;