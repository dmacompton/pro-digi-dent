import { history } from "./history";

export const createOrderUrl = (isAdmin: boolean | undefined, orderId: string, getParam?: string) => {
    if (isAdmin) {
        if (getParam) {
            return `/admin/order/${orderId}?${getParam}`;
        }
        return `/admin/order/${orderId}`;
    } else {
        return `/user/order/${orderId}`;
    }
};

export const orderReturnHandler = (isAdmin: boolean | undefined, id: string) => () => {
    const url = createOrderUrl(isAdmin, id);
    history.push(url);
};
