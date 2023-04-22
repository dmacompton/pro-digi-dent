import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { getNotificationPreferencesAsync, updateNotificationPreferencesAsync } from "./settings.action";
import { NotificationView } from "./settings.type";

type State = {
    isLoading: boolean;
    notification: Partial<NotificationView>;
};

const initialState: State = {
    isLoading: false,
    notification: {}
};

export const settingsReducer = createSlice({
    name: "settings",
    initialState,
    reducers: {
        loading: state => {
            state.isLoading = true;
        },
        updateNotificationPreferences: (state, action: PayloadAction<NotificationView>) => {
            state.notification = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getNotificationPreferencesAsync.fulfilled, (state, action) => {
                state.notification = action.payload.reduce((acc, item) => ({ ...acc, [item.type]: item.enabled }), {});
            })
            .addMatcher(
                isAnyOf(
                    getNotificationPreferencesAsync.rejected,
                    getNotificationPreferencesAsync.fulfilled,
                    updateNotificationPreferencesAsync.rejected,
                    updateNotificationPreferencesAsync.fulfilled
                ),
                state => {
                    state.isLoading = false;
                }
            );
    }
});

export const settingsActions = settingsReducer.actions;

export default settingsReducer.reducer;
