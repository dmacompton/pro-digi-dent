import { Divider, Form } from "antd";
import React, { useCallback } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { FieldCheckbox } from "../../../components/FormFields/Fields";
import { Loading } from "../../../components/Loading";
import { NotificationPreference } from "../../../services/settings.service";
import { SignUpData } from "../../../services/user.service";
import { updateNotificationPreferencesAsync } from "../../../state/settings/settings.action";
import { settingsActions } from "../../../state/settings/settings.reducer";
import { NotificationView, NOTIFICATION_TYPE } from "../../../state/settings/settings.type";
import { notificationTypeToDescription } from "./NotificationsData";

type Props = {
    className?: string;
};

const notificationTypes = [
    NOTIFICATION_TYPE.COMPLETE,
    NOTIFICATION_TYPE.CONFIRMATION,
    NOTIFICATION_TYPE.CREATED,
    NOTIFICATION_TYPE.DEVELOPED,
    NOTIFICATION_TYPE.MANUFACTURING,
    NOTIFICATION_TYPE.REFUSED,
    NOTIFICATION_TYPE.SHIPPED,
    NOTIFICATION_TYPE.VERIFIED
];

const Container = styled.div`
    .ant-form-item-label > label {
        width: 600px;
        text-align: left;
    }

    .ant-form-item {
        justify-content: center;
        align-items: center;
    }

    .ant-form-item-control {
        overflow: hidden;
    }

    .ant-form-item-control-input {
        column-gap: 14px;
        padding: 0 24px;
        width: 640px;
        margin: auto;
    }
`;

const StyledLoading = styled(Loading)`
    text-align: center;
    width: 100%;
`;

const valueToNotificationPreferences = (notification: Partial<NotificationView>) => {
    return Object.keys(notification).map(key => {
        const type = key as NOTIFICATION_TYPE;
        return {
            type,
            enabled: Boolean(notification[type])
        };
    });
};

export const Notifications: React.FC<Props> = ({ className }) => {
    const dispatch = useAppDispatch();
    const notification = useAppSelector(state => state.settings.notification);
    const isLoading = useAppSelector(state => state.settings.isLoading);

    const [form] = Form.useForm<SignUpData>();

    const onValuesChange = useCallback(
        (newNotification: Partial<NotificationView>) => {
            const data = {
                ...notification,
                ...newNotification
            } as NotificationView;

            const preference: NotificationPreference[] = valueToNotificationPreferences(data);

            dispatch(updateNotificationPreferencesAsync(preference));
            dispatch(settingsActions.updateNotificationPreferences(data));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [notification]
    );

    if (isLoading) {
        return <StyledLoading />;
    }

    return (
        <Container>
            <Form
                className={className}
                form={form}
                labelWrap={true}
                initialValues={notification}
                name="settings_notification"
                onValuesChange={onValuesChange}
            >
                {notificationTypes.map((type, index) => (
                    <>
                        <FieldCheckbox name={type} label={notificationTypeToDescription()[type]} fieldKey={type} />
                        {notificationTypes.length - 1 !== index && <Divider />}
                    </>
                ))}
            </Form>
        </Container>
    );
};
