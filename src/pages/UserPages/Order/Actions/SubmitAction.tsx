import { changeOrderStatusToVerifyAsync } from "../../../../state/orders/orders.action";
import { FieldAgreementCheckbox } from "../../../../components/FormFields/Fields";
import { ActionButton } from "./ActionButton";
import { Form } from "antd";
import { useAppDispatch } from "../../../../app/hooks";

type Props = {
    id: number;
};

const SUBMIT_ORDER_FIELD_NAME = "submit-order";

export const SubmitAction: React.FC<Props> = ({ id }) => {
    const dispatch = useAppDispatch();

    return (
        <Form name="submit-order" layout="inline" onFinish={() => dispatch(changeOrderStatusToVerifyAsync(id))}>
            <FieldAgreementCheckbox name={SUBMIT_ORDER_FIELD_NAME} link="/" useStyled={false} />
            <Form.Item shouldUpdate>
                {({ getFieldValue }) => (
                    <ActionButton
                        key="confirm-project"
                        type="primary"
                        htmlType="submit"
                        disabled={!getFieldValue(SUBMIT_ORDER_FIELD_NAME)}
                    >
                        Submit
                    </ActionButton>
                )}
            </Form.Item>
        </Form>
    );
};
