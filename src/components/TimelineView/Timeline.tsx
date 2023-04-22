import { Timeline } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { TimelineStatus } from "../Status/Status";
import { Activity } from "../../services/orders.service";
import { formatDate } from "../../helpers/date";

type Props = {
    activities: Activity[];
};

const StyledTimeline = styled(Timeline)`
    margin-top: 20px;

    .ant-timeline-item.ant-timeline-item-left {
        padding-bottom: 8px;
    }

    .ant-timeline-item-head {
        &-expand {
            background-color: #e2e8f0;
            width: 20px;
            margin-left: -9px !important;
            position: relative;

            &:after {
                content: "…";
                position: absolute;
                bottom: -7.5px;
                font-size: 22px;
                left: 1px;
                color: white;
            }

            &:hover:not(:active) {
                background-color: #d1d6de;
            }
        }
    }
`;

const StyledCollapseContainer = styled.li``;

export const TimelineView: React.FC<Props> = props => {
    const [showAll, setShowAll] = useState(props.activities.length < 3);

    const activities = showAll ? props.activities : [...props.activities.slice(0, 1), ...props.activities.slice(-1)];

    return (
        <StyledTimeline className="ant-timeline-label">
            {showAll ? (
                activities.map((activity, index) => (
                    <TimelineStatus
                        key={activity.created_at}
                        status={activity.status}
                        description={activity.description}
                        label={formatDate(activity.created_at)}
                        isLast={index === activities.length - 1}
                    />
                ))
            ) : (
                <>
                    <TimelineStatus
                        key={activities[0].created_at}
                        status={activities[0].status}
                        description={activities[0].description}
                        label={formatDate(activities[0].created_at)}
                        isLast={false}
                    />
                    <StyledCollapseContainer className="ant-timeline-item ant-timeline-item-left">
                        <div className="ant-timeline-item-label" />
                        <div className="ant-timeline-item-tail" />
                        <div
                            className="ant-timeline-item-head ant-timeline-item-head-expand"
                            onClick={() => setShowAll(true)}
                        />
                        <div className="ant-timeline-item-content">&nbsp;</div>
                    </StyledCollapseContainer>
                    <TimelineStatus
                        key={activities[1].created_at}
                        status={activities[1].status}
                        description={activities[1].description}
                        label={formatDate(activities[1].created_at)}
                        isLast={true}
                    />
                </>
            )}
        </StyledTimeline>
    );
};
