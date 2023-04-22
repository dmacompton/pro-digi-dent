import { NOTIFICATION_TYPE } from "../../../state/settings/settings.type";
import { ORDER_TYPE, OrderLabel } from "../../../components/OrderLabel/OrderLabel";
import { STATUS, StatusTag } from "../../../components/Status/Status";

export const notificationTypeToDescription: () => Record<NOTIFICATION_TYPE, React.ReactNode> = () => ({
    [NOTIFICATION_TYPE.COMPLETE]: (
        <>
            You will receive a notification once the design is completed and files are available for download. This
            notification works only for <OrderLabel type={ORDER_TYPE.DESIGN} />
            Only and <OrderLabel type={ORDER_TYPE.CUSTOM} />
            order types
        </>
    ),
    [NOTIFICATION_TYPE.CONFIRMATION]: (
        <>
            You will receive a notification once we prepare the preliminary design and it will require you to take any
            action on the <StatusTag status={STATUS.Confirmation} />
            or request the amendments
        </>
    ),
    [NOTIFICATION_TYPE.CREATED]: (
        <>
            You will be notified when a new order <StatusTag status={STATUS.Pending} /> is lodged
        </>
    ),
    [NOTIFICATION_TYPE.DEVELOPED]: (
        <>
            You will receive the notification once the order is confirmed and the project is being prepared. This
            notification works only for <OrderLabel type={ORDER_TYPE.DESIGN} />
            Only and <OrderLabel type={ORDER_TYPE.CUSTOM} />
            order types
        </>
    ),
    [NOTIFICATION_TYPE.MANUFACTURING]: (
        <>
            You will be notified once the confirmed project is being prepared for
            <StatusTag status={STATUS.Manufacturing} />
        </>
    ),
    [NOTIFICATION_TYPE.REFUSED]: (
        <>
            You will receive a notification if some/all of the files or information provided is not correct or can not
            be used to process the order. The status of the order will return to Order{" "}
            <StatusTag status={STATUS.Verification} />
        </>
    ),
    [NOTIFICATION_TYPE.SHIPPED]: (
        <>
            You will be notified once your order has been <StatusTag status={STATUS.Shipped} />
        </>
    ),
    [NOTIFICATION_TYPE.VERIFIED]: (
        <>
            You will be notified when we verify <StatusTag status={STATUS.Verified} /> all data and start preparing the
            preliminary planning
        </>
    )
});
