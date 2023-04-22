import { ContentProps, FormState } from "./types";
import { formItemLayout, getCheckbox, getOptions } from "./helper";
import { Button, Col, Form } from "antd";
import { FooterStep } from "./FooterStep";
import {
    FieldCheckbox,
    FieldCheckboxGroup,
    FieldNumber,
    FieldRadio,
    Fields,
    FieldSelect
} from "../../../components/FormFields/Fields";
import { useCallback, useMemo } from "react";
import { merge } from "../../../helpers/utils";
import { PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useAppSelector } from "../../../app/hooks";
import { FilesDeliveryField } from "./FilesDeliveryField";

const Table = styled.table`
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    background-color: #eee;

    thead th:nth-child(1) {
        width: 30%;
    }

    thead th:nth-child(2) {
        width: 20%;
    }

    thead th:nth-child(3) {
        width: 15%;
    }

    thead th:nth-child(4) {
        width: 35%;
    }

    th {
        padding: 20px;
    }

    td {
        padding: 2px 4px;

        .ant-form-item {
            margin-bottom: 0;
        }

        .ant-col {
            align-items: center;
        }

        &.deleteButton {
            display: flex;
            justify-content: center;
        }
    }
`;

const implant_default_values = {
    site: 0,
    diameter: 0,
    length: 0,
    raised_flap: false,
    immediate_placement: false,
    sinus_lift: false,
    bone_graft: false
};

