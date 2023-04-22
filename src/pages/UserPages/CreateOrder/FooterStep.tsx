import { Form, Button, FormInstance } from "antd";
import React from "react";
import { ContentProps } from "./types";
import { useAppSelector } from "../../../app/hooks";
import { useParams } from "react-router";
import { orderReturnHandler } from "../../../helpers/router";
import styled from "styled-components";

type Props = {
    form: FormInstance;
} & Pick<ContentProps, "onClickPrev" | "onClickNext" | "showPrev" | "hideNext">;

export const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0
        },
        sm: {
            span: 16,
            offset: 6
        }
    }
};

const StyledButton = styled(Button)`
    margin: 0 8px;
`;

export const FooterStep: React.FC<Props> = ({ form, onClickNext, onClickPrev, hideNext, showPrev }) => {
    const isAdmin = useAppSelector(state => state.user.data?.is_admin);
    const activeOrderId = useAppSelector(state => state.orders.activeOrder?.number);

    const { viewingOrderId } = useParams<{ viewingOrderId: string }>();

    const prevButton = <StyledButton onClick={onClickPrev}>Previous</StyledButton>;

    if (viewingOrderId && activeOrderId !== undefined) {
        return (
            <Form.Item {...tailFormItemLayout}>
                {showPrev
                    ? prevButton
                    : !hideNext && (
                          <Button type="primary" htmlType="submit" onClick={onClickNext}>
                              Next
                          </Button>
                      )}
                <StyledButton onClick={orderReturnHandler(isAdmin, activeOrderId)}>Return to order</StyledButton>
            </Form.Item>
        );
    }

    return (
        <Form.Item {...tailFormItemLayout}>
            <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                    setTimeout(() => {
                        const errors = form.getFieldsError().filter(({ errors }) => errors.length);
                        const valid = !errors.length;

                        if (valid) {
                            onClickNext();
                        }
                    }, 0);
                }}
            >
                Next
            </Button>
            {showPrev && prevButton}
        </Form.Item>
    );
};
