import { Col, Form } from "antd";
import { Moment } from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { FieldCheckbox, FieldDate, FieldEmail, FieldRadio, Fields } from "../../../components/FormFields/Fields";
import { ORDER_LABEL, ORDER_TYPE } from "../../../components/OrderLabel/OrderLabel";
import { merge } from "../../../helpers/utils";
import { FooterStep, tailFormItemLayout } from "./FooterStep";
import { formItemLayout } from "./helper";
import { ContentProps, FormState } from "./types";
import { useAppSelector } from "../../../app/hooks";

const ORDER_TYPE_DATA = [
    { value: ORDER_TYPE.DESIGN_PRINT, label: ORDER_LABEL[ORDER_TYPE.DESIGN_PRINT] },
    { value: ORDER_TYPE.DESIGN, label: ORDER_LABEL[ORDER_TYPE.DESIGN] },
    { value: ORDER_TYPE.PRINT, label: ORDER_LABEL[ORDER_TYPE.PRINT] },
    { value: ORDER_TYPE.CUSTOM, label: ORDER_LABEL[ORDER_TYPE.CUSTOM] }
];

export enum PAYOR_TYPE {
    HOSPITAL = 1,
    INSURANCE = 2,
    PATIENT = 3
}

export const PAYOR_LABEL: Record<PAYOR_TYPE, string> = {
    [PAYOR_TYPE.HOSPITAL]: "Public Hospital",
    [PAYOR_TYPE.INSURANCE]: "Private Insurance",
    [PAYOR_TYPE.PATIENT]: "Patient"
};

const PAYOR_TYPE_DATA = [
    { value: PAYOR_TYPE.HOSPITAL, label: PAYOR_LABEL[PAYOR_TYPE.HOSPITAL] },
    { value: PAYOR_TYPE.INSURANCE, label: PAYOR_LABEL[PAYOR_TYPE.INSURANCE] },
    { value: PAYOR_TYPE.PATIENT, label: PAYOR_LABEL[PAYOR_TYPE.PATIENT] }
];

