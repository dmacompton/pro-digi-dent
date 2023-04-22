import { AxiosResponse } from "axios";
import { mainAPI } from "../helpers/api";
import { UserTokenData } from "../helpers/auth";
import { UserData, UserPasswordData } from "./admin.service";
import { clearAuthTokens, setAuthTokens } from "../helpers/api-jwt";
import { echoHelper } from "../helpers/echo";
import { requestErrorHandler } from "../helpers/errorHandler";

export function logout() {
    clearAuthTokens();
    echoHelper.removeTokenUpdateListener();
}

type SignInSuccessResponse = {
    token: string;
};

type SignInResponse = SignInSuccessResponse | ErrorResponse;

export const isSignInErrorResponse = (data: SignInResponse): data is ErrorResponse => {
    return "message" in data;
};

function login(email: string, password: string): Promise<SignInSuccessResponse | ErrorResponse> {
    return mainAPI
        .post<UserTokenData>(`/api/auth/login`, { email, password })
        .then(({ data }) => data)
        .then(data => {
            if (data.token) {
                setAuthTokens({
                    accessToken: data.token,
                    refreshToken: data.token
                });
            }

            return data;
        })
        .catch(error => {
            requestErrorHandler(error);
            return error.response.data as ErrorResponse;
        });
}

export type SignUpData = {
    agreement: boolean;
    confirmation: number | string;
    drilling_systems: string;
    email: string;
    implant_types: string;
    implastation_email: string;
    name: string;
    password: string;
    password_confirmation: string;
    phone: string;
    practice: {
        abn: string;
        address: string;
        delivery_address: string;
        email: string;
        name: string;
        phone: string;
    };
};

type SignUpSuccessResponse = {
    acknowledge: boolean;
};

export type UserFormErrors = Record<Partial<keyof Partial<SignUpData>>, string[]>;

export type ErrorResponse = {
    message: string;
    errors: UserFormErrors;
};

type SignUpResponse = SignUpSuccessResponse | ErrorResponse;

export const isSignUpSuccessResponse = (data: SignUpResponse): data is SignUpSuccessResponse => {
    return "acknowledge" in data;
};

export const isSignUpErrorResponse = (data: SignUpResponse): data is ErrorResponse => {
    return "message" in data;
};

function signup(data: SignUpData): Promise<SignUpResponse> {
    return mainAPI
        .post(`/api/auth/register`, data)
        .then(({ data }) => data)
        .catch(requestErrorHandler);
}

function forgotPassword(data: { email: string }): Promise<AxiosResponse<{ acknowledge: boolean }>> {
    return mainAPI.post(`/api/auth/forgot-password`, data);
}

function resetPassword(data: {
    email: string;
    password: string;
    token: string;
}): Promise<AxiosResponse<{ acknowledge: boolean }>> {
    return mainAPI.post(`/api/auth/reset-password`, data);
}

function getAll() {
    return mainAPI.get(`/users/`).then(({ data }) => data);
}

function getUserInfo() {
    return mainAPI.get(`/api/users/me/`).then(({ data }) => data);
}

function getUserData(id: number) {
    return mainAPI.get(`/api/users/${id}/`).then(({ data }) => data);
}

function updateUserData(data: UserData): Promise<void> {
    return mainAPI
        .post(`/api/users/${data.id}/`, data)
        .then(({ data }) => data)
        .catch(requestErrorHandler);
}

function updateUserPassword({
    id,
    password,
    password_confirmation
}: Pick<UserData, "id"> & UserPasswordData): Promise<void> {
    return mainAPI
        .patch(`/api/users/${id}/password`, { password, password_confirmation })
        .then(({ data }) => data)
        .catch(requestErrorHandler);
}

export const userService = {
    login,
    logout,
    signup,
    getAll,
    getUserInfo,
    getUserData,
    updateUserData,
    updateUserPassword,
    forgotPassword,
    resetPassword
};
