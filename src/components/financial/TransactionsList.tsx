import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import {TransactionResponse} from "api";

interface TransactionsListPros {
    transactions: TransactionResponse[];
}

const TransactionsList: React.FC<TransactionsListPros> = ({ transactions }) => {
    return (
        <div className="d-flex flex-wrap justify-content-center">
            {transactions.length > 0 ? (
                transactions.map((transaction) => (
                    <Card key={transaction.id} className="m-2 shadow-sm" style={{width: '18rem'}}>
                        <Card.Title
                            className={`bg-${transaction.type !== "expense" ? (transaction.type == "revenue") ? "success" : "info" : "warning"} text-center p-4 mb-1 rounded-top-3`}>
                            <Card.Text className="text-white">{transaction.description || 'No description provided'}</Card.Text>
                        </Card.Title>
                        <Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>Amount:</strong> {transaction.amount}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>From:</strong> {transaction.fromAccountId || 'N/A'}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>To:</strong> {transaction.toAccountId || 'N/A'}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString()}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                    </Card>
                ))
            ) : (
                <p className="text-center">No transactions available.</p>
            )}
        </div>
    );
};

export default TransactionsList;
