import { FileData, OrderState } from "../../../services/orders.service";
import { StatusTag } from "../../../components/Status/Status";
import { ORDER_TYPE, OrderLabel } from "../../../components/OrderLabel/OrderLabel";
import { OrderOptions } from "../../../state/orders/orders.reducer";
import { formatDate } from "../../../helpers/date";

// function formattedDate(d: Date) {
//     let month = String(d.getMonth() + 1);
//     let day = String(d.getDate());
//     const year = String(d.getFullYear());
//
//     if (month.length < 2) month = "0" + month;
//     if (day.length < 2) day = "0" + day;
//
//     return `${day}/${month}/${year}`;
// }

const getFormattedDate = (date: string | undefined) => {
    return date ? formatDate(date) : "N/A";
};

export function prepareDataForView(fields: Partial<keyof OrderState>[], options: OrderOptions, order: OrderState) {
    return fields.map(key => {
        switch (key) {
            case "payor": {
                if (order.payor.type === undefined) {
                    return ["Payor type", "-"];
                }

                return ["Payor type", options.payor[order.payor.type]];
            }
            case "id":
                return ["Order number", order[key]];
            case "required_date":
                return ["Required date", getFormattedDate(order[key])];
            case "surgery_date":
                return ["Surgery date", getFormattedDate(order[key])];
            case "patient_name":
                return ["Patient Name", order[key]];
            case "doctor_name":
                return ["Doctor name", order[key]];
            case "status":
                return ["Order Status", <StatusTag status={order.status} />];
            case "type":
                return ["Order type", <OrderLabel type={order[key] as ORDER_TYPE} />];
            default:
                return ["", ""];
        }
    });
}

export const isImage = (file: FileData) => {
    return (
        file.meta?.type.includes("image") ||
        file.name.toLowerCase().includes("jpg") ||
        file.name.toLowerCase().includes("jpeg") ||
        file.name.toLowerCase().includes("png")
    );
};
