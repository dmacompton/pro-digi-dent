import { Col, Collapse, Row, Typography } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { merge } from "../../../helpers/utils";
import { UserData, UserPasswordData } from "../../../services/admin.service";
import { updateUserDataAsync, updateUserPasswordAsync } from "../../../state/user/user.action";
import { UserForm } from "../../UserForm/UserForm";
import { UserPasswordForm } from "../../UserForm/UserPasswordForm";
import { Notifications } from "./Notifications";
import { getNotificationPreferencesAsync } from "../../../state/settings/settings.action";
import { notificationSuccess } from "../../../adapters/notification";

const { Panel } = Collapse;

const StyledUserPasswordForm = styled(UserPasswordForm)`
    margin-top: 24px;
`;

const StyledRow = styled(Row)`
    height: 100%;
`;
const StyledCollapse = styled(Collapse)`
    margin-bottom: 128px;
`;

const AccountDetailPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.data);

    const [updatedUserData, setUserData] = useState(user);
    const [passwords, setPasswords] = useState<UserPasswordData>({ password: "", password_confirmation: "" });

    useEffect(() => {
        if (user === undefined) {
            return user;
        }

        setUserData({
            ...user,
            confirmation: user.confirmation === undefined ? 0 : user.confirmation
        });
    }, [user]);

    useEffect(() => {
        dispatch(getNotificationPreferencesAsync());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onUpdatePassword = async () => {
        if (!user) return;

        const data = { ...passwords, id: user.id };

        const response = await dispatch(updateUserPasswordAsync(data));

        // @ts-ignore
        if (response.payload.statusText === "OK") {
            notificationSuccess("You have changed your password");
        }

        return Promise.resolve();
    };

    if (user === undefined) {
        return null;
    }

    const onValuesChange = (newUserData: UserData) => {
        const updatedUserData = merge(newUserData, user);

        setUserData(updatedUserData);
    };

    const onPasswordValuesChange = (newPasswords: Partial<UserPasswordData>) => {
        const updatedPasswords = merge(newPasswords, passwords) as UserPasswordData;

        setPasswords(updatedPasswords);
    };

    const onUpdate = async () => {
        if (updatedUserData === undefined) {
            return;
        }

        dispatch(updateUserDataAsync(updatedUserData));
        return Promise.resolve();
    };

    return (
        <StyledRow>
            <Col span={20} offset={2}>
                <Typography.Title level={4} style={{ padding: "20px 20px 0 20px" }}>
                    Settings
                </Typography.Title>

                <StyledCollapse>
                    <Panel header="Update Account Details" key="account">
                        <UserForm onValuesChange={onValuesChange} state={updatedUserData} onFinish={onUpdate} />
                    </Panel>
                    <Panel header="Change Password" key="password">
                        <StyledUserPasswordForm
                            onValuesChange={onPasswordValuesChange}
                            state={updatedUserData}
                            onFinish={onUpdatePassword}
                        />
                    </Panel>
                    <Panel header="Notification settings" key="notification">
                        <Notifications />
                    </Panel>
                </StyledCollapse>
            </Col>
        </StyledRow>
    );
};

export default AccountDetailPage;
