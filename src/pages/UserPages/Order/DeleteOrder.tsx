import React from "react";
import { ordersService } from "../../../services/orders.service";
import { Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { showNotification } from "../../../adapters/notification";

type Props = {
    id: number;
    onDeleted: () => Promise<void>;
    disabled: boolean;
};

export const DeleteOrder: React.FC<Props> = props => {
    return (
        <Popconfirm
            title="Are you sure delete this order?"
            okText="Yes"
            cancelText="No"
            disabled={props.disabled}
            onConfirm={async () => {
                const result = await ordersService.removeOrder(props.id);

                if (result.acknowledge) {
                    await props.onDeleted();

                    showNotification({
                        message: "Order was deleted successfully",
                        icon: <DeleteOutlined style={{ color: "red" }} />
                    });
                }
            }}
        >
            {props.children}
        </Popconfirm>
    );
};