export const Step2Design: React.FC<ContentProps> = ({ state, setState, disabled, ...props }) => {
    const [form] = Form.useForm();
    const options = useAppSelector(state => state.orders.options);

    const onChangeValue = useCallback(
        (newState: FormState) => {
            const implants = state.implants;

            newState.implants?.forEach((implant, i) => {
                implants[i] = {
                    ...implant_default_values,
                    ...implants[i],
                    ...implant
                };
            });

            setState({
                ...merge(newState, state),
                implants
            });
        },
        [state, setState]
    );

    const impressionDeliveryTypeOptions = useMemo(
        () => getOptions(options.impression_delivery_type),
        [options.impression_delivery_type]
    );

    const requiredForOptions = useMemo(() => getCheckbox(options.guide.required_for), [options.guide.required_for]);

    const guideTypeOptions = useMemo(() => getOptions(options.guide.type), [options.guide.type]);

    const guideRestorationTypeOptions = useMemo(
        () => getOptions(options.guide.restoration_type),
        [options.guide.restoration_type]
    );

    const guideSystemTypeOptions = useMemo(
        () => getOptions(options.guide.system_type, true),
        [options.guide.system_type]
    );

    const required = !disabled;

    return (
        <div>
            <Form
                {...formItemLayout}
                form={form}
                name="create_new_order_step2"
                initialValues={state}
                onValuesChange={onChangeValue}
                scrollToFirstError
            >
                <FieldCheckboxGroup
                    name={["guide", "required_for"]}
                    label="Guide required for"
                    key="guide_required_for"
                    required={required && true}
                    values={requiredForOptions}
                    disabled={disabled}
                />
                <FieldSelect
                    name={["guide", "type"]}
                    label="Guide type"
                    values={guideTypeOptions}
                    validateMessage="Please choose the Guide type"
                    required={required && true}
                    disabled={disabled}
                />
                <FieldCheckboxGroup
                    name={["guide", "bone_reduction"]}
                    label="Bone reduction guide"
                    key="bone_reduction_guide"
                    values={[{ value: "bone_reduction", label: "" }]}
                    disabled={disabled}
                />
                <FieldCheckboxGroup
                    name={["guide", "immediate_temporization"]}
                    label="Immediate temporization"
                    key="immediate_temporization"
                    values={[{ value: "immediate_temporization", label: "" }]}
                    disabled={disabled}
                />
                <Fields
                    name={["guide", "implant"]}
                    label="Implant brand and type"
                    required={required && true}
                    textarea={true}
                    disabled={disabled}
                />
                <Fields
                    name={["guide", "surgical_kit"]}
                    label="Surgical kit brand and type"
                    required={required && true}
                    textarea={true}
                    disabled={disabled}
                />
                <FieldRadio
                    label="Guided system type"
                    name={["guide", "system_type"]}
                    validateMessage="Please choose the Guided system type"
                    required={required && true}
                    values={guideSystemTypeOptions}
                    disabled={disabled}
                />
                <FieldCheckboxGroup
                    name={["guide", "stabilization_pins"]}
                    label="Add stabilisation pins"
                    key="stabilization_pins"
                    values={[{ value: "stabilization_pins", label: "" }]}
                    disabled={disabled}
                />
                <FieldCheckboxGroup
                    name={["guide", "supply_stabilization_pins"]}
                    label="Supply stabilisation pins"
                    key="supply_stabilization_pins"
                    values={[{ value: "supply_stabilization_pins", label: "" }]}
                    disabled={disabled}
                />
                <FieldCheckboxGroup
                    name={["guide", "supply_drill_stabilization_pins"]}
                    label="Supply the drill for stabilisation pins"
                    key="supply_drill_stabilization_pins"
                    values={[{ value: "supply_drill_stabilization_pins", label: "" }]}
                    disabled={disabled}
                />
                <FieldSelect
                    name={["guide", "restoration_type"]}
                    label="Abutment type"
                    validateMessage="Please abutment type"
                    required={required && true}
                    values={guideRestorationTypeOptions}
                    disabled={disabled}
                />
                <Col offset={6}>
                    <Table style={{ marginBottom: 18 }}>
                        <tbody>
                            <tr key="table-header">
                                <th>Site</th>
                                <th>Implant Diameter (mm)</th>
                                <th>Implant Length (mm)</th>
                                <th>Raised flap</th>
                                <th>Immediate implant placement</th>
                                <th>Sinus lift</th>
                                <th>Bone graft</th>
                            </tr>
                            <Form.List name="implants">
                                {(fields, { add }) => (
                                    <>
                                        {fields.map(({ key, name }) => (
                                            <tr key={`${key}-${name}`}>
                                                <td>
                                                    <FieldNumber
                                                        name={[name, "site"]}
                                                        fieldKey={[name, "site"]}
                                                        max={99}
                                                        wrapperCol={{ sm: 24 }}
                                                        disabled={disabled}
                                                    />
                                                </td>
                                                <td>
                                                    <FieldNumber
                                                        name={[name, "diameter"]}
                                                        fieldKey={[name, "diameter"]}
                                                        max={999}
                                                        wrapperCol={{ sm: 24 }}
                                                        disabled={disabled}
                                                    />
                                                </td>
                                                <td>
                                                    <FieldNumber
                                                        name={[name, "length"]}
                                                        fieldKey={[name, "length"]}
                                                        max={999}
                                                        wrapperCol={{ sm: 24 }}
                                                        disabled={disabled}
                                                    />
                                                </td>

                                                <td>
                                                    <FieldCheckbox
                                                        wrapperCol={{ sm: 24 }}
                                                        name={[name, "raised_flap"]}
                                                        fieldKey={[name, "raised_flap"]}
                                                        disabled={disabled}
                                                    />
                                                </td>
                                                <td>
                                                    <FieldCheckbox
                                                        wrapperCol={{ sm: 24 }}
                                                        name={[name, "immediate_placement"]}
                                                        fieldKey={[name, "immediate_placement"]}
                                                        disabled={disabled}
                                                    />
                                                </td>
                                                <td>
                                                    <FieldCheckbox
                                                        wrapperCol={{ sm: 24 }}
                                                        name={[name, "sinus_lift"]}
                                                        fieldKey={[name, "sinus_lift"]}
                                                        disabled={disabled}
                                                    />
                                                </td>
                                                <td>
                                                    <FieldCheckbox
                                                        wrapperCol={{ sm: 24 }}
                                                        name={[name, "bone_graft"]}
                                                        fieldKey={[name, "bone_graft"]}
                                                        disabled={disabled}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        <tr key="add-new">
                                            <td colSpan={1}>
                                                <Form.Item
                                                    noStyle
                                                    shouldUpdate={(prev, current) => prev.implants !== current.implants}
                                                >
                                                    {({ getFieldValue }) => {
                                                        if (disabled) {
                                                            return null;
                                                        }

                                                        const isLimit = getFieldValue("implants").length >= 30;

                                                        return (
                                                            <Button
                                                                type="dashed"
                                                                style={{ width: 300 }}
                                                                onClick={() => add()}
                                                                disabled={isLimit}
                                                                block
                                                                icon={<PlusOutlined />}
                                                            >
                                                                Add Additional Implant
                                                            </Button>
                                                        );
                                                    }}
                                                </Form.Item>
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </Form.List>
                        </tbody>
                    </Table>
                </Col>
                <FieldSelect
                    name="impression_delivery_type"
                    label="Patient Impressions Delivery"
                    values={impressionDeliveryTypeOptions}
                    disabled={disabled}
                />
                <FilesDeliveryField options={options.files_delivery.type} disabled={disabled} required={required} />
                <FieldCheckboxGroup
                    name={["supply_hard_copy"]}
                    label="Supply hard copy of the drilling protocol"
                    key="supply_hard_copy"
                    values={[{ value: "supply_hard_copy", label: "" }]}
                    disabled={disabled}
                />
                <Fields name="comment" label="Comments" textarea={true} style={{ height: 190 }} disabled={disabled} />
                <FooterStep form={form} {...props} />
            </Form>
        </div>
    );
};
