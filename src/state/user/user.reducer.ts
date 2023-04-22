import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "../../services/admin.service";
import {
    getUserDataAsync,
    getUserInfoAsync,
    loginAsync,
    updateUserDataAsync,
    updateUserPasswordAsync
} from "./user.action";
import { isSignInErrorResponse } from "../../services/user.service";
import { isLoggedIn } from "../../helpers/api-jwt";

type State = {
    loggedIn: boolean;
    error: string | undefined;
    isLoading: boolean;
    data: UserData | undefined;
    managingUserData: UserData | undefined;
};

const initialState: State = {
    loggedIn: isLoggedIn(),
    data: undefined,
    managingUserData: undefined,
    error: undefined,
    isLoading: false
};

export const userReducer = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>) => {
            state.loggedIn = Boolean(action.payload);
        },
        logout: state => {
            state.loggedIn = false;
            state.managingUserData = undefined;
            state.data = undefined;
        },
        loginFailure: state => {
            state.loggedIn = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loginAsync.pending, state => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loggedIn = false;
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.isLoading = false;

                if (isSignInErrorResponse(action.payload)) {
                    state.error = action.payload.message;
                    return;
                }

                state.loggedIn = true;
            })
            .addCase(getUserInfoAsync.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.isLoading = false;
            })
            .addCase(getUserDataAsync.fulfilled, (state, action) => {
                state.managingUserData = action.payload.data;
                state.isLoading = false;
            })
            .addMatcher(
                isAnyOf(
                    getUserDataAsync.rejected,
                    getUserInfoAsync.rejected,
                    updateUserDataAsync.fulfilled,
                    updateUserDataAsync.rejected,
                    updateUserPasswordAsync.fulfilled,
                    updateUserPasswordAsync.rejected
                ),
                state => {
                    state.isLoading = false;
                }
            )
            .addMatcher(
                isAnyOf(
                    updateUserDataAsync.pending,
                    updateUserPasswordAsync.pending,
                    getUserDataAsync.pending,
                    getUserInfoAsync.pending
                ),
                state => {
                    state.isLoading = true;
                }
            );
    }
});

export const userActions = userReducer.actions;

export default userReducer.reducer;
