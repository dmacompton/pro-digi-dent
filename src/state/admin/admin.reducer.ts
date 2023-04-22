import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { UserData } from "../../services/admin.service";
import { activateUserAsync, deactivateUserAsync, getUsersAsync } from "./admin.action";
import { getUserInfoAsync } from "../user/user.action";
import { INITIAL_TABLE_META, TableMeta } from "../../helpers/table";

type State = {
    users: UserData[];
    isLoading: boolean;
    isAdmin: boolean;
    meta: TableMeta;
};

const initialState: State = {
    users: [],
    isLoading: false,
    isAdmin: false,
    meta: INITIAL_TABLE_META
};

export const adminReducer = createSlice({
    name: "admin",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getUsersAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload.data;
                state.meta = action.payload.meta;
            })
            .addCase(getUserInfoAsync.fulfilled, (state, action) => {
                state.isAdmin = action.payload.data.is_admin;
            })
            .addMatcher(
                isAnyOf(activateUserAsync.pending, deactivateUserAsync.pending, getUsersAsync.pending),
                state => {
                    state.isLoading = true;
                }
            )
            .addMatcher(
                isAnyOf(
                    getUsersAsync.rejected,
                    activateUserAsync.rejected,
                    activateUserAsync.fulfilled,
                    deactivateUserAsync.rejected,
                    deactivateUserAsync.fulfilled
                ),
                state => {
                    state.isLoading = false;
                }
            );
    }
});

export const adminActions = adminReducer.actions;

export default adminReducer.reducer;
