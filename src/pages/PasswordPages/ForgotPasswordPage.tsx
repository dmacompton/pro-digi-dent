import { Button, Form } from "antd";
import { Col, Row } from "antd/lib/grid";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FieldEmail } from "../../components/FormFields/Fields";
import { UserFormErrors, userService } from "../../services/user.service";
import { formItemLayout, tailFormItemLayout } from "../SignIn/SignIn.styles";

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
};

export const ForgotPasswordPage: React.FC = () => {
    const [showRegistrationSuccess, setRegistrationSuccess] = useState(false);
    const [form] = Form.useForm<FormProps>();

    const [isLoading, setLoading] = useState(false);

    const [errors, setErrors] = useState<UserFormErrors | undefined>();

    const onValuesChange = () => {
        setErrors(undefined);
    };

    const onFinish = async (state: FormProps) => {
        try {
            setLoading(true);

            const response = await userService.forgotPassword(state);

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
                        <h3>Your password is successfully reset.</h3>
                        <h3 style={{ paddingBottom: 24 }}>Check your email.</h3>
                        <Button type="primary">
                            <Link to="/login">Login</Link>
                        </Button>
                    </Col>
                ) : (
                    <Form
                        {...formItemLayout}
                        form={form}
                        labelWrap={true}
                        name="forgot_password"
                        onFinish={onFinish}
                        onValuesChange={onValuesChange}
                        scrollToFirstError
                    >
                        <Col offset={6}>
                            <h3>Forgot Password</h3>
                        </Col>

                        <FieldEmail
                            name="email"
                            label="E-mail"
                            required={true}
                            validateStatus={errors?.email && "error"}
                            help={errors?.email?.[0]}
                        />

                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" loading={isLoading}>
                                Receive new Password
                            </Button>
                            <Button type="primary" style={{ margin: "0 8px" }}>
                                <Link to="/login">Back to Login</Link>
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </Col>
        </Row>
    );
};
