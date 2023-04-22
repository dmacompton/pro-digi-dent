import { notification } from "antd";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { NotificationInstance } from "antd/lib/notification";

export const notificationError = (message: string) => {
    notification.open({
        message,
        icon: <CloseCircleOutlined style={{ color: "red" }} />
    });
};

export const notificationSuccess = (message: string) => {
    notification.open({
        message,
        icon: <CheckCircleOutlined style={{ color: "green" }} />
    });
};

export const showNotification: NotificationInstance["open"] = props => {
    notification.open(props);
};
