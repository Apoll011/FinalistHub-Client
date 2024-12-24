import {useApiData} from "components/api_component.tsx";
import {FinanceApi} from "api";
import {Card} from "react-bootstrap";
import {Bar} from "react-chartjs-2";
// @ts-ignore
import React from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const DailyRevenueGraph = () => {
    const { data, loading, error } = useApiData(() => new FinanceApi().getDailyTransactionsFinanceDailyRevenueGet(), { dailyBreakdown: [] });

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Error: {error}</div>;

    console.log(data)
    const chartData = {
        labels: data.dailyBreakdown.map((item: { date: string; }) => item.date),
        datasets: [
            {
                label: 'Ganho Diário',
                data: data.dailyBreakdown.map((item: { revenue: number; }) => item.revenue),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Gasto Diário',
                data: data.dailyBreakdown.map((item: { expense: number; }) => item.expense),
                backgroundColor: 'rgba(255, 75, 12, 0.2)',
                borderColor: 'rgba(255, 75, 75, 1)',
                borderWidth: 1
            }
        ]
    };

    return (
        <Card className="my-6 h-full">
            <Card.Body className="p-6 h-full">
                <h2 className="text-xl font-semibold mb-4">Resumo da Semana</h2>
                <Bar data={chartData} />
            </Card.Body>
        </Card>
);
};
