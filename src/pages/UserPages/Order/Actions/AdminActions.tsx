import { Dropdown, Menu } from "antd";
import React, { useMemo } from "react";
import { ActionButton } from "./ActionButton";
import {
    changeOrderStatusToCompleteAsync,
    changeOrderStatusToConfirmAsync,
    changeOrderStatusToManufactureAsync,
    changeOrderStatusToRefuseAsync,
    changeOrderStatusToShippedAsync,
    changeOrderStatusToVerifiedAsync,
    changeOrderStatusToVerifyAsync
} from "../../../../state/orders/orders.action";
import { useAppDispatch } from "../../../../app/hooks";
import { ORDER_TYPE } from "../../../../components/OrderLabel/OrderLabel";

type Props = {
    id: number;
    orderType: ORDER_TYPE | undefined;
};

export const AdminActions: React.FC<Props> = ({ id, orderType }) => {
    const dispatch = useAppDispatch();

    const actions = useMemo(
        () => [
            { label: "Pending", onClick: () => console.log("Pending") },
            { label: "Verification", onClick: () => dispatch(changeOrderStatusToVerifyAsync(id)) },
            { label: "Not Approved", onClick: () => dispatch(changeOrderStatusToRefuseAsync(id)) },
            { label: "Verified", onClick: () => dispatch(changeOrderStatusToVerifiedAsync(id)) },
            { label: "Confirmation", onClick: () => dispatch(changeOrderStatusToConfirmAsync(id)) },
            { label: "Manufacturing", onClick: () => dispatch(changeOrderStatusToManufactureAsync(id)) },
            orderType === ORDER_TYPE.DESIGN
                ? { label: "Design Completed", onClick: () => dispatch(changeOrderStatusToCompleteAsync(id)) }
                : { label: "Shipped", onClick: () => dispatch(changeOrderStatusToShippedAsync(id)) }
        ],
        [dispatch, id, orderType]
    );

    const menu = (
        <Menu>
            {actions.map(({ label, onClick }, index) => (
                <Menu.Item key={label} onClick={onClick}>
                    {index + 1} - {label}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <Dropdown overlay={menu} placement="bottomLeft">
            <ActionButton key="ConfirmBy" type="default">
                Change status
            </ActionButton>
        </Dropdown>
    );
};
