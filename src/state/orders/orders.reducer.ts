import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { FileData, OrderState } from "../../services/orders.service";
import { ORDER_TYPE } from "../../components/OrderLabel/OrderLabel";
import { PAYOR_TYPE } from "../../pages/UserPages/CreateOrder/Step1";
import {
    changeOrderStatusToCompleteAsync,
    changeOrderStatusToConfirmAsync,
    changeOrderStatusToManufactureAsync,
    changeOrderStatusToRefuseAsync,
    changeOrderStatusToShippedAsync,
    changeOrderStatusToVerifiedAsync,
    changeOrderStatusToVerifyAsync,
    getOrdersAsync,
    createOrderAsync,
    getOrderAsync,
    getOrderOptionsAsync,
    removeFileAsync,
    getOrderFileAsync,
    updateOrderAsync
} from "./orders.action";
import { INITIAL_TABLE_META, TableMeta } from "../../helpers/table";

export interface OptionList {
    [key: number]: string;
}

export type OrderOptions = {
    files_delivery: { type: OptionList };
    guide: {
        required_for: string[];
        restoration_type: OptionList;
        system_type: OptionList;
        type: OptionList;
    };
    payor: Record<PAYOR_TYPE, string>;
    impression_delivery_type: OptionList;
    type: Record<ORDER_TYPE, string>;
};

type State = {
    isLoading: boolean;
    orders: OrderState[];
    options: OrderOptions;
    activeOrder: OrderState | undefined;
    error: boolean;
    meta: TableMeta;
};

const initialState: State = {
    isLoading: false,
    orders: [],
    activeOrder: undefined,
    error: false,
    options: {
        files_delivery: { type: {} },
        guide: {
            required_for: [],
            restoration_type: {},
            system_type: {},
            type: {}
        },
        impression_delivery_type: {},
        payor: {
            "1": "",
            "2": "",
            "3": ""
        },
        type: {
            "1": "",
            "2": "",
            "3": "",
            "4": ""
        }
    },
    meta: INITIAL_TABLE_META
};

const getOrderType = (type: unknown): ORDER_TYPE | undefined => {
    if (type === 1) {
        return ORDER_TYPE.DESIGN_PRINT;
    } else if (type === 2) {
        return ORDER_TYPE.DESIGN;
    } else if (type === 3) {
        return ORDER_TYPE.PRINT;
    } else if (type === 4) {
        return ORDER_TYPE.CUSTOM;
    } else {
        return undefined;
    }
};

const getPayorType = (type: unknown): PAYOR_TYPE | undefined => {
    if (type === 1) {
        return PAYOR_TYPE.HOSPITAL;
    } else if (type === 2) {
        return PAYOR_TYPE.INSURANCE;
    } else if (type === 3) {
        return PAYOR_TYPE.PATIENT;
    } else {
        return undefined;
    }
};

export const ordersReducer = createSlice({
    name: "orders",
    initialState,
    reducers: {
        cleanActiveOrder: state => {
            state.activeOrder = undefined;
        },
        addFile: (state, action: PayloadAction<FileData>) => {
            if (state.activeOrder === undefined) return;

            state.activeOrder = {
                ...state.activeOrder,
                files: [...state.activeOrder.files, action.payload]
            };
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getOrdersAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(getOrderFileAsync.fulfilled, (state, { payload }) => {
                if (state.activeOrder === undefined) return;

                state.activeOrder = {
                    ...state.activeOrder,
                    files: payload.files
                };
            })
            .addCase(getOrderOptionsAsync.fulfilled, (state, action) => {
                state.options = action.payload;
            })
            .addCase(getOrderAsync.pending, state => {
                state.isLoading = true;
                state.error = false;
                state.activeOrder = undefined;
            })
            .addCase(getOrderAsync.rejected, state => {
                state.isLoading = false;
                state.error = true;
            })
            .addCase(getOrderAsync.fulfilled, (state, { payload }) => {
                state.isLoading = false;
                state.error = false;
                state.activeOrder = {
                    ...payload,
                    type: getOrderType(payload.type),
                    payor: {
                        ...payload.payor,
                        type: getPayorType(payload.payor.type)
                    }
                };
            })
            .addCase(removeFileAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                if (!state.activeOrder) {
                    return;
                }
                state.activeOrder.files = action.payload.data.files;
            })
            .addMatcher(
                isAnyOf(
                    changeOrderStatusToRefuseAsync.pending,
                    changeOrderStatusToVerifyAsync.pending,
                    changeOrderStatusToVerifiedAsync.pending,
                    changeOrderStatusToConfirmAsync.pending,
                    changeOrderStatusToCompleteAsync.pending,
                    changeOrderStatusToManufactureAsync.pending,
                    changeOrderStatusToShippedAsync.pending,
                    removeFileAsync.pending,
                    getOrdersAsync.pending,
                    createOrderAsync.pending,
                    updateOrderAsync.pending
                ),
                state => {
                    state.isLoading = true;
                }
            )
            .addMatcher(
                isAnyOf(
                    changeOrderStatusToRefuseAsync.rejected,
                    changeOrderStatusToVerifyAsync.rejected,
                    changeOrderStatusToVerifiedAsync.rejected,
                    changeOrderStatusToConfirmAsync.rejected,
                    changeOrderStatusToCompleteAsync.rejected,
                    changeOrderStatusToManufactureAsync.rejected,
                    changeOrderStatusToShippedAsync.rejected,
                    removeFileAsync.rejected,
                    getOrdersAsync.rejected,
                    createOrderAsync.rejected,
                    updateOrderAsync.rejected
                ),
                state => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                isAnyOf(
                    changeOrderStatusToRefuseAsync.fulfilled,
                    changeOrderStatusToVerifyAsync.fulfilled,
                    changeOrderStatusToVerifiedAsync.fulfilled,
                    changeOrderStatusToConfirmAsync.fulfilled,
                    changeOrderStatusToCompleteAsync.fulfilled,
                    changeOrderStatusToManufactureAsync.fulfilled,
                    changeOrderStatusToShippedAsync.fulfilled,
                    createOrderAsync.fulfilled,
                    updateOrderAsync.fulfilled
                ),
                (state, action) => {
                    state.isLoading = false;
                    state.activeOrder = action.payload.data;
                }
            );
    }
});

export const ordersActions = ordersReducer.actions;

export default ordersReducer.reducer;
