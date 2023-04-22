import { ColProps, RadioGroupProps } from "antd";
import { Rule } from "antd/lib/form";
import { ValidateStatus } from "antd/lib/form/FormItem";
import { NamePath } from "antd/lib/form/interface";

type FieldProps = {
    name: NamePath;
    label?: string | React.ReactNode;
    required?: boolean;
    tooltip?: string;
    rules?: Rule[];
    disabled?: boolean;
    validateStatus?: ValidateStatus;
    help?: string;
};

export type FieldTextProps = {
    textarea?: boolean;
    validationMessage?: string;
    style?: React.CSSProperties;
} & FieldProps;

export type FieldNumberProps = {
    max?: number;
    validationMessage?: string;
    placeholder?: string;
    wrapperCol?: ColProps;
    fieldKey?: React.Key | React.Key[];
} & FieldProps;

export type FieldAgreementCheckboxProps = {
    name: string;
    link: string;
    disabled?: boolean;
    labelCol?: ColProps;
    wrapperCol?: ColProps;
    useStyled?: boolean;
};

export type FieldCheckboxProps = {
    textarea?: boolean;
    validationMessage?: string;
    labelCol?: ColProps;
    wrapperCol?: ColProps;
    fieldKey?: React.Key | React.Key[];
} & FieldProps;

export type FieldCheckboxGroupValue = {
    value: string | boolean;
    label: string;
};

export type FieldOption = { label: string; value: string | number };

export type FieldRadioProps = {
    validateMessage?: string;
    values: FieldOption[];
} & Pick<RadioGroupProps, "onChange"> &
    FieldProps;

export type FieldSelectProps = {
    validateMessage?: string;
    values: FieldOption[];
} & Pick<RadioGroupProps, "onChange"> &
    FieldProps;

export type FieldDateProps = {
    textarea?: boolean;
    validationMessage?: string;
    disabledDate?: (date: moment.Moment) => boolean;
} & FieldProps;
