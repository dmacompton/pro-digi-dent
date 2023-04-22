import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Menu, Layout } from "antd";

import { useLocation } from "react-router";
import { RouterItemData } from "../../App";

const StyledSidebar = styled(Layout.Sider)`
    background: #eee;

    .ant-layout-sider-trigger {
        background: #eee;
        color: rgba(0, 0, 0, 0.85);

        &:hover {
            background: #d6d6d6;
        }
    }
`;

const StyledMenu = styled(Menu)`
    background: #eee;

    .ant-menu-item {
        &:hover {
            background: #7e7e7e;
            color: white;

            &:after {
                border-right-color: #e92025;
            }

            .ant-menu-title-content {
                a {
                    color: white;
                }
            }
        }

        &.ant-menu-item-selected {
            background: #d6d6d6;
            color: rgba(0, 0, 0, 0.85);

            &:after {
                border-right-color: #e92025;
            }

            .ant-menu-title-content {
                a {
                    color: rgba(0, 0, 0, 0.85);
                }
            }
        }
    }
`;

const StyledMenuItem = styled(Menu.Item)`
    background: #eee;
`;

type SidebarProps = {
    routes: RouterItemData[];
};

export const Sidebar: React.FC<SidebarProps> = ({ routes }) => {
    const { pathname } = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const onCollapse = () => {
        setCollapsed(!collapsed);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const activeKey = useMemo(() => routes.find(({ route }) => route === pathname)?.route || "", [routes]);

    return (
        <StyledSidebar collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <StyledMenu mode="inline" defaultSelectedKeys={[activeKey]}>
                {routes.map(({ route, title, icon }) => (
                    <StyledMenuItem key={route} icon={icon}>
                        <Link to={route}>{title}</Link>
                    </StyledMenuItem>
                ))}
            </StyledMenu>
        </StyledSidebar>
    );
};
