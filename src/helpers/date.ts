import moment, { Moment } from "moment";

export const DEFAULT_DATE_FORMAT = "DD/MM/YYYY";

export const formatDate = (date: string | Moment): string => {
    return moment(date).format(DEFAULT_DATE_FORMAT);
};

export const getFormattedDate = (date: string) => {
    return moment(date).format(`${DEFAULT_DATE_FORMAT} HH:MM`);
};
