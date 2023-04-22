import { Dropdown, Menu, Popconfirm } from "antd";
import React from "react";
import { ActionButton } from "./ActionButton";
import { ordersService } from "../../../../services/orders.service";

type Props = {
    id: number;
};

export enum CONFIRM_TYPE {
    PROJECT_FILE = 1,
    SCREENSHOT = 2,
    MEETING = 3
}

type ItemProps = { onClick: () => void; label: string };

const Item: React.FC<ItemProps> = ({ onClick, label }) => {
    const title = (
        <span>
            Are you sure you want to confirm {label}? <br /> You won't be able to return cancel order
        </span>
    );

    return (
        <Menu.Item key={label}>
            <Popconfirm title={title} okText="Yes" cancelText="No" onConfirm={onClick}>
                {label}
            </Popconfirm>
        </Menu.Item>
    );
};

export const ConfirmByAction: React.FC<Props> = ({ id }) => {
    const onClickHandler = (type: CONFIRM_TYPE) => () => {
        ordersService.changeStatusToManufactureOrder(id, type);
    };

    const menu = (
        <Menu>
            <Item onClick={onClickHandler(CONFIRM_TYPE.PROJECT_FILE)} label="by project file" />
            <Item onClick={onClickHandler(CONFIRM_TYPE.SCREENSHOT)} label="by screenshot" />
            <Item onClick={onClickHandler(CONFIRM_TYPE.MEETING)} label="by meeting" />
        </Menu>
    );

    return (
        <Dropdown overlay={menu} placement="bottomLeft">
            <ActionButton key="ConfirmBy" type="primary">
                Confirm
            </ActionButton>
        </Dropdown>
    );
};
