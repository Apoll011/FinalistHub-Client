import React, { useState, useEffect } from 'react';
import {Card, Button, Row, Col, Alert, Spinner} from 'react-bootstrap';
import {FinanceApi, TransactionResponse} from 'api';
import { Bank, CreditCard, Wallet } from 'react-bootstrap-icons';
import {useParams} from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import {formatCurrency} from "utils/currency.ts";
import {useAccountNames} from "hooks/useAccountNames.ts";
import {useUserName} from "hooks/useUsername.ts";
import {useEventName} from "hooks/useEventName.ts";
import {useCategoryName} from "hooks/useCategoryName.ts";

interface TransactionCardProps {
    transaction: TransactionResponse
}

const TransactionCard: React.FC<TransactionCardProps> = ({transaction}) => {
    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'revenue':
                return 'success';
            case 'expense':
                return 'danger';
            default:
                return 'info';
        }
    };

    const getTransactionName = (type: string) => {
        switch (type) {
            case 'revenue':
                return 'Ganho';
            case 'expense':
                return 'Despesa';
            default:
                return 'Movimentação';
        }
    };

    const getPaymentMethodInfo = (method: string | null | undefined) => {
        const icons = {
            bank: <Bank className="text-primary" size={24} />,
            cash: <CreditCard className="text-success" size={24} />,
            default: <Wallet className="text-info" size={24} />
        };

        const names = {
            bank: 'Transferência Bancária',
            cash: 'Dinheiro',
            default: 'Outro'
        };

        if (method) {
            const methodLower = method?.toLowerCase() || '';
            return {
                icon: icons[methodLower as keyof typeof icons] || icons.default,
                name: names[methodLower as keyof typeof names] || names.default
            };
        }
        return {
            icon: icons.default,
            name: names.default
        };
    };


    const { getAccountName } = useAccountNames([
        transaction?.fromAccountId,
        transaction?.toAccountId
    ]);
    const { data: username } = useUserName(transaction?.createdBy);
    const { data: categoryName } = useCategoryName(transaction?.categoryId);
    const { data: eventName } = useEventName(transaction?.eventId);
    
    const paymentMethod = getPaymentMethodInfo(transaction.paymentMethod);

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Header className={`bg-${getTransactionColor(transaction.type)} text-white`}>
                <h4 className="mb-0">Recibo de Transação</h4>
            </Card.Header>
            <Card.Body>
                <Row className="mb-3">
                    <Col md={6}>
                        <h5 className="text-muted mb-2">Informações Básicas</h5>
                        <p><strong>Tipo:</strong> {getTransactionName(transaction.type)}</p>
                        <p><strong>Valor:</strong> {formatCurrency(transaction.amount)}</p>
                        <p className="d-flex align-items-center gap-2">
                            <strong>Método de Pagamento:</strong>
                            {paymentMethod.icon}
                            <span>{paymentMethod.name}</span>
                        </p>
                        <p><strong>Número do Recibo:</strong> {transaction.receiptNumber || 'N/A'}</p>
                    </Col>
                    <Col md={6}>
                        <h5 className="text-muted mb-2">Detalhes da Conta</h5>
                        <p><strong>Conta de Origem:</strong> {getAccountName(transaction.fromAccountId) || 'N/A'}</p>
                        <p><strong>Conta de Destino:</strong> {getAccountName(transaction.toAccountId) || 'N/A'}</p>
                        <p><strong>Categoria:</strong> {categoryName}</p>
                        <p><strong>Evento:</strong> {eventName}</p>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={12}>
                        <h5 className="text-muted mb-2">Descrição e Notas</h5>
                        <p><strong>Descrição:</strong> {transaction.description || 'N/A'}</p>
                        <p><strong>Notas Adicionais:</strong> {transaction.notes || 'N/A'}</p>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <h5 className="text-muted mb-2">Informações do Sistema</h5>
                        <p><strong>Criado Por:</strong> {username}</p>
                        <p><strong>Data de Criação:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
                        <p><strong>Última Atualização:</strong> {new Date(transaction.updatedAt).toLocaleString()}</p>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

const generatePDF = async (transaction: TransactionResponse): Promise<void> => {
    const htmlContent = ReactDOMServer.renderToString(<TransactionCard transaction={transaction} />);

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        throw new Error('Could not open print window');
    }

    printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="pt">
      <head>
        <title>Relatório da Transação: ${transaction.type}</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">        <style>
          body {
            font-size: 18px;
            font-family: Inter;
            margin: 0;
            padding: 0;
          }
          .shadow-sm {
            box-shadow: 0 0 rgba(0,0,0,0) !important;
          }
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
          window.onload = () => {
            setTimeout(() => {
              window.print();
              window.close();
            }, 2000);
          };
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
};

const TransactionReceiptPage = () => {
    const [transaction, setTransaction] = useState<TransactionResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams();
    const transactionsApi = new FinanceApi();

    useEffect(() => {
        fetchTransactionData();
    }, [id]);

    const fetchTransactionData = async () => {
        try {
            const result = await transactionsApi.getTransactionFinanceTransactionsGet({
                transactionId: id as string
            });
            setTransaction(result);
            setLoading(false);
        } catch (error) {
            setError('Um erro inesperado ocorreu: ' + error);
            setLoading(false);
        }
    };

    const handleGeneratePDF = () => {
        if (transaction) {
            generatePDF(transaction);
        }
    };


    if (!transaction && !loading) return <Alert variant="warning">Transação não encontrada</Alert>;

    return (
        <div className="container my-5">
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="d-flex justify-content-end mb-4">
                <Button
                    variant="primary"
                    onClick={handleGeneratePDF}
                    className="d-flex align-items-center gap-2"
                >
                    <i className="bi bi-printer"></i> Gerar PDF
                </Button>
            </div>

            { transaction ? (
                <TransactionCard transaction={transaction}/>
            ) : (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary"/>
                </div>
            )}
        </div>
    );
};

export default TransactionReceiptPage;