import { Button, Form } from "antd";
import { Col, Row } from "antd/lib/grid";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { userService } from "../../services/user.service";
import { formItemLayout, tailFormItemLayout } from "../SignIn/SignIn.styles";
import { FieldConfirmPassword, FieldEmail, FieldPassword, Fields } from "../../components/FormFields/Fields";

const StyledLogoContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 40px;
    margin-bottom: 20px;

    img {
        max-width: 300px;
    }
`;

type FormProps = {
    email: string;
    password: string;
    token: string;
};

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => {
        const query = new URLSearchParams(search.replace("&amp;", "&"));
        return {
            token: query.get("token"),
            email: query.get("email")
        };
    }, [search]);
}

type ResetPasswordErrors = Record<Partial<keyof Partial<FormProps>>, string[]>;

export const ResetPasswordPage: React.FC = () => {
    const [showRegistrationSuccess, setRegistrationSuccess] = useState(false);
    const [form] = Form.useForm<FormProps>();
    const query = useQuery();

    const [isLoading, setLoading] = useState(false);

    const [errors, setErrors] = useState<ResetPasswordErrors | undefined>();

    const onValuesChange = () => {
        setErrors(undefined);
    };

    const onFinish = async (state: FormProps) => {
        try {
            setLoading(true);

            const response = await userService.resetPassword(state);

            if (response.statusText === "OK" && response.data.acknowledge) {
                setRegistrationSuccess(true);
            }
        } catch (e) {
            setLoading(false);
        }
    };

    return (
        <Row justify="center">
            <Col span={12}>
                <StyledLogoContainer>
                    <img src={`${process.env.PUBLIC_URL}/logo-vert.png`} alt="logo" />
                </StyledLogoContainer>

                {showRegistrationSuccess ? (
                    <Col style={{ textAlign: "center", paddingTop: 24 }}>
                        <h3>You password is successfully reset.</h3>
                        <h3 style={{ paddingBottom: 24 }}>You can now log in with new password.</h3>
                        <Button type="primary">
                            <Link to="/login">Login</Link>
                        </Button>
                    </Col>
                ) : (
                    <Form
                        {...formItemLayout}
                        form={form}
                        labelWrap={true}
                        initialValues={{ ...query, password: "" }}
                        name="reset_password"
                        onFinish={onFinish}
                        onValuesChange={onValuesChange}
                        scrollToFirstError
                    >
                        <Col offset={6}>
                            <h3>Reset Password</h3>
                        </Col>

                        <FieldEmail
                            name="email"
                            label="E-mail"
                            required={true}
                            disabled={true}
                            validateStatus={errors?.email && "error"}
                            help={errors?.email?.[0]}
                        />
                        <Fields
                            name="token"
                            label="Token"
                            required={true}
                            disabled={true}
                            validateStatus={errors?.token && "error"}
                            help={errors?.token?.[0]}
                        />

                        <FieldPassword />
                        <FieldConfirmPassword />

                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                Update Password
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Col>
        </Row>
    );
};
