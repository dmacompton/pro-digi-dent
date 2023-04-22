export const enum NOTIFICATION_TYPE {
    COMPLETE = "doctor.order.complete",
    CONFIRMATION = "doctor.order.confirmation",
    CREATED = "doctor.order.created",
    DEVELOPED = "doctor.order.developed",
    MANUFACTURING = "doctor.order.manufacturing",
    REFUSED = "doctor.order.refused",
    SHIPPED = "doctor.order.shipped",
    VERIFIED = "doctor.order.verified"
}

export type NotificationView = Record<NOTIFICATION_TYPE, boolean>;
