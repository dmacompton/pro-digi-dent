import { Button, Form } from "antd";
import { Col } from "antd/lib/grid";
import React, { useState } from "react";
import { FieldConfirmPassword, FieldPassword } from "../../components/FormFields/Fields";
import { UserData } from "../../services/admin.service";
import { SignUpData, UserFormErrors } from "../../services/user.service";
import { formItemLayout, tailFormItemLayout } from "../SignIn/SignIn.styles";

type Props = {
    onFinish: (state: SignUpData, setErrors: (errors: UserFormErrors | undefined) => void) => Promise<void>;
    state?: UserData;
    onValuesChange?: (user: UserData) => void;
    className?: string;
};

export const UserPasswordForm: React.FC<Props> = ({ className, state, ...props }) => {
    const [form] = Form.useForm<SignUpData>();

    const [isLoading, setLoading] = useState(false);

    const [errors, setErrors] = useState<UserFormErrors | undefined>();

    const onValuesChange = (newUserData: UserData) => {
        props.onValuesChange?.(newUserData);
        setErrors(undefined);
    };

    const onFinish = async (state: SignUpData) => {
        setErrors(undefined);
        setLoading(true);

        await props.onFinish(state, setErrors);

        setLoading(false);
    };

    return (
        <Form
            {...formItemLayout}
            className={className}
            form={form}
            labelWrap={true}
            name="update_password"
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            scrollToFirstError
        >
            <Col offset={4}>
                <h3>Password update</h3>
            </Col>

            <FieldPassword validateStatus={errors?.password && "error"} help={errors?.password?.[0]} />
            <FieldConfirmPassword />

            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                    Update password
                </Button>
            </Form.Item>
        </Form>
    );
};
