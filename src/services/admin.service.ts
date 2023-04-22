import { TableMeta } from "../helpers/table";
import { mainAPI } from "../helpers/api";
import { DashboardData } from "./admin.service.type";

export type UserData = {
    id: number;
    active: number; // todo boolean only
    is_admin: boolean;
    confirmation: number | string;
    drilling_systems: string;
    email: string;
    implant_types: string;
    implastation_email: string;
    name: string;
    password: string;
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

export type UserPasswordData = {
    password: string;
    password_confirmation: string;
};

function getUsers(data: { currentPage: number; perPage: number }): Promise<{ data: UserData[]; meta: TableMeta }> {
    return mainAPI.get(`/api/users?currentPage=${data.currentPage}&perPage=${data.perPage}`).then(({ data }) => data);
}

type UserActivationResponse = { acknowledge: boolean };

function activateUser(id: number): Promise<UserActivationResponse> {
    return mainAPI.patch<UserActivationResponse>(`/api/users/${id}/activate`, undefined).then(({ data }) => data);
}

function getDashboard(): Promise<DashboardData> {
    return mainAPI.get<DashboardData>(`/api/dashboard`).then(({ data }) => data);
}

type DeactivateUserResponse = { acknowledge: boolean };

function deactivateUser(id: number): Promise<DeactivateUserResponse> {
    return mainAPI.patch<DeactivateUserResponse>(`/api/users/${id}/deactivate`).then(({ data }) => data); // todo check backend implementation
}

export const adminService = {
    getUsers,
    activateUser,
    deactivateUser,
    getDashboard
};
