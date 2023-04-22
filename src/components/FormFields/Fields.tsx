import { Checkbox, Col, DatePicker, Form, Input, InputNumber, Radio, Row, Select } from "antd";
import { tailFormItemLayout } from "../../pages/SignIn/SignIn.styles";
import {
    FieldAgreementCheckboxProps,
    FieldCheckboxGroupValue,
    FieldCheckboxProps,
    FieldDateProps,
    FieldNumberProps,
    FieldRadioProps,
    FieldSelectProps,
    FieldTextProps
} from "./types";
import { useMemo } from "react";
import { Rule } from "antd/lib/form";
import { DEFAULT_DATE_FORMAT } from "../../helpers/date";

export const Fields: React.FC<FieldTextProps> = ({
    label,
    name,
    required,
    rules = [],
    textarea,
    tooltip,
    validationMessage,
    disabled,
    validateStatus,
    help,
    style
}) => {
    const ruleData = [...rules];

    if (required) {
        ruleData.push({
            required: true,
            max: 255,
            message: validationMessage || `${label} is required!`
        });
    }

    return (
        <Form.Item
            hasFeedback={true}
            name={name}
            label={label}
            rules={ruleData}
            tooltip={tooltip}
            validateStatus={validateStatus}
            help={help}
        >
            {textarea ? <Input.TextArea disabled={disabled} style={style} /> : <Input disabled={disabled} />}
        </Form.Item>
    );
};

export const FieldNumber: React.FC<FieldNumberProps> = ({
    label,
    name,
    required,
    rules = [],
    placeholder,
    tooltip,
    disabled,
    wrapperCol,
    fieldKey,
    max,
    validationMessage
}) => {
    const ruleData = [...rules];

    if (required) {
        ruleData.push({
            required: true,
            max: 255,
            message: validationMessage || `${label} is required!`
        });
    }

    return (
        <Form.Item
            fieldKey={fieldKey}
            wrapperCol={wrapperCol}
            name={name}
            label={label}
            rules={ruleData}
            tooltip={tooltip}
        >
            <InputNumber
                min={0}
                max={max}
                placeholder={placeholder}
                disabled={disabled}
                style={{
                    width: "100%"
                }}
            />
        </Form.Item>
    );
};

export const FieldEmail: React.FC<FieldTextProps> = props => {
    return (
        <Fields
            {...props}
            rules={[
                {
                    type: "email",
                    message: "E-mail is not valid!"
                }
            ]}
        />
    );
};

export const FieldPassword: React.FC<Omit<FieldTextProps, "name">> = props => {
    return (
        <Form.Item
            {...props}
            name="password"
            label="Password"
            rules={[
                {
                    min: 8,
                    message: "Minimum length of password should be at least 8 characters"
                },
                {
                    required: true,
                    message: "Please input your password!"
                }
            ]}
            hasFeedback
        >
            <Input.Password />
        </Form.Item>
    );
};

export const FieldConfirmPassword: React.FC = () => {
    return (
        <Form.Item
            name="password_confirmation"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
                {
                    required: true,
                    message: "Please enter your password again!"
                },
                {
                    min: 8,
                    message: "Minimum length of password should be at least 8 characters"
                },
                ({ getFieldValue }) => ({
                    validator(rule, value) {
                        if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                        }

                        return Promise.reject("The two passwords that you entered do not match!");
                    }
                })
            ]}
        >
            <Input.Password />
        </Form.Item>
    );
};

export const FieldAgreementCheckbox: React.FC<FieldAgreementCheckboxProps> = ({
    name,
    children,
    link,
    useStyled = true,
    disabled
}) => {
    return (
        <Form.Item
            name={name}
            valuePropName="checked"
            rules={[
                {
                    validator: (_, value) => (value ? Promise.resolve() : Promise.reject("Should accept agreement"))
                }
            ]}
            {...(useStyled ? tailFormItemLayout : {})}
        >
            <Checkbox disabled={disabled}>
                {children || (
                    <>
                        I have read the <a href={link}>agreement</a>
                    </>
                )}
            </Checkbox>
        </Form.Item>
    );
};

export const FieldCheckbox: React.FC<FieldCheckboxProps> = ({
    name,
    label,
    labelCol,
    wrapperCol,
    fieldKey,
    disabled
}) => {
    return (
        <Form.Item fieldKey={fieldKey} labelCol={labelCol} wrapperCol={wrapperCol} name={name} valuePropName="checked">
            <Checkbox disabled={disabled}>{label}</Checkbox>
        </Form.Item>
    );
};

export const FieldCheckboxGroup: React.FC<
    FieldCheckboxProps & {
        values: FieldCheckboxGroupValue[];
    }
> = ({ name, label, values, labelCol, wrapperCol, disabled }) => {
    return (
        <Form.Item labelCol={labelCol} wrapperCol={wrapperCol} name={name} label={label}>
            <Checkbox.Group>
                <Row>
                    <Col>
                        {values.map(({ value, label }) => (
                            <Checkbox
                                key={`${value}-${label}`}
                                value={value}
                                style={{
                                    lineHeight: "32px"
                                }}
                                disabled={disabled}
                            >
                                {label}
                            </Checkbox>
                        ))}
                    </Col>
                </Row>
            </Checkbox.Group>
        </Form.Item>
    );
};

export const FieldRadio: React.FC<FieldRadioProps> = ({
    name,
    label,
    disabled,
    required,
    validateMessage,
    tooltip,
    onChange,
    values
}) => {
    const rules = useMemo(
        () => (required ? [{ required: required, message: validateMessage }] : undefined),
        [required, validateMessage]
    );

    return (
        <Form.Item name={name} label={label} rules={rules} tooltip={tooltip}>
            <Radio.Group onChange={onChange} disabled={disabled}>
                {values.map(({ label, value }) => (
                    <Radio.Button key={value} value={value}>
                        {label}
                    </Radio.Button>
                ))}
            </Radio.Group>
        </Form.Item>
    );
};

export const FieldSelect: React.FC<FieldSelectProps> = ({
    name,
    label,
    required,
    values,
    validateMessage,
    disabled
}) => {
    const rules = useMemo(
        () => (required ? [{ required: required, message: validateMessage }] : undefined),
        [required, validateMessage]
    );

    return (
        <Form.Item hasFeedback name={name} label={label} rules={rules} required={required}>
            <Select disabled={disabled} style={{ width: "100%" }}>
                {values.map(({ label, value }) => (
                    <Select.Option key={value} value={+value}>
                        {label}
                    </Select.Option>
                ))}
            </Select>
        </Form.Item>
    );
};

export const FieldDate: React.FC<FieldDateProps> = ({ disabled, disabledDate, name, label, tooltip, required }) => {
    const rules: Rule[] = required
        ? [
              {
                  type: "object",
                  required: true,
                  message: `Please select ${label}!`
              }
          ]
        : [];

    return (
        <Form.Item name={name} label={label} tooltip={tooltip} rules={rules}>
            <DatePicker
                showToday={false}
                disabledDate={disabledDate}
                disabled={disabled}
                format={DEFAULT_DATE_FORMAT}
            />
        </Form.Item>
    );
};
