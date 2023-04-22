import Echo from "laravel-echo";
import { getAuthorizationHeader } from "./auth";
import { OrderChatMessage } from "../services/chat.service";
import { mapOrderChatMessageToMessage, Message } from "../state/chat/chat.reducer";
import { CONFIG } from "../config/url";
import { getAccessToken } from "./api-jwt";

// @ts-ignore
window.io = require("socket.io-client");

export const registerEcho = () => {
    const options = {
        broadcaster: "socket.io",
        host: CONFIG.echo.host,
        auth: { headers: getAuthorizationHeader() },
        key: CONFIG.echo.key
    };
    return new Echo(options);
};

const updateEchoHeaders = () => {
    // @ts-ignore
    window.Echo.headers = { ...window.Echo.headers, ...getAuthorizationHeader() };
};

// @ts-ignore
if (window.Echo === undefined && getAccessToken() !== undefined) {
    // @ts-ignore
    window.Echo = registerEcho();
    window.document.addEventListener("tokenUpdated", updateEchoHeaders);
}

const getEcho = (): Echo => {
    // @ts-ignore
    return window.Echo as Echo;
};

const listenChatOrder = (id: number, addMessage: (message: Message) => void) => {
    getEcho()
        .private(`order.chat-${id}`)
        // @ts-ignore
        .on("message.created", (data: { message: OrderChatMessage }) => {
            addMessage(mapOrderChatMessageToMessage(data.message));
        });
};

const stopListeningChatOrder = (id: number) => {
    getEcho().private(`order.chat-${id}`).stopListening("message.created");
};

const listenOrderFileCreated = (id: number, fetchNewFiles: () => void) => {
    getEcho()
        .private(`order-${id}`)
        // @ts-ignore
        .on("file.created", (data: unknown) => {
            console.log("echo file.created", data);
            fetchNewFiles();
        });
};

const stopListeningOrderFileCreated = (id: number) => {
    getEcho().private(`order-${id}`).stopListening("file.created");
};

function removeTokenUpdateListener() {
    window.document.removeEventListener("tokenUpdated", echoHelper.updateEchoHeaders);
}

export const echoHelper = {
    listenChatOrder,
    stopListeningChatOrder,
    listenOrderFileCreated,
    stopListeningOrderFileCreated,
    updateEchoHeaders,
    removeTokenUpdateListener
};
