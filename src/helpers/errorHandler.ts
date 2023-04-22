import { AxiosError } from "axios";
import { notificationError } from "../adapters/notification";

export const requestErrorHandler = (err: AxiosError<{ errors: { [name: string]: string[] } }>) => {
    const errors = err.response?.data.errors;

    if (errors === undefined) return;

    const errorMessages = Object.keys(errors).reduce<string[]>((acc, key) => [...acc, ...errors[key]], []);

    if (errorMessages.length === 0) return;

    const message = errorMessages.join("\n");

    notificationError(message);

    return message;
};
