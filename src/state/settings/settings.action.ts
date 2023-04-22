import { createAsyncThunk } from "@reduxjs/toolkit";
import { NotificationPreference, settingsService } from "../../services/settings.service";

export const getNotificationPreferencesAsync = createAsyncThunk("setting/getNotificationPreferences", async () => {
    return await settingsService.getNotificationPreferences();
});

export const updateNotificationPreferencesAsync = createAsyncThunk(
    "setting/updateNotificationPreferences",
    async (data: NotificationPreference[]) => {
        return await settingsService.updateNotificationPreferences(data);
    }
);
