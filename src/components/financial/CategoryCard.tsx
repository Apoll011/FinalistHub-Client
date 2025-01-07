import {TransactionCategoryResponse} from "api";
import React from "react";
import {useCategoryCard} from "hooks/useCategoryCard.ts";
import {Button, ButtonGroup, Card, Col, Row, Spinner} from "react-bootstrap";

interface CategoryCardProps {
    category: TransactionCategoryResponse;
    onEdit: (category: TransactionCategoryResponse) => void;
    onDelete: (id: string) => void;
    onViewStats: (category: TransactionCategoryResponse) => void;
    loading?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
                                                       category,
                                                       onEdit,
                                                       onDelete,
                                                       onViewStats,
                                                       loading
                                                   }) => {
    const {
        isHovered,
        isExpanded,
        localLoading,
        setLocalLoading,
        handleMouseEnter,
        handleMouseLeave,
        toggleExpand,
    } = useCategoryCard(category);
    
    return (
        <Card
            className={`h-100 shadow-sm ${isHovered ? 'shadow' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0">{category.name}</Card.Title>
                    <Button
                        variant="link"
                        className="p-0 text-muted"
                        onClick={toggleExpand}
                    >
                        {isExpanded ? '−' : '+'}
                    </Button>
                </div>
                
                <Card.Text className={isExpanded ? '' : 'text-truncate'}>
                    {category.description}
                </Card.Text>
                
                <div className="mt-auto pt-3">
                    <ButtonGroup className="w-100">
                        <Button
                            variant="outline-primary"
                            onClick={() => onViewStats(category)}
                            disabled={loading || localLoading}
                        >
                            {loading || localLoading ? (
                                <Spinner animation="border" size="sm" />
                            ) : (
                                'Estatísticas'
                            )}
                        </Button>
                        <Button
                            variant="outline-warning"
                            onClick={() => onEdit(category)}
                            disabled={loading || localLoading}
                        >
                            Editar
                        </Button>
                        <Button
                            variant="outline-danger"
                            onClick={() => {
                                setLocalLoading(true);
                                onDelete(category.id);
                            }}
                            disabled={loading || localLoading}
                        >
                            Apagar
                        </Button>
                    </ButtonGroup>
                </div>
            </Card.Body>
        </Card>
    );
};

export const CategoryGrid: React.FC<{
    categories: TransactionCategoryResponse[];
    onEdit: (category: TransactionCategoryResponse) => void;
    onDelete: (id: string) => void;
    onViewStats: (category: TransactionCategoryResponse) => void;
    loading?: boolean;
}> = ({ categories, onEdit, onDelete, onViewStats, loading }) => {
    return (
        <Row xs={1} md={2} lg={3} className="g-4">
            {categories.map((category) => (
                <Col key={category.id}>
                    <CategoryCard
                        category={category}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onViewStats={onViewStats}
                        loading={loading}
                    />
                </Col>
            ))}
        </Row>
    );
};
