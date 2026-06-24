import React, { Fragment, useMemo, useState } from "react";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { ArrowDownCircle, ArrowUpCircle, CalendarEvent, Percent, People } from "react-feather";
import { CurrencyDollar, BoxArrowUpRight } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

import { StatRightTopIcon } from "components";
import { TopRevenueSourcesChart } from "components";
import { EventCalendar } from "components/event/EventCalendar.tsx";
import { EventSummary } from "components/event/EventSummary.tsx";
import { CapacityAnalysis } from "components/event/CapacityAnalysis.tsx";
import TransactionForm from "components/financial/TransactionForm.tsx";
import TransferForm from "components/financial/TransferForm.tsx";
import { useAuth } from "hooks/useAuth.ts";
import { useCachedData } from "hooks/useCachedData.ts";
import { useResumeData } from "hooks/useResumeData.ts";
import { EventsApi, Event, MeetingList, MeetingsApi } from "api";
import { TIMES } from "utils/times.ts";

const formatDateTime = (date: string, time?: string) => {
    const parsed = new Date(time ? `${date}T${time}` : date);
    return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleString();
};

const Dashboard = () => {
    const { user, isAdmin } = useAuth();

    return isAdmin ? (
        <AdminDashboard userName={user?.username || ""} />
    ) : (
        <MemberDashboard userName={user?.username || ""} />
    );
};

