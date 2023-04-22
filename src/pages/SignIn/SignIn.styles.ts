import { ColProps } from "antd/lib/grid/col";

type Layout = {
    labelCol?: ColProps;
    wrapperCol?: ColProps;
};

export const formItemLayout: Layout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
    }
};

export const tailFormItemLayout: Layout = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 18, offset: 6 }
    }
};
