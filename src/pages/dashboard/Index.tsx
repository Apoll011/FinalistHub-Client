import React, {Fragment, useState } from 'react';
import {Button, Col, Container, Row } from 'react-bootstrap';
import { StatRightTopIcon } from 'components';
import { TopRevenueSourcesChart } from "components";
import {CurrencyDollar} from "react-bootstrap-icons";
import {EventSummary} from "components/event/EventSummary.tsx";
import {EventCalendar} from "components/event/EventCalendar.tsx";
import {ArrowDownCircle, ArrowUpCircle, Percent} from "react-feather";

import {ProjectsStatsProps} from "types.ts";
import {useAuth} from "hooks/useAuth";
import ShowIfAdmin from "components/auth/admin/show_if_admin.tsx";
import TransactionForm from "components/financial/TransactionForm.tsx";
import TransferForm from "components/financial/TransferForm.tsx";
import {useResumeData} from "hooks/useResumeData.tsx";
import {CapacityAnalysis} from "components/event/CapacityAnalysis.tsx";

const Dashboard = () => {
    const { isAdmin } = useAuth();

    const [showAddRevenueModal, setShowAddRevenueModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);

    const {balanceData, eventToHappen, profitData} = useResumeData();
    
    const projectStats: ProjectsStatsProps[] = [
        {
            id: 1,
            title: 'Saldo Atual',
            value: balanceData?.currentBalance,
            icon: <CurrencyDollar size={18} />,
            statInfo: balanceData?.lastUpdated?.toLocaleString() || "",
            statusColor: 'primary'
        },
        {
            id: 2,
            title: 'Ganho Total',
            value: profitData?.totalRevenue,
            icon: <ArrowUpCircle size={18} />,
            statInfo: `${profitData?.period.year}/${profitData?.period.month}`,
            statusColor: 'primary'
        },
        {
            id: 3,
            title: 'Total de Gastos',
            value: profitData?.totalExpenses,
            icon: <ArrowDownCircle size={18} />,
            statInfo: `${profitData?.period.year}/${profitData?.period.month}`,
            statusColor: 'danger'
        },
        {
            id: 4,
            title: 'Margem de Lucro',
            value: profitData ? profitData?.profitMargin + "%" : null,
            icon: <Percent size={18} />,
            statInfo: `${profitData?.period.year}/${profitData?.period.month}`,
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

                    {projectStats.map((stat) => (
                        <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={stat.id}>
                            <StatRightTopIcon info={stat} />
                        </Col>
                    ))}
                </Row>

                <Row className="my-6">
                    <EventSummary />
                </Row>

                <Row className="my-3">
                    <CapacityAnalysis capacityAnalysis={eventToHappen?.capacityAnalysis}/>
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
