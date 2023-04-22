import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getChatMessagesAsync } from "./chat.action";
import { OrderChatMessage } from "../../services/chat.service";

export type Message = {
    id: number;
    text: string;
    isAdmin: boolean;
    userId: number;
};

type State = {
    messages: Message[];
    isLoading: boolean;
};

const initialState: State = {
    messages: [],
    isLoading: false
};

export const mapOrderChatMessageToMessage = (message: OrderChatMessage): Message => {
    return {
        id: message.id,
        text: message.text,
        userId: message.participant.user.id,
        isAdmin: message.participant.user.is_admin
    };
};

export const chatReducer = createSlice({
    name: "chat",
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages = [...state.messages, action.payload];
        },
        clearChat: state => {
            state.messages = [];
            state.isLoading = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getChatMessagesAsync.fulfilled, (state, action) => {
                state.messages = action.payload.data.map(mapOrderChatMessageToMessage);
                state.isLoading = false;
            })
            .addCase(getChatMessagesAsync.pending, state => {
                state.isLoading = true;
            })
            .addCase(getChatMessagesAsync.rejected, state => {
                state.isLoading = false;
            });
    }
});

export const chatActions = chatReducer.actions;

export default chatReducer.reducer;
