import { logout } from "../services/user.service";

export function handleLoginResponse(response: Response) {
    return response.text().then((text: string) => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
            }
            let error = response.statusText;

            try {
                // @ts-ignore
                error = Object.values(data?.errors || {})[0][0];
            } catch (e) {
                error = data?.message || response.statusText;
            }

            return Promise.reject(error);
        }

        return data;
    });
}
