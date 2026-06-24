// Widget : Stat Style
// Style : Stat widget with right top icon

// import node module libraries
import { Card } from "react-bootstrap";
import { ProjectsStatsProps } from "types.ts";
import React from "react";
import {formatCurrency} from "utils/currency.ts";

interface StatRightProps {
  info: ProjectsStatsProps;
}

export const StatRightTopIcon: React.FC<StatRightProps> = ({ info }) => {
  const hasValue = info.value !== null && info.value !== undefined;

  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Body className="d-flex flex-column justify-content-between">
        {hasValue && info.statInfo ? (
          <>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="pe-3">
                <p className="text-uppercase text-muted fw-semibold small mb-1">{info.title}</p>
                <h3 className="mb-0">
                  {typeof info.value === "number" ? formatCurrency(info.value) : info.value}
                </h3>
              </div>
              <div className={`icon-shape icon-md bg-light-primary text-${info.statusColor} rounded-3`}>
                {info.icon}
              </div>
            </div>
            <p className="mb-0 text-muted small">{info.statInfo}</p>
          </>
        ) : (
          <div className="d-flex justify-content-center align-items-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
