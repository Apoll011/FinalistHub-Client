import React, {Fragment, useState } from 'react';
import {Button, Col, Container, Row, Card, Table } from 'react-bootstrap';
import { StatRightTopIcon } from 'components';
import { TopRevenueSourcesChart } from "components";
import {CapacityAnalysisEvent } from "api";
import {CurrencyDollar} from "react-bootstrap-icons";
import {EventSummary} from "components/event/EventSummary.tsx";
import {EventCalendar} from "components/event/EventCalendar.tsx";
import {ArrowDownCircle, ArrowUpCircle, Percent} from "react-feather";

import {ProjectsStatsProps} from "types.ts";
import {useAuth} from "hooks/useAuth";
import ShowIfAdmin from "components/auth/admin/show_if_admin.tsx";
import TransactionForm from "components/financial/TransactionForm.tsx";
import TransferForm from "components/financial/TransferForm.tsx";

const CapacityAnalysis: React.FC<{ capacityAnalysis: CapacityAnalysisEvent[] }> = ({ capacityAnalysis }) => {
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
                        ))) : (
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

const Dashboard = () => {
    const { isAdmin } = useAuth();

    const [showAddRevenueModal, setShowAddRevenueModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);

    const [balanceData, setBalanceData] = useState({ currentBalance: 0, lastUpdated: new Date() });
    const [eventToHappen, setEventToHappen] = useState<CapacityAnalysisResponse>({capacityAnalysis: []});
    const [profitData, setProfitData] = useState({
        totalRevenue: 0,
        totalExpenses: 0,
        profitMargin: 0,
        period: { year: new Date().getFullYear(), month: new Date().getMonth() }
    });

    const formatCurrency = (amount:number) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'CVE'
        }).format(amount);
    };

    const refreshData = async () => {
        const balanceResponse = await new FinanceApi().getTotalBalanceFinanceBalanceGet();
        const profitResponse = await new FinanceApi().getProfitReportFinanceProfitGet();
        const eventResponse = await new EventsApi().getCapacityAnalysisEventsCapacityAnalysisGet();

        setBalanceData({
            currentBalance: balanceResponse.currentBalance,
            lastUpdated: new Date(),
        });

        setProfitData({
            totalRevenue: profitResponse.totalRevenue,
            totalExpenses: profitResponse.totalExpenses,
            profitMargin: profitResponse.profitMargin,
            period: profitResponse.period,
        });

        setEventToHappen(eventResponse);
    };

    useEffect(() => {
        refreshData().then(() => console.log("Dados refrescados"));
        const intervalId = setInterval(() => {
            refreshData().then(() => console.log("Dados refrescados"));
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    const projectStats: ProjectsStatsProps[] = [
        {
            id: 1,
            title: 'Saldo Atual',
            value: balanceData ? formatCurrency(balanceData.currentBalance) : '...',
            icon: <CurrencyDollar size={18} />,
            statInfo: balanceData?.lastUpdated?.toLocaleString(),
            statusColor: 'primary'
        },
        {
            id: 2,
            title: 'Ganho Total',
            value: formatCurrency(profitData.totalRevenue),
            icon: <ArrowUpCircle size={18} />,
            statInfo: `${profitData.period.year}/${profitData.period.month}`,
            statusColor: 'primary'
        },
        {
            id: 3,
            title: 'Total de Gastos',
            value: formatCurrency(profitData.totalExpenses),
            icon: <ArrowDownCircle size={18} />,
            statInfo: `${profitData.period.year}/${profitData.period.month}`,
            statusColor: 'danger'
        },
        {
            id: 4,
            title: 'Margem de Lucro',
            value: profitData.profitMargin + "%",
            icon: <Percent size={18} />,
            statInfo: `${profitData.period.year}/${profitData.period.month}`,
            statusColor: 'warning'
        },
    ];

    return (
        <Fragment>
            <div className="bg-primary pt-10 pb-21"></div>
            <Container fluid className="mt-n22 px-6">
                <Row>
                    <Row className="mb-4">
                        <Col>
                            <h2 className="text-white">Dashboard</h2>
                        </Col>

                        <ShowIfAdmin>
                            <Col xs="auto">
                                <Button variant="primary" className="bg-success mx-3" onClick={() => setShowAddRevenueModal(isAdmin)}>
                                    Adicionar Receita
                                </Button>
                                <Button variant="primary" className="bg-warning mx-3" onClick={() => setShowAddExpenseModal(isAdmin)}>
                                    Adicionar Despesa
                                </Button>
                                <Button variant="primary" className="bg-info" onClick={() => setShowTransferModal(isAdmin)}>
                                    Transferir Dinheiro
                                </Button>
                            </Col>
                        </ShowIfAdmin>
                    </Row>

                    {/* Stats Section */}
                    {projectStats.map((stat) => (
                        <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={stat.id}>
                            {balanceData ? (
                                <StatRightTopIcon info={stat} />
                            ) : (
                                <ErrorState message="Failed to load balance information" />
                            )}
                        </Col>
                    ))}
                </Row>

                <Row className="my-6">
                    <EventSummary />
                </Row>

                <Row className="my-3">
                    <CapacityAnalysis capacityAnalysis={eventToHappen.capacityAnalysis}/>
                </Row>

                <Row className="my-6">
                    <EventCalendar />
                </Row>

                <ShowIfAdmin>
                    <Row className="my-6">
                        <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
                            <TopRevenueSourcesChart />
                        </Col>
                        <Col xl={8} lg={12} md={12} xs={12}>

                        </Col>
                    </Row>
                    <TransactionForm
                        show={showAddRevenueModal}
                        onHide={() => setShowAddRevenueModal(false)}
                        transactionType="revenue"
                    />
                    <TransactionForm
                        show={showAddExpenseModal}
                        onHide={() => setShowAddExpenseModal(false)}
                        transactionType="expense"
                    />
                    <TransferForm
                        show={showTransferModal}
                        onHide={() => setShowTransferModal(false)}
                    />
                </ShowIfAdmin>
            </Container>
        </Fragment>
    );
};

export default Dashboard;
