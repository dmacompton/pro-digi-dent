import React from "react";
import classnames from "classnames";
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Tag, Timeline } from "antd";

export enum STATUS {
    Pending,
    Verification,
    NotApproved,
    Verified,
    Confirmation,
    DesignCompleted,
    Manufacturing,
    Shipped,
    Developed
}

const TAG: Record<STATUS, string> = {
    [STATUS.Pending]: "Pending",
    [STATUS.Verification]: "Verification",
    [STATUS.NotApproved]: "Not approved",
    [STATUS.Verified]: "Verified",
    [STATUS.Confirmation]: "Confirmation",
    [STATUS.DesignCompleted]: "Design Completed",
    [STATUS.Manufacturing]: "Manufacturing",
    [STATUS.Shipped]: "Shipped",
    [STATUS.Developed]: "Developed"
};

const COLORS: Record<STATUS, string> = {
    [STATUS.Pending]: "orange",
    [STATUS.Verification]: "blue",
    [STATUS.NotApproved]: "red",
    [STATUS.Verified]: "green",
    [STATUS.Confirmation]: "cyan",
    [STATUS.DesignCompleted]: "green",
    [STATUS.Manufacturing]: "gold",
    [STATUS.Shipped]: "blue",
    [STATUS.Developed]: "blue"
};

const ICON: Record<STATUS, React.ReactNode> = {
    [STATUS.Pending]: <ExclamationCircleOutlined />,
    [STATUS.Verification]: <ExclamationCircleOutlined />,
    [STATUS.NotApproved]: <CloseCircleOutlined />,
    [STATUS.Verified]: <CheckCircleOutlined />,
    [STATUS.Confirmation]: <ExclamationCircleOutlined />,
    [STATUS.DesignCompleted]: <CheckCircleOutlined />,
    [STATUS.Manufacturing]: <SyncOutlined spin />,
    [STATUS.Shipped]: <CheckCircleOutlined />,
    [STATUS.Developed]: <CheckCircleOutlined />
};

type ItemProps = {
    status?: STATUS;
    isLast: boolean;
    label: string;
    description: string;
};

type StatusTagProps = Pick<ItemProps, "status">;

export const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
    if (status === undefined) {
        return null;
    }

    return (
        <Tag color={COLORS[status]} icon={ICON[status]}>
            {TAG[status]?.toUpperCase()}
        </Tag>
    );
};

export const TimelineStatus: React.FC<ItemProps> = ({ status, isLast, label, description }) => {
    return (
        <Timeline.Item
            label={label}
            color={status ? COLORS[status] : "gray"}
            className={classnames({ "ant-timeline-item-last": isLast }, "ant-timeline-item-left")}
        >
            <StatusTag status={status} />
            {description}
        </Timeline.Item>
    );
};
