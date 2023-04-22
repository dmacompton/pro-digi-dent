import { Button, Form, Input } from "antd";
import { Col, Row } from "antd/lib/grid";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { formItemLayout, tailFormItemLayout } from "./SignIn.styles";
import { logout } from "../../services/user.service";
import { loginAsync } from "../../state/user/user.action";
import { loadingUserData } from "../../helpers/login";

type Credentials = {
    email: string;
    password: string;
};

const StyledLogoContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 40px;
    margin-bottom: 20px;

    img {
        max-width: 300px;
    }
`;

export const SignInPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const error = useAppSelector(state => state.user.error);
    const isLoading = useAppSelector(state => state.user.isLoading);
    const [form] = Form.useForm<Credentials>();

    const [showError, setShowError] = useState(false);

    useEffect(() => {
        setShowError(false);
    }, [isLoading]);

    useEffect(() => {
        if (error) {
            setShowError(true);
        }
    }, [error]);

    useEffect(logout, []);

    const onFinish = async (state: Credentials) => {
        await dispatch(loginAsync(state));

        loadingUserData(dispatch);
    };

    return (
        <Row justify="center">
            <Col span={12}>
                <StyledLogoContainer>
                    <img src={`${process.env.PUBLIC_URL}/logo-vert.png`} alt="logo" />
                </StyledLogoContainer>

                <Form {...formItemLayout} form={form} name="login" onFinish={onFinish} scrollToFirstError>
                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: "email",
                                message: "E-mail is not valid!"
                            },
                            {
                                required: true,
                                message: "Please input your E-mail!"
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!"
                            }
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout}>
                        <Button loading={isLoading} type="primary" htmlType="submit">
                            Log in
                        </Button>
                        <p style={{ color: "#ff4d4f", padding: "10px 0 0" }}>{showError && error} &nbsp;</p>
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout}>
                        <Button>
                            <Link to="/signup">Sign Up</Link>
                        </Button>
                        <Button style={{ margin: "0 8px" }}>
                            <Link to="/forgot-password">Forgot Password</Link>
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    );
};
