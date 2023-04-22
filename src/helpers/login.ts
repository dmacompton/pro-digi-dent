import { isLoggedIn } from "./api-jwt";
import { getUserInfoAsync } from "../state/user/user.action";
import { DEFAULT_ADMIN_ROUTE, DEFAULT_USER_ROUTE } from "../contants/url";
import { history } from "./history";
import { AppDispatch } from "../app/store";

export function loadingUserData(dispatch: AppDispatch) {
    if (!isLoggedIn()) {
        return;
    }

    dispatch(getUserInfoAsync()).then(data => {
        try {
            // eslint-disable-next-line no-restricted-globals
            if (!["/", DEFAULT_USER_ROUTE].includes(location.pathname)) return;

            data.payload.data.is_admin ? history.push(DEFAULT_ADMIN_ROUTE) : history.push(DEFAULT_USER_ROUTE);
        } catch {
            history.push(DEFAULT_USER_ROUTE);
        }
    });
}
