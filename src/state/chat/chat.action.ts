import { createAsyncThunk } from "@reduxjs/toolkit";
import { chatService } from "../../services/chat.service";

export const getChatMessagesAsync = createAsyncThunk("chat/getChatMessages", async (id: number) => {
    return await chatService.getOrderChatMessages(id);
});

export const readChatMessagesAsync = createAsyncThunk("chat/readChatMessages", async (id: number) => {
    return await chatService.readChatMessage(id);
});