const MemberDashboard: React.FC<{ userName: string }> = ({ userName }) => {
    const navigate = useNavigate();

    const events = useCachedData<Event[]>(
        () => new EventsApi().getCalendarEventsCalendarGet({ all: true }),
        "member-dashboard-events",
        TIMES.minutes(10)
    );

    const meetings = useCachedData<MeetingList>(
        () => new MeetingsApi().getUpcomingMeetingsMeetingsUpcomingGet(),
        "member-dashboard-meetings",
        TIMES.minutes(15)
    );

    const upcomingEvents = useMemo(() => {
        return [...(events ?? [])]
            .filter((event) => event.status !== "cancelled")
            .sort((a, b) => new Date(`${a.date}T${a.time ?? "00:00"}`).getTime() - new Date(`${b.date}T${b.time ?? "00:00"}`).getTime())
            .slice(0, 4);
    }, [events]);

    const upcomingMeetings = meetings?.meetings ?? [];
    const nextEvent = upcomingEvents[0];
    const nextMeeting = upcomingMeetings[0];

    const stats = useMemo(() => ([
        {
            id: 1,
            title: "Próximos eventos",
            value: upcomingEvents.length,
            icon: <CalendarEvent size={18} />,
            statInfo: "Agenda visível para a equipa",
            statusColor: "primary",
        },
        {
            id: 2,
            title: "Reuniões agendadas",
            value: upcomingMeetings.length,
            icon: <People size={18} />,
            statInfo: "Próximas reuniões",
            statusColor: "success",
        },
        {
            id: 3,
            title: "Eventos ativos",
            value: (events ?? []).filter((event) => event.status === "active").length,
            icon: <BoxArrowUpRight size={18} />,
            statInfo: "Eventos abertos hoje",
            statusColor: "warning",
        },
    ]), [events, upcomingEvents.length, upcomingMeetings.length]);

    return (
        <Container fluid className="py-4 px-4 px-lg-6">
            <Row className="g-4 mb-4">
                <Col lg={8}>
                    <Card className="h-100 shadow-sm border-0 bg-primary text-white">
                        <Card.Body className="p-4 p-lg-5 d-flex flex-column flex-lg-row justify-content-between gap-4">
                            <div className="pe-lg-5">
                                <Badge bg="light" text="primary" className="mb-3">Member dashboard</Badge>
                                <h1 className="mb-2">Olá, {userName || "equipa"}</h1>
                                <p className="mb-0 text-white-50">
                                    Reuniões, eventos e atalhos úteis sem ruído administrativo.
                                </p>
                            </div>
                            <div className="d-flex flex-column gap-2 align-self-lg-center">
                                <Button variant="light" className="text-primary fw-semibold" onClick={() => navigate("/meeting")}>
                                    Ver reuniões
                                </Button>
                                <Button variant="outline-light" onClick={() => navigate("/event/")}>
                                    Explorar eventos
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="h-100 shadow-sm border-0">
                        <Card.Body className="d-flex flex-column justify-content-between">
                            <div>
                                <p className="text-uppercase text-muted fw-semibold small mb-1">Atalhos</p>
                                <h4 className="mb-3">Fluxo rápido</h4>
                            </div>
                            <div className="d-grid gap-2">
                                <Button variant="outline-primary" onClick={() => navigate("/meeting")}>Agenda de reuniões</Button>
                                <Button variant="outline-primary" onClick={() => navigate("/search")}>Pesquisar eventos</Button>
                                <Button variant="outline-primary" onClick={() => navigate("/standalone")}>Vendas avulsas</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4 mb-4">
                {stats.map((stat) => (
                    <Col xl={4} lg={6} xs={12} key={stat.id}>
                        <StatRightTopIcon info={stat} />
                    </Col>
                ))}
            </Row>

            <Row className="g-4">
                <Col lg={7}>
                    <Card className="h-100 shadow-sm border-0">
                        <Card.Body>
                            <div className="d-flex align-items-start justify-content-between mb-3">
                                <div>
                                    <p className="text-uppercase text-muted fw-semibold small mb-1">Agenda</p>
                                    <h4 className="mb-0">Próximos eventos</h4>
                                </div>
                            </div>
                            {upcomingEvents.length > 0 ? (
                                <div className="d-grid gap-3">
                                    {upcomingEvents.map((event) => (
                                        <div key={event.id} className="p-3 rounded-3 bg-light">
                                            <div className="d-flex align-items-start justify-content-between gap-3">
                                                <div>
                                                    <h5 className="mb-1">{event.name}</h5>
                                                    <div className="text-muted small">{formatDateTime(event.date, event.time)}</div>
                                                    <div className="text-muted small">{event.location}</div>
                                                </div>
                                                <Badge bg={event.status === "active" ? "success" : "secondary"}>
                                                    {event.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted">Ainda não há eventos ativos para mostrar.</div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={5}>
                    <Card className="h-100 shadow-sm border-0">
                        <Card.Body>
                            <div className="d-flex align-items-start justify-content-between mb-3">
                                <div>
                                    <p className="text-uppercase text-muted fw-semibold small mb-1">Reuniões</p>
                                    <h4 className="mb-0">Próxima reunião</h4>
                                </div>
                            </div>
                            {nextMeeting ? (
                                <div className="p-3 rounded-3 bg-light">
                                    <h5 className="mb-2">{nextMeeting.location}</h5>
                                    <p className="text-muted mb-2">{nextMeeting.agenda}</p>
                                    <div className="small text-muted">
                                        <div><strong>Data:</strong> {formatDateTime(nextMeeting.date, nextMeeting.time)}</div>
                                        <div><strong>Local:</strong> {nextMeeting.location}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted">Nenhuma reunião futura agendada.</div>
                            )}
                            <div className="mt-4">
                                <Button variant="primary" className="w-100" onClick={() => navigate("/meeting")}>
                                    Abrir agenda completa
                                </Button>
                            </div>
                            {nextEvent && (
                                <div className="mt-3 p-3 rounded-3 border">
                                    <div className="text-uppercase text-muted small fw-semibold mb-1">Próximo evento</div>
                                    <div className="fw-semibold">{nextEvent.name}</div>
                                    <div className="small text-muted">{formatDateTime(nextEvent.date, nextEvent.time)}</div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

const AdminDashboard: React.FC<{ userName: string }> = ({ userName }) => {
    const [showAddRevenueModal, setShowAddRevenueModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);

    const { balanceData, eventToHappen, profitData } = useResumeData(true);

    const projectStats = [
        {
            id: 1,
            title: "Saldo atual",
            value: balanceData?.currentBalance,
            icon: <CurrencyDollar size={18} />,
            statInfo: balanceData?.lastUpdated ? `Atualizado em ${new Date(balanceData.lastUpdated as number | string | Date).toLocaleString()}` : "A aguardar dados",
            statusColor: "primary",
        },
        {
            id: 2,
            title: "Ganho total",
            value: profitData?.totalRevenue,
            icon: <ArrowUpCircle size={18} />,
            statInfo: profitData ? `${profitData.period.year}/${profitData.period.month}` : "A aguardar dados",
            statusColor: "primary",
        },
        {
            id: 3,
            title: "Total de gastos",
            value: profitData?.totalExpenses,
            icon: <ArrowDownCircle size={18} />,
            statInfo: profitData ? `${profitData.period.year}/${profitData.period.month}` : "A aguardar dados",
            statusColor: "danger",
        },
        {
            id: 4,
            title: "Margem de lucro",
            value: profitData?.profitMargin !== undefined ? `${profitData.profitMargin}%` : null,
            icon: <Percent size={18} />,
            statInfo: profitData ? `${profitData.period.year}/${profitData.period.month}` : "A aguardar dados",
            statusColor: "warning",
        },
    ];

    return (
        <Fragment>
            <div className="bg-primary py-5" />
            <Container fluid className="mt-n5 px-4 px-lg-6 pb-4">
                <Row className="g-4 mb-4 align-items-end">
                    <Col lg={8}>
                        <div className="text-white">
                            <Badge bg="light" text="primary" className="mb-3">Admin dashboard</Badge>
                            <h1 className="mb-2">Bem-vindo, {userName || "administrador"}</h1>
                            <p className="mb-0 text-white-50">
                                Aqui tens visão financeira, capacidade operacional e ferramentas rápidas de gestão.
                            </p>
                        </div>
                    </Col>
                    <Col lg={4} className="text-lg-end">
                        <Button variant="light" className="me-2 mb-2 mb-lg-0" onClick={() => setShowAddRevenueModal(true)}>Receita</Button>
                        <Button variant="warning" className="me-2 mb-2 mb-lg-0" onClick={() => setShowAddExpenseModal(true)}>Despesa</Button>
                        <Button variant="info" className="mb-2 mb-lg-0" onClick={() => setShowTransferModal(true)}>Transferir</Button>
                    </Col>
                </Row>

                <Row className="g-4 mb-4">
                    {projectStats.map((stat) => (
                        <Col xl={3} lg={6} xs={12} key={stat.id}>
                            <StatRightTopIcon info={stat} />
                        </Col>
                    ))}
                </Row>

                <Row className="g-4 mb-4">
                    <Col lg={12}>
                        <EventSummary />
                    </Col>
                </Row>

                <Row className="g-4 mb-4">
                    <Col lg={7}>
                        <EventCalendar />
                    </Col>
                    <Col lg={5}>
                        <CapacityAnalysis capacityAnalysis={eventToHappen?.capacityAnalysis} />
                    </Col>
                </Row>

                <Row className="g-4">
                    <Col lg={12}>
                        <TopRevenueSourcesChart />
                    </Col>
                </Row>
            </Container>

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
        </Fragment>
    );
};

export default Dashboard;
