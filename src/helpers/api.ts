import axios from "axios";
import { authHeader } from "./auth";
import { CONFIG } from "../config/url";
import { applyAuthTokenInterceptor, IAuthTokens, JWT_HEADER, JWT_HEADER_PREFIX, TokenRefreshRequest } from "./api-jwt";

const mainAPI = axios.create({ baseURL: CONFIG.baseURL, headers: authHeader() });

const requestRefresh: TokenRefreshRequest = async (refreshToken: string): Promise<IAuthTokens> => {
    const response = await axios.post(`${CONFIG.baseURL}/api/auth/refresh`, { token: refreshToken });

    return {
        accessToken: response.data.token,
        refreshToken: response.data.token
    };
};

applyAuthTokenInterceptor(mainAPI, {
    requestRefresh,
    header: JWT_HEADER,
    headerPrefix: JWT_HEADER_PREFIX
});

export { mainAPI };
