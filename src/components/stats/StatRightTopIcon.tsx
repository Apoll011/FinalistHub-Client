// Widget : Stat Style
// Style : Stat widget with right top icon

// import node module libraries
import { Card } from "react-bootstrap";
import { ProjectsStatsProps } from "types.ts";
import React from "react";
import AdminOnly from "components/admin_only.tsx";

interface StatRightProps {
  info: ProjectsStatsProps;
}

export const StatRightTopIcon: React.FC<StatRightProps> = ({ info }) => {
  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="mb-0">{info.title}</h4>
          </div>
          <div className={`icon-shape icon-md bg-light-primary text-${info.statusColor} rounded-2`}>
            {info.icon}
          </div>
        </div>
        <div>

            <h3 className="fw-bold"><AdminOnly content={info.value}/></h3>
          <p
              className="mb-0 text-dark me-2"
              dangerouslySetInnerHTML={{__html: info.statInfo}}
          ></p>
        </div>
      </Card.Body>
    </Card>
  );
};
