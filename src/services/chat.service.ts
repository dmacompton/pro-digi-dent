import { Participant } from "./orders.service";
import { mainAPI } from "../helpers/api";

export type OrderChatMessage = {
    id: number;
    text: string;
    participant: Participant;
};

function getOrderChatMessages(id: number): Promise<{ data: OrderChatMessage[] }> {
    return mainAPI.get(`/api/orders/${id}/messages`).then(({ data }) => data);
}

function sendChatMessage(id: number, text: string): Promise<void> {
    return mainAPI.post(`/api/orders/${id}/messages`, { text }).then(({ data }) => data);
}

function readChatMessage(id: number): Promise<void> {
    return mainAPI.get(`/api/orders/${id}/messages/read`).then(({ data }) => data);
}

export const chatService = {
    getOrderChatMessages,
    sendChatMessage,
    readChatMessage
};
