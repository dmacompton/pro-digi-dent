import { Steps } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Loading } from "../../../components/Loading";
import { ORDER_TYPE } from "../../../components/OrderLabel/OrderLabel";
import { history } from "../../../helpers/history";
import { ManagingUserCreateOrder } from "../../../services/orders.service";
import {
    createOrderAsync,
    getOrderAsync,
    getOrderOptionsAsync,
    updateOrderAsync
} from "../../../state/orders/orders.action";
import { convertDateToMoment, prepareFormState, prepareFormStateFromOrderState } from "./data";
import { Step1 } from "./Step1";
import { Step2Custom } from "./Step2Custom";
import { Step2Design } from "./Step2Design";
import { ContentProps, ContentState, FormState } from "./types";
import { getUserDataAsync, getUserInfoAsync } from "../../../state/user/user.action";
import { createOrderUrl } from "../../../helpers/router";
import { formatDate } from "../../../helpers/date";

const { Step } = Steps;

type StepProps = {
    title: string;
    content: (props: ContentProps) => JSX.Element;
};

const FIRST_STEP: StepProps = {
    title: "First",
    content: (props: ContentProps) => <Step1 {...props} />
};

const DESIGN_STEP: StepProps[] = [
    FIRST_STEP,
    {
        title: "Second",
        content: (props: ContentProps) => <Step2Design {...props} />
    }
];

const CUSTOM_STEP: StepProps[] = [
    FIRST_STEP,
    {
        title: "Second",
        content: (props: ContentProps) => <Step2Custom {...props} />
    }
];

const STEPS: Record<ORDER_TYPE, StepProps[]> = {
    [ORDER_TYPE.PRINT]: [FIRST_STEP],
    [ORDER_TYPE.DESIGN]: DESIGN_STEP,
    [ORDER_TYPE.DESIGN_PRINT]: DESIGN_STEP,
    [ORDER_TYPE.CUSTOM]: CUSTOM_STEP
};

