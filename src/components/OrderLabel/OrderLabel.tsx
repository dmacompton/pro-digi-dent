import { Tag } from "antd";

export enum ORDER_TYPE {
    DESIGN_PRINT = 1,
    DESIGN = 2,
    PRINT = 3,
    CUSTOM = 4
}

export const ORDER_LABEL: Record<ORDER_TYPE, string> = {
    [ORDER_TYPE.DESIGN_PRINT]: "Design & Print",
    [ORDER_TYPE.DESIGN]: "Design",
    [ORDER_TYPE.PRINT]: "Print",
    [ORDER_TYPE.CUSTOM]: "Custom"
};

type OrderLabelProps = {
    type: ORDER_TYPE;
};

export const OrderLabel: React.FC<OrderLabelProps> = ({ type }) => {
    return <Tag color="blue">{ORDER_LABEL[type]}</Tag>;
};
