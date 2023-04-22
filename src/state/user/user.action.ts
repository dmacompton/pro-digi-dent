import { isSignInErrorResponse, userService } from "../../services/user.service";
import { history } from "../../helpers/history";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserData, UserPasswordData } from "../../services/admin.service";
import { DEFAULT_USER_ROUTE } from "../../contants/url";
import { registerEcho } from "../../helpers/echo";

export function logOut() {
    userService.logout();

    setTimeout(() => {
        history.push("/login");
    }, 100);
}

export const loginAsync = createAsyncThunk("user/login", async (props: { email: string; password: string }) => {
    const response = await userService.login(props.email, props.password);

    if (!isSignInErrorResponse(response)) {
        history.push(DEFAULT_USER_ROUTE);

        // @ts-ignore
        window.Echo = registerEcho();
    }

    return response;
});

export const getUserInfoAsync = createAsyncThunk("user/me", async () => {
    return await userService.getUserInfo();
});

export const getUserDataAsync = createAsyncThunk("user/data", async (id: number) => {
    return await userService.getUserData(id);
});

export const updateUserDataAsync = createAsyncThunk("user/updateData", async (data: UserData) => {
    return await userService.updateUserData(data);
});

export const updateUserPasswordAsync = createAsyncThunk(
    "user/updateUserPassword",
    async (data: Pick<UserData, "id"> & UserPasswordData) => {
        return await userService.updateUserPassword(data);
    }
);
