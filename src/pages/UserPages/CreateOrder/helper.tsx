import { OptionList } from "../../../state/orders/orders.reducer";
import { FieldOption, FieldCheckboxGroupValue } from "../../../components/FormFields/types";

export const formItemLayout = {
    labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 6
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 16
        }
    }
};

export function getOptions(options: OptionList, isNumber?: boolean): FieldOption[] {
    return Object.keys(options).map(key => ({
        value: isNumber ? Number(key) : `${key}`,
        // @ts-ignore
        label: String(options[key])
    }));
}

export function getCheckbox(options: string[]): FieldCheckboxGroupValue[] {
    return options.map(option => ({ value: option, label: option }));
}
