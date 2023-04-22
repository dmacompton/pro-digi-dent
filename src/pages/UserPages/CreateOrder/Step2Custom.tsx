import { ContentProps, FormState } from "./types";
import { formItemLayout, getOptions } from "./helper";
import { Form } from "antd";
import { FooterStep } from "./FooterStep";
import { Fields, FieldSelect } from "../../../components/FormFields/Fields";
import { useCallback, useMemo } from "react";
import { useAppSelector } from "../../../app/hooks";
import { merge } from "../../../helpers/utils";
import { FilesDeliveryField } from "./FilesDeliveryField";

export const Step2Custom: React.FC<ContentProps> = ({ disabled, state, setState, ...props }) => {
    const [form] = Form.useForm();
    const options = useAppSelector(state => state.orders.options);

    const impressionDeliveryTypeOptions = useMemo(
        () => getOptions(options.impression_delivery_type),
        [options.impression_delivery_type]
    );

    const onChangeValue = useCallback(
        (newState: FormState) => {
            setState({
                ...merge(newState, state)
            });
        },
        [state, setState]
    );

    const required = !disabled;

    return (
        <div>
            <Form
                {...formItemLayout}
                form={form}
                name="create_new_order_step2"
                onValuesChange={onChangeValue}
                initialValues={state}
                scrollToFirstError
            >
                <FieldSelect
                    name="impression_delivery_type"
                    label="Patient Impressions Delivery"
                    values={impressionDeliveryTypeOptions}
                    disabled={disabled}
                />
                <FilesDeliveryField options={options.files_delivery.type} disabled={disabled} required={required} />
                <Fields
                    name="comment"
                    label="Please describe CUSTOM order in details"
                    textarea={true}
                    style={{ height: 190 }}
                    disabled={disabled}
                />
                <FooterStep form={form} {...props} />
            </Form>
        </div>
    );
};
