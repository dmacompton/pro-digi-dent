import { Button, Result } from "antd";
import { Col, Row } from "antd/lib/grid";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserData } from "../../services/admin.service";
import {
    isSignUpErrorResponse,
    isSignUpSuccessResponse,
    SignUpData,
    UserFormErrors,
    userService
} from "../../services/user.service";
import { UserForm } from "../UserForm/UserForm";
import { TermsConditionsStep } from "./TermsConditionsStep";

const StyledLogoContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 40px;
    margin-bottom: 20px;

    img {
        max-width: 150px;
    }
`;

const signUpDataToUserData = (data: SignUpData): UserData => {
    return {
        id: 0,
        active: 0,
        confirmation: data.confirmation,
        drilling_systems: data.drilling_systems,
        email: data.email,
        implant_types: data.implant_types,
        implastation_email: data.implastation_email,
        name: data.name,
        password: data.password,
        phone: data.phone,
        is_admin: false,
        practice: data.practice
    };
};

export const SignUpPage: React.FC = () => {
    const [showRegistrationSuccess, setRegistrationSuccess] = useState(false);
    const [state, setState] = useState<SignUpData>();
    const [currentPage, setCurrentPage] = useState<number>(1);

    const onContinue = (formState: SignUpData) => {
        setState(formState);
        setCurrentPage(2);
    };

    const onReturn = () => {
        setCurrentPage(1);
    };

    const onFinish = async (setErrors: (errors: UserFormErrors | undefined) => void) => {
        if (state === undefined) {
            return;
        }

        try {
            const response = await userService.signup(state);

            if (isSignUpSuccessResponse(response)) {
                setRegistrationSuccess(response.acknowledge);
            }

            if (isSignUpErrorResponse(response)) {
                setErrors(response.errors);
            }
        } catch (e) {
            setErrors(undefined);
        }
    };

    return (
        <Row justify="center">
            <Col span={12}>
                <StyledLogoContainer>
                    <img src={`${process.env.PUBLIC_URL}/logo-vert.png`} alt="logo" />
                </StyledLogoContainer>

                {showRegistrationSuccess ? (
                    <Result
                        status="success"
                        title="Registration is successful."
                        subTitle={
                            <>
                                Wait for activation from admin.
                                <br />
                                You will receive an email.
                            </>
                        }
                        extra={
                            <Button type="primary">
                                <Link to="/login">Login</Link>
                            </Button>
                        }
                        style={{ marginTop: 24 }}
                    />
                ) : currentPage === 1 ? (
                    <UserForm
                        state={state ? signUpDataToUserData(state) : undefined}
                        isSignUp={true}
                        onFinish={onContinue}
                    />
                ) : (
                    <TermsConditionsStep onFinish={onFinish} onReturn={onReturn} />
                )}
            </Col>
        </Row>
    );
};