export const Step1: React.FC<ContentProps> = ({ state, setState, disabled, ...props }) => {
    const [form] = Form.useForm();
    const user = useAppSelector(state => state.user.data);
    const [userInitialized, setUserInitialized] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setUserInitialized(user !== undefined);
        }, 0);
    }, [user]);

    const onChangeValue = useCallback(
        (
            newState: FormState & {
                patient_dob?: Moment;
                required_date?: Moment;
                surgery_date?: Moment;
            }
        ) => {
            const updatedState = merge(newState, state);

            if (newState.patient_dob && typeof newState.patient_dob !== "string") {
                updatedState.patient_dob = newState.patient_dob.format("YYYY-MM-DD");
            }

            if (newState.required_date && typeof newState.required_date !== "string") {
                updatedState.required_date = newState.required_date.format("YYYY-MM-DD");
            }

            if (newState.surgeryDateNA !== undefined) {
                form.setFieldsValue({
                    surgery_date: undefined
                });
            }

            if (newState.requiredDateNA !== undefined) {
                form.setFieldsValue({
                    required_date: undefined
                });
            }

            if (newState.surgery_date && typeof newState.surgery_date !== "string") {
                updatedState.surgery_date = newState.surgery_date.format("YYYY-MM-DD");
            }

            setState(updatedState);
        },
        [state, setState, form]
    );

    if (!userInitialized) {
        return null;
    }

    const required = !disabled;

    return (
        <Form
            {...formItemLayout}
            form={form}
            name="create_new_order_step1"
            initialValues={state}
            onValuesChange={onChangeValue}
            scrollToFirstError
        >
            <FieldRadio
                label="Order type"
                name="type"
                tooltip="Choose the type of order"
                validateMessage="Choose the type of order"
                values={ORDER_TYPE_DATA}
                required={required && true}
                disabled={disabled}
            />
            <Col offset={6}>
                <h3>Dr. Details</h3>
            </Col>
            <Fields name="doctor_name" label="Dr. Name" required={required && true} disabled={disabled} />
            <FieldEmail name="contact_email" label="Contact email" required={required && true} disabled={disabled} />
            <Fields name="contact_number" label="Contact number" required={required && true} disabled={disabled} />
            <Fields name="practice_name" label="Practice name" required={required && true} disabled={disabled} />
            <Fields name="patient_name" label="Patient name" required={required && true} disabled={disabled} />
            <FieldDate
                name="patient_dob"
                label="Patient DOB"
                tooltip="Patient date of birth"
                required={required && true}
                disabled={disabled}
                disabledDate={currentDate => currentDate.isAfter()}
            />
            <Form.Item noStyle shouldUpdate={(prev, current) => prev.surgeryDateNA !== current.surgeryDateNA}>
                {({ getFieldValue }) => {
                    const isDateNA = getFieldValue("surgeryDateNA");

                    return (
                        <FieldDate
                            name="surgery_date"
                            label="Surgery Date"
                            required={required && !isDateNA}
                            disabled={isDateNA || disabled}
                            disabledDate={currentDate => currentDate.isBefore()}
                        />
                    );
                }}
            </Form.Item>
            <FieldCheckbox {...tailFormItemLayout} name="surgeryDateNA" label="Surgery Date N/A" disabled={disabled} />
            <Form.Item noStyle shouldUpdate={(prev, current) => prev.requiredDateNA !== current.requiredDateNA}>
                {({ getFieldValue }) => {
                    const isDateNA = getFieldValue("requiredDateNA");

                    return (
                        <FieldDate
                            name="required_date"
                            label="Required Date"
                            required={required && !isDateNA}
                            disabled={isDateNA || disabled}
                            disabledDate={currentDate => currentDate.isBefore()}
                        />
                    );
                }}
            </Form.Item>

            <FieldCheckbox
                {...tailFormItemLayout}
                name="requiredDateNA"
                label="Required Date N/A"
                disabled={disabled}
            />
            <FieldRadio
                label="Payor"
                name={["payor", "type"]}
                tooltip="Choose payor"
                validateMessage="Choose payor"
                values={PAYOR_TYPE_DATA}
                required={required && true}
                disabled={disabled}
            />
            <Form.Item noStyle shouldUpdate={(prev, current) => prev.payor?.type !== current.payor?.type}>
                {({ getFieldValue }) => {
                    const { type } = getFieldValue("payor") || {};

                    if (type === PAYOR_TYPE.HOSPITAL) {
                        return (
                            <Fields
                                name={["payor", "hospital_name"]}
                                label="Hospital Name"
                                required={required && true}
                                disabled={disabled}
                            />
                        );
                    }

                    if (type === PAYOR_TYPE.INSURANCE) {
                        return (
                            <>
                                <Fields
                                    name={["payor", "hospital_name"]}
                                    label="Hospital Name"
                                    required={required && true}
                                    disabled={disabled}
                                />
                                <Fields
                                    name={["payor", "insurance_provider"]}
                                    label="Insurance Provider"
                                    required={required && true}
                                    disabled={disabled}
                                />
                                <Fields
                                    name={["payor", "insurance_number"]}
                                    label="Insurance No."
                                    required={required && true}
                                    disabled={disabled}
                                />
                            </>
                        );
                    }

                    return null;
                }}
            </Form.Item>
            <Col offset={6}>
                <h3>Delivery details</h3>
            </Col>
            <Fields
                name={["shipping", "practice_name"]}
                label="Practice name"
                required={required && true}
                disabled={disabled}
            />
            <Fields
                name={["shipping", "address"]}
                label="Address"
                required={required && true}
                disabled={disabled}
                textarea={true}
            />
            <Fields name={["shipping", "phone"]} label="Phone" required={required && true} disabled={disabled} />
            <FieldEmail name={["shipping", "email"]} label="Email" required={required && true} disabled={disabled} />
            <Col offset={6}>
                <h3>Billing details</h3>
            </Col>
            <Fields
                name={["billing", "practice_name"]}
                label="Practice name"
                required={required && true}
                disabled={disabled}
            />
            <Fields name={["billing", "abn"]} label="ABN" required={required && true} disabled={disabled} />
            <Fields
                name={["billing", "address"]}
                label="Address"
                required={required && true}
                disabled={disabled}
                textarea={true}
            />
            <Fields name={["billing", "phone"]} label="Phone" required={required && true} disabled={disabled} />
            <FieldEmail name={["billing", "email"]} label="Email" required={required && true} disabled={disabled} />
            <FooterStep form={form} {...props} />
        </Form>
    );
};
