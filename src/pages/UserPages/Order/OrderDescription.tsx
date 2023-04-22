import { Descriptions } from "antd";
import { OrderState } from "../../../services/orders.service";
import { prepareDataForView } from "./utils";
import { OrderOptions } from "../../../state/orders/orders.reducer";

type Props = {
    order: OrderState;
    keys: Partial<keyof OrderState>[];
    options: OrderOptions;
};

export const OrderDescription: React.FC<Props> = ({ order, keys, options }) => {
    const details = prepareDataForView(keys, options, order);

    return (
        <Descriptions bordered size="small" column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
            {details.map(([key, value], i) =>
                value ? (
                    <Descriptions.Item label={key} key={i}>
                        {value}
                    </Descriptions.Item>
                ) : null
            )}
        </Descriptions>
    );
};
