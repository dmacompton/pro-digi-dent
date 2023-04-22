import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "../state/user/user.reducer";
import adminReducer from "../state/admin/admin.reducer";
import ordersReducer from "../state/orders/orders.reducer";
import chatReducer from "../state/chat/chat.reducer";
import settingsReducer from "../state/settings/settings.reducer";

export const store = configureStore({
    reducer: {
        user: userReducer,
        admin: adminReducer,
        orders: ordersReducer,
        chat: chatReducer,
        settings: settingsReducer
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
