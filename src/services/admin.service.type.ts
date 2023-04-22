import { STATUS } from "../components/Status/Status";
import { REQUEST_TYPE } from "./orders.service.type";

export type RequestData = {
    id: number;
    type: REQUEST_TYPE;
    seen: boolean;
    meta: [];
    created_at: string;
    order: {
        id: number;
        number: string;
        doctor_name: string;
        patient_name: string;
        type: STATUS;
    };
};

type OrderData = {
    total: number;
    type: STATUS;
};

type UnreadMessageData = {
    id: number;
    unseen: number;
    order: {
        doctor_name: string;
        patient_name: string;
        id: number;
        number: string;
        type: STATUS;
    };
};

export type DashboardData = {
    orders: OrderData[];
    requests: RequestData[];
    unread_messages: UnreadMessageData[];
};
