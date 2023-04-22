import React, { useState } from "react";
import { formItemLayout, tailFormItemLayout } from "../SignIn/SignIn.styles";
import {
    FieldAgreementCheckbox,
    FieldConfirmPassword,
    FieldEmail,
    FieldPassword,
    Fields
} from "../../components/FormFields/Fields";
import { SignUpData, UserFormErrors } from "../../services/user.service";
import { Button, Form, Select } from "antd";
import { Col } from "antd/lib/grid";
import { Link } from "react-router-dom";
import { UserData } from "../../services/admin.service";
import { Loading } from "../../components/Loading";
import styled from "styled-components";

type Props = {
    onFinish: (state: SignUpData, setErrors: (errors: UserFormErrors | undefined) => void) => Promise<void> | void;
    state?: UserData;
    onValuesChange?: (user: UserData) => void;
    isSignUp?: boolean;
    className?: string;
};

const Container = styled.div`
    .loading-container {
        position: absolute;
        z-index: 2;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        background-color: rgba(255, 255, 255, 0.8);
    }
`;

export const UserForm: React.FC<Props> = ({ isSignUp, className, state, ...props }) => {
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

    if (!isSignUp && state === undefined) {
        return (
            <Container>
                <Loading center />
            </Container>
        );
    }

    return (
        <Form
            {...formItemLayout}
            className={className}
            form={form}
            labelWrap={true}
            name={isSignUp ? "register" : "update_user_data"}
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            initialValues={state}
            scrollToFirstError
        >
            <Col offset={4}>
                <h3>Dr. Details</h3>
            </Col>
            <Fields name="name" label="Full name" required={true} disabled={!isSignUp} />
            <FieldEmail
                name="email"
                label="E-mail"
                required={true}
                validateStatus={errors?.email && "error"}
                help={errors?.email?.[0]}
                disabled={!isSignUp}
            />
            <FieldEmail
                name="implastation_email"
                label="Implastation E-mail"
                tooltip="Registration Email used for Implastation"
                validateStatus={errors?.implastation_email && "error"}
                help={errors?.implastation_email?.[0]}
            />

            {isSignUp && (
                <>
                    <FieldPassword validateStatus={errors?.password && "error"} help={errors?.password?.[0]} />
                    <FieldConfirmPassword />
                </>
            )}
            <Fields
                name="phone"
                label="Best contact phone number"
                required={true}
                validateStatus={errors?.phone && "error"}
                help={errors?.phone?.[0]}
            />

            <Fields
                name="implant_types"
                label="Preferable Implant Brands and Types"
                tooltip="This information will be automatically filled in the order form, you can always change it"
                validationMessage="Preferable implant types is required!"
                textarea={true}
            />
            <Fields
                name="drilling_systems"
                label="Surgical kit/s"
                tooltip="This information will be automatically filled in the order form, you can always change it"
                textarea={true}
                validateStatus={errors?.drilling_systems && "error"}
                help={errors?.drilling_systems?.[0]}
            />

            <Form.Item
                name="confirmation"
                label="Preferable method of project confirmation"
                tooltip="This information will be automatically filled in the order form, you can always change it"
                validateStatus={errors?.confirmation && "error"}
                help={errors?.confirmation?.[0]}
            >
                <Select style={{ width: "100%" }}>
                    <Select.Option value={1}>Screenshots</Select.Option>
                    <Select.Option value={2}>Implastation project</Select.Option>
                    <Select.Option value={3}>Online meeting (extra fees may apply)</Select.Option>
                </Select>
            </Form.Item>
            <Col offset={4}>
                <h3>Practice details</h3>
            </Col>
            <Fields name={["practice", "name"]} label="Practice Name" required={true} />
            <FieldEmail
                name={["practice", "email"]}
                label="Email for billing and delivery notifications"
                required={true}
            />
            <Fields name={["practice", "abn"]} label="ABN/ACN" required={true} />
            <Fields name={["practice", "phone"]} label="Phone number" required={true} />
            <Fields name={["practice", "address"]} label="Business address" required={true} textarea={true} />
            <Fields name={["practice", "delivery_address"]} label="Delivery address" required={true} textarea={true} />
            {isSignUp ? (
                <>
                    <FieldAgreementCheckbox link="/" name="agreement-privacy-policy">
                        I have read and agree to <a href="#">Privacy Policy</a>
                    </FieldAgreementCheckbox>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            Continue
                        </Button>
                        <Button type="primary" style={{ margin: "0 8px" }}>
                            <Link to="/login">Back to Login</Link>
                        </Button>
                    </Form.Item>
                </>
            ) : (
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" loading={isLoading}>
                        Update
                    </Button>
                </Form.Item>
            )}
        </Form>
    );
};
