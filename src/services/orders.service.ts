import { OrderOptions } from "../state/orders/orders.reducer";
import { BillingData, ContentState, ImplantData, ShippingData } from "../pages/UserPages/CreateOrder/types";
import { STATUS } from "../components/Status/Status";
import { UserData } from "./admin.service";
import { AxiosError } from "axios";
import FileSaver from "file-saver";
import { TableMeta } from "../helpers/table";
import { mainAPI } from "../helpers/api";
import { REQUEST_TYPE } from "./orders.service.type";
import { RequestData } from "./admin.service.type";
import { requestErrorHandler } from "../helpers/errorHandler";

export type Activity = {
    created_at: string;
    description: string;
    id: number;
    status?: STATUS;
    user: string;
};

export type Participant = {
    id: number;
    unseen: number;
    user: UserData;
};

export type FileData = {
    created_at: string;
    id: number;
    meta: { size: number; type: string };
    name: string;
    url: string;
};

export type OrderState = ContentState & {
    chat: {
        id: number;
        participants: Participant[];
    };
    files: FileData[];
    id: number;
    number: string;
    status: STATUS;
    billing: BillingData & { id: number };
    shipping: ShippingData & { id: number };
    implants: (ImplantData & { id: number })[];
    user: Omit<UserData, "password" | "password_confirmation">;
    activities: Activity[];
    requests: RequestData[];
};

export type ManagingUserCreateOrder = {
    user_id?: string;
};

function getOrders(data: { currentPage: number; perPage: number }): Promise<{ data: OrderState[]; meta: TableMeta }> {
    return mainAPI.get(`/api/orders?currentPage=${data.currentPage}&perPage=${data.perPage}`).then(({ data }) => data);
}

function getOrderOptions(): Promise<OrderOptions> {
    return mainAPI.get(`/api/orders/options`).then(({ data }) => data);
}

function getOrder(orderNumber: string): Promise<OrderState> {
    return mainAPI.get(`/api/orders/number/${orderNumber}`).then(({ data }) => data.data);
}

const handleError = (e: AxiosError<{ errors: { [name: string]: string[] } }>) => {
    const errorMessage = requestErrorHandler(e);
    throw new Error(errorMessage);
};

async function createOrder(data: ContentState & ManagingUserCreateOrder): Promise<{ data: OrderState }> {
    return mainAPI
        .post(`/api/orders`, data)
        .then(({ data }) => data)
        .catch(handleError);
}

function updateOrder(data: { state: ContentState; id: string }): Promise<{ data: OrderState }> {
    return mainAPI
        .patch(`/api/orders/${data.id}`, data.state)
        .then(({ data }) => data)
        .catch(handleError);
}

async function changeStatusToRefuseOrder(id: number): Promise<{ data: OrderState }> {
    return mainAPI
        .patch(`/api/orders/${id}/refuse`, undefined)
        .then(({ data }) => data)
        .catch(handleError);
}

async function changeStatusToVerifyOrder(id: number): Promise<{ data: OrderState }> {
    return mainAPI
        .patch(`/api/orders/${id}/verify`, undefined)
        .then(({ data }) => data)
        .catch(handleError);
}

async function changeStatusToVerifiedOrder(id: number): Promise<{ data: OrderState }> {
    return mainAPI
        .patch(`/api/orders/${id}/verified`, undefined)
        .then(({ data }) => data)
        .catch(handleError);
}

async function changeStatusToConfirmOrder(id: number): Promise<{ data: OrderState }> {
    return mainAPI
        .patch(`/api/orders/${id}/confirm`, undefined)
        .then(({ data }) => data)
        .catch(handleError);
}

async function changeStatusToCompleteOrder(id: number): Promise<{ data: OrderState }> {
    return mainAPI
        .patch(`/api/orders/${id}/complete`, undefined)
        .then(({ data }) => data)
        .catch(handleError);
}

async function changeStatusToManufactureOrder(id: number, confirmType: number): Promise<{ data: OrderState }> {
    return mainAPI
        .patch(`/api/orders/${id}/manufacture?type=${confirmType}`, undefined)
        .then(({ data }) => data)
        .catch(handleError);
}

async function changeStatusToShippedOrder(id: number): Promise<{ data: OrderState }> {
    return mainAPI
        .patch(`/api/orders/${id}/ship`, undefined)
        .then(({ data }) => data)
        .catch(handleError);
}

async function getOrderActivity(id: number): Promise<{ data: OrderState }> {
    return mainAPI.get(`/api/orders/${id}/activity`);
}

async function getOrderRequests(id: number): Promise<unknown> {
    return mainAPI.get(`/api/orders/${id}/requests`).then(a => console.log("getOrderRequests", a));
}

async function cleanOrderRequest(id: number, requests: number): Promise<unknown> {
    return mainAPI.delete(`/api/orders/${id}/requests/${requests}`);
}

async function requestOrderQuote(id: number): Promise<unknown> {
    return mainAPI.post(`/api/orders/${id}/requests?type=${REQUEST_TYPE.QUOTE}`, undefined);
}

async function requestOrderTracking(id: number): Promise<unknown> {
    return mainAPI.post(`/api/orders/${id}/requests?type=${REQUEST_TYPE.TRACKING_NUMBER}`, undefined);
}

async function printOrder(id: number, number: string): Promise<unknown> {
    return mainAPI
        .get(`/api/orders/${id}/print`, {
            responseType: "blob",
            timeout: 30000
        })
        .then(response => FileSaver.saveAs(response.data, `order-${number}.pdf`));
}

function removeOrder(id: number): Promise<{ acknowledge: boolean }> {
    return mainAPI.delete(`/api/orders/${id}/delete`).then(({ data }) => data);
}

export const ordersService = {
    getOrders,
    createOrder,
    getOrderOptions,
    getOrder,
    updateOrder,
    changeStatusToRefuseOrder,
    changeStatusToVerifyOrder,
    changeStatusToVerifiedOrder,
    changeStatusToConfirmOrder,
    changeStatusToCompleteOrder,
    changeStatusToManufactureOrder,
    changeStatusToShippedOrder,
    getOrderActivity,
    printOrder,
    removeOrder,
    getOrderRequests,
    cleanOrderRequest,
    requestOrderQuote,
    requestOrderTracking
};
