import { NOTIFICATION_TYPE } from "../state/settings/settings.type";
import { mainAPI } from "../helpers/api";

export type NotificationPreference = {
    type: NOTIFICATION_TYPE;
    enabled: boolean;
};

function getNotificationPreferences(): Promise<NotificationPreference[]> {
    return mainAPI.get("/api/users/notification_preferences").then(({ data }) => data);
}

function updateNotificationPreferences(data: NotificationPreference[]): Promise<NotificationPreference[]> {
    return mainAPI.patch("/api/users/notification_preferences", data).then(({ data }) => data);
}

function getNotificationLabelPreferences(): Promise<Record<NOTIFICATION_TYPE, string>> {
    return mainAPI.get("/api/users/available_notification_preferences").then(({ data }) => data);
}

export const settingsService = {
    getNotificationPreferences,
    updateNotificationPreferences,
    getNotificationLabelPreferences
};
