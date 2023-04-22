import { history } from "../../../../helpers/history";
import { DeleteOrder } from "../DeleteOrder";
import React from "react";
import { ActionButton } from "./ActionButton";

type Props = {
    id: number;
};

export const DeleteAction: React.FC<Props> = ({ id }) => {
    return (
        <DeleteOrder
            id={id}
            onDeleted={() =>
                Promise.resolve().then(() => {
                    history.push("/user/orders");
                })
            }
            disabled={false}
        >
            <ActionButton key="delete" type="primary" danger>
                Delete order
            </ActionButton>
        </DeleteOrder>
    );
};
