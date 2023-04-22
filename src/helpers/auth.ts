import { getAccessToken, JWT_HEADER, JWT_HEADER_PREFIX } from "./api-jwt";

export type UserTokenData = { token: string };

export function authHeader(hideContentType?: boolean) {
    const defaultHeader = {
        "Access-Control-Allow-Origin": "*",
        Accept: "application/vnd.api+json"
    };

    if (!hideContentType) {
        // @ts-ignore
        defaultHeader["Content-Type"] = "application/json";
    }

    return defaultHeader;
}

function createAuthorizationHeader(token: string): string {
    return `${JWT_HEADER_PREFIX}${token}`;
}

export function getAuthorizationHeader() {
    const accessToken = getAccessToken();

    if (!accessToken) {
        return {};
    }

    return {
        [JWT_HEADER]: createAuthorizationHeader(accessToken)
    };
}
