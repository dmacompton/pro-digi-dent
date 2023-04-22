import React from "react";
import { Menu, Dropdown, Button, message } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

enum CONFIRM_TYPE {
    Project = "Project",
    Screenshot = "Screenshot",
    Meeting = "Meeting"
}

export const CONFIRM_LABEL: Record<CONFIRM_TYPE, string> = {
    [CONFIRM_TYPE.Project]: "Order was successfully confirmed by project file",
    [CONFIRM_TYPE.Screenshot]: "Order was successfully confirmed by screenshot",
    [CONFIRM_TYPE.Meeting]: "Order was successfully confirmed by meeting"
};

export const Confirm: React.FC = () => {
    const handleMenuClick = (type: CONFIRM_TYPE) => () => {
        const label = CONFIRM_LABEL[type];
        message.success(label);
    };

    const menu = (
        <Menu>
            <Menu.Item onClick={handleMenuClick(CONFIRM_TYPE.Project)} key="1">
                by project file
            </Menu.Item>
            <Menu.Item onClick={handleMenuClick(CONFIRM_TYPE.Screenshot)} key="2">
                by screenshot
            </Menu.Item>
            <Menu.Item onClick={handleMenuClick(CONFIRM_TYPE.Meeting)} key="3">
                by meeting
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu}>
            <Button type="primary">
                Confirm <EllipsisOutlined />
            </Button>
        </Dropdown>
    );
};
