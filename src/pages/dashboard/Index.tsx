import React, {Fragment, useState, useEffect} from 'react';
import {Button, Col, Container, Form, Modal, Row, Card, Table } from 'react-bootstrap';
import { StatRightTopIcon } from 'components';
import { TopRevenueSourcesChart } from "components";
import {CapacityAnalysisEvent, CapacityAnalysisResponse, EventsApi, FinanceApi } from "api";
import {ErrorState} from "components/api_component.tsx";
import {CurrencyDollar} from "react-bootstrap-icons";
import {DailyRevenueGraph} from "components/financial/DailyRevenue.tsx";
import {TransactionsList} from "components/financial/TransactionList.tsx";
import {EventSummary} from "components/event/EventSummary.tsx";
import {EventCalendar} from "components/event/EventCalendar.tsx";
import {ArrowDownCircle, ArrowUpCircle, Percent} from "react-feather";
import Swal from 'sweetalert2';
import {ProjectsStatsProps} from "types.ts";
import {useAuth} from "components/auth.tsx";
import ShowIfAdmin from "components/show_if_admin.tsx";

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
        const balanceResponse = await new FinanceApi().getBalanceFinanceBalanceGet();
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

    const handleAddRevenueSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = {
            description: target.description.value,
            amount: target.amount.value,
        };
        await new FinanceApi().addRevenueFinanceRevenuePost(formData);
        setShowAddRevenueModal(false);
        await Swal.fire({
            title: 'Receita adicionada com Sucesso!',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        await refreshData();
    };

    const handleAddExpenseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = {
            description: target.description.value,
            amount: target.amount.value,
        };
        await new FinanceApi().addExpensesFinanceExpensesPost(formData);
        setShowAddExpenseModal(false);
        await Swal.fire({
            title: 'Despesa adicionada com Sucesso!',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        await refreshData(); // Atualiza os dados após o submit
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
                                <Button variant="primary" className="bg-warning" onClick={() => setShowAddExpenseModal(isAdmin)}>
                                    Adicionar Despesa
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
                        <DailyRevenueGraph />
                    </Row>


                    <Row className="my-6">
                        <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
                            <TopRevenueSourcesChart />
                        </Col>
                        <Col xl={8} lg={12} md={12} xs={12}>
                            <TransactionsList />
                        </Col>
                    </Row>
                    <Modal show={showAddRevenueModal} onHide={() => setShowAddRevenueModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Adicionar Receita</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleAddRevenueSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descrição da Receita</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="description"
                                        placeholder="Descrição"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Valor</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        required
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-end gap-2">
                                    <Button variant="secondary" onClick={() => setShowAddRevenueModal(false)}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Adicionar
                                    </Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>
                    <Modal show={showAddExpenseModal} onHide={() => setShowAddExpenseModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Adicionar Despesa</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleAddExpenseSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descrição da Despesa</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="description"
                                        placeholder="Descrição"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Valor</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        required
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-end gap-2">
                                    <Button variant="secondary" onClick={() => setShowAddExpenseModal(false)}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Adicionar
                                    </Button>
                                </div>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </ShowIfAdmin>
            </Container>
        </Fragment>
    );
};

export default Dashboard;