const Container = styled.div`
    padding: 24px;
    overflow: auto;

    .steps-content {
        min-height: calc(100vh - 80px - 64px - 72px);
        margin-top: 16px;
        padding-top: 80px;
        background-color: #fafafa;
        border: 1px dashed #e9e9e9;
        border-radius: 2px;
        position: relative;
    }

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

const addUserIdToContentState = (
    state: ContentState,
    user_id: string | undefined
): ContentState & ManagingUserCreateOrder => {
    if (user_id === undefined) {
        return state;
    }

    return { ...state, user_id };
};

const mapStateToBack = (state: FormState): ContentState => {
    if (state.type === ORDER_TYPE.CUSTOM) {
        const { guide, supply_hard_copy, ...partialState } = state;
        // @ts-ignore
        return partialState;
    }

    if (state.type === ORDER_TYPE.PRINT) {
        const { guide, files_delivery, impression_delivery_type, supply_hard_copy, ...partialState } = state;
        // @ts-ignore
        return { ...partialState };
    }

    return {
        ...state,
        patient_dob: state.patient_dob && formatDate(state.patient_dob),
        required_date: state.required_date && formatDate(state.required_date),
        surgery_date: state.surgery_date && formatDate(state.surgery_date),
        supply_hard_copy: Boolean(state.supply_hard_copy[0]),
        guide: {
            required_for: state.guide.required_for || [],
            type: Number(state.guide.type) ?? undefined,
            system_type: Number(state.guide.system_type) ?? undefined,
            restoration_type: Number(state.guide.restoration_type) ?? undefined,
            implant: state.guide.implant || "",
            surgical_kit: state.guide.surgical_kit || undefined,
            immediate_temporization: Boolean(state.guide.immediate_temporization[0]),
            bone_reduction: Boolean(state.guide.bone_reduction[0]),
            stabilization_pins: Boolean(state.guide.stabilization_pins[0]),
            supply_stabilization_pins: Boolean(state.guide.supply_stabilization_pins[0]),
            supply_drill_stabilization_pins: state.guide.supply_drill_stabilization_pins[0]
        }
    };
};

enum ViewType {
    ViewCreatedOrder = "ViewCreatedOrder",
    EditOrder = "EditOrder",
    NewOrder = "NewOrder"
}

const CreateOrderPage: React.FC = () => {
    const { viewingOrderId, managingUserId, editingOrderNumber, editingOrderId } = useParams<{
        viewingOrderId?: string;
        managingUserId?: string;
        editingOrderNumber?: string;
        editingOrderId?: string;
    }>();

    const dispatch = useAppDispatch();
    const userIsLoading = useAppSelector(state => state.user.isLoading);
    const ordersIsLoading = useAppSelector(state => state.orders.isLoading);
    const userData = useAppSelector(state => state.user.data);
    const managingUserData = useAppSelector(state => state.user.managingUserData);
    const user = managingUserId ? managingUserData : userData;

    const activeOrder = useAppSelector(state => state.orders.activeOrder);

    const viewType = useMemo(() => {
        if (viewingOrderId !== undefined) {
            return ViewType.ViewCreatedOrder;
        }
        if (editingOrderNumber !== undefined) {
            return ViewType.EditOrder;
        }

        return ViewType.NewOrder;
    }, [viewingOrderId, editingOrderNumber]);

    const isViewOrder = useMemo(() => viewType === ViewType.ViewCreatedOrder, [viewType]);
    const isEditOrder = useMemo(() => viewType === ViewType.EditOrder, [viewType]);
    const isNewOrder = useMemo(() => viewType === ViewType.NewOrder, [viewType]);

    const [isLoading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [state, setState] = useState<FormState>(prepareFormState(user));

    useEffect(() => {
        if (!isNewOrder) {
            return;
        }

        setState(convertDateToMoment(state));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNewOrder, currentStep]);

    useEffect(() => {
        if (editingOrderNumber !== undefined) {
            if (activeOrder?.number !== editingOrderNumber) {
                dispatch(getOrderAsync(editingOrderNumber));
            }
        } else if (viewingOrderId !== undefined) {
            if (activeOrder?.number !== viewingOrderId) {
                dispatch(getOrderAsync(viewingOrderId));
            }
        } else {
            const adminCreateOrderForUser = managingUserId !== undefined;

            if (user === undefined && !adminCreateOrderForUser) {
                dispatch(getUserInfoAsync());
            }

            if (adminCreateOrderForUser) {
                dispatch(getUserDataAsync(Number(managingUserId)));
            }
        }

        dispatch(getOrderOptionsAsync());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeOrder]);

    useEffect(() => {
        // fill default user data
        if (!isViewOrder && !isEditOrder && user) {
            setState(prepareFormState(user));
            return;
        }

        if (((!isViewOrder || !isEditOrder) && activeOrder === undefined) || activeOrder === undefined) {
            return;
        }

        // fill order data
        setState(prepareFormStateFromOrderState(activeOrder));
    }, [activeOrder, isViewOrder, isEditOrder, user]);

    if (
        userIsLoading ||
        ordersIsLoading ||
        user === undefined ||
        ((isEditOrder || isViewOrder) && activeOrder === undefined)
    ) {
        return <Loading center />;
    }

    const orderType = (isEditOrder || isViewOrder) && activeOrder?.type !== undefined ? activeOrder.type : state.type;

    const steps: StepProps[] = orderType ? STEPS[orderType] : [FIRST_STEP];

    const onClickNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }

        if (isViewOrder) {
            return;
        }

        if (currentStep === steps.length - 1) {
            setLoading(true);

            try {
                const newState = addUserIdToContentState(mapStateToBack(state), managingUserId);
                const response =
                    isEditOrder && editingOrderId !== undefined
                        ? await dispatch(updateOrderAsync({ state: newState, id: editingOrderId }))
                        : await dispatch(createOrderAsync(newState));

                setLoading(false);

                if (response.payload === undefined) {
                    return;
                }

                const orderUrl = createOrderUrl(
                    Boolean(userData?.is_admin),
                    // @ts-ignore
                    response.payload.data.number
                );
                history.push(orderUrl);
            } catch (e) {
                console.log("ERR", e);
                setLoading(false);
            }
        }
    };

    const onClickPrev = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <Container>
            <Steps current={currentStep}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className="steps-content">
                {isLoading && (
                    <div className="loading-container">
                        <Loading center />
                    </div>
                )}
                {steps[currentStep].content({
                    onClickNext,
                    onClickPrev,
                    state,
                    setState,
                    showPrev: currentStep > 0,
                    hideNext: isViewOrder && currentStep === steps.length - 1,
                    disabled: isViewOrder
                })}
            </div>
        </Container>
    );
};

export default CreateOrderPage;
