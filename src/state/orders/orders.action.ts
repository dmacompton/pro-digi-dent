import { ManagingUserCreateOrder, ordersService } from "../../services/orders.service";
import { ContentState } from "../../pages/UserPages/CreateOrder/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fileService } from "../../services/file.service";
import { CONFIRM_TYPE } from "../../pages/UserPages/Order/Actions/ConfirmBy";

export const getOrdersAsync = createAsyncThunk(
    "orders/getOrders",
    async (data: { currentPage: number; perPage: number }) => {
        return await ordersService.getOrders(data);
    }
);

export const getOrderOptionsAsync = createAsyncThunk("orders/options", async () => {
    return await ordersService.getOrderOptions();
});

export const createOrderAsync = createAsyncThunk(
    "orders/create",
    async (order: ContentState & ManagingUserCreateOrder) => {
        return await ordersService.createOrder(order);
    }
);

export const updateOrderAsync = createAsyncThunk("orders/update", async (data: { state: ContentState; id: string }) => {
    return await ordersService.updateOrder(data);
});

export const getOrderAsync = createAsyncThunk("orders/getOrder", async (orderNumber: string) => {
    return await ordersService.getOrder(orderNumber);
});

export const getOrderFileAsync = createAsyncThunk("orders/getOrderFiles", async (orderNumber: string) => {
    return await ordersService.getOrder(orderNumber);
});

export const changeOrderStatusToRefuseAsync = createAsyncThunk(
    "orders/changeOrderStatusToRefuse",
    async (id: number) => {
        return await ordersService.changeStatusToRefuseOrder(id);
    }
);

export const changeOrderStatusToVerifyAsync = createAsyncThunk(
    "orders/changeOrderStatusToVerify",
    async (id: number) => {
        return await ordersService.changeStatusToVerifyOrder(id);
    }
);

export const changeOrderStatusToVerifiedAsync = createAsyncThunk(
    "orders/changeOrderStatusToVerified",
    async (id: number) => {
        return await ordersService.changeStatusToVerifiedOrder(id);
    }
);

export const changeOrderStatusToConfirmAsync = createAsyncThunk(
    "orders/changeOrderStatusToConfirm",
    async (id: number) => {
        return await ordersService.changeStatusToConfirmOrder(id);
    }
);

export const changeOrderStatusToCompleteAsync = createAsyncThunk(
    "orders/changeOrderStatusToComplete",
    async (id: number) => {
        return await ordersService.changeStatusToCompleteOrder(id);
    }
);

export const changeOrderStatusToManufactureAsync = createAsyncThunk(
    "orders/changeOrderStatusToManufacture",
    async (id: number) => {
        return await ordersService.changeStatusToManufactureOrder(id, CONFIRM_TYPE.PROJECT_FILE);
    }
);

export const changeOrderStatusToShippedAsync = createAsyncThunk(
    "orders/changeOrderStatusToShipped",
    async (id: number) => {
        return await ordersService.changeStatusToShippedOrder(id);
    }
);

export const removeFileAsync = createAsyncThunk(
    "orders/removeFileAsync",
    async ({ orderId, fileId }: { orderId: number; fileId: number }) => {
        return await fileService.deleteFile(orderId, fileId);
    }
);
