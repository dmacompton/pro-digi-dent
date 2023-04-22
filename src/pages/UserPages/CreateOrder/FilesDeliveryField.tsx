import { Form } from "antd";
import React, { useMemo } from "react";
import { Fields, FieldSelect } from "../../../components/FormFields/Fields";
import { OptionList } from "../../../state/orders/orders.reducer";
import { getOptions } from "./helper";

type Props = {
    options: OptionList;
    disabled: boolean;
    required: boolean;
};

const DIRECT_LINK_ID = 3;

export const FilesDeliveryField: React.FC<Props> = ({ options, disabled, required }) => {
    const filesDeliveryOptions = useMemo(() => getOptions(options), [options]);

    return (
        <>
            <FieldSelect
                name={["files_delivery", "type"]}
                label="CT/CBCT Files Delivery"
                values={filesDeliveryOptions}
                disabled={disabled}
            />
            <Form.Item noStyle shouldUpdate={(prev, current) => prev.files_delivery !== current.files_delivery}>
                {({ getFieldValue }) => {
                    const isDirectLink = getFieldValue("files_delivery")?.type === DIRECT_LINK_ID;

                    if (!isDirectLink) {
                        return null;
                    }

                    return (
                        <Fields
                            name={["files_delivery", "link"]}
                            label="Radiology Direct Link"
                            required={required && true}
                            disabled={disabled}
                        />
                    );
                }}
            </Form.Item>
        </>
    );
};
