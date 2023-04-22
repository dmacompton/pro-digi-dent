import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminService } from "../../services/admin.service";

export const getUsersAsync = createAsyncThunk(
    "admin/getUsers",
    async (data: { currentPage: number; perPage: number }) => {
        return await adminService.getUsers(data);
    }
);

export const activateUserAsync = createAsyncThunk("admin/activateUser", async (id: number) => {
    return await adminService.activateUser(id);
});

export const deactivateUserAsync = createAsyncThunk("admin/deactivateUser", async (id: number) => {
    return await adminService.deactivateUser(id);
});
