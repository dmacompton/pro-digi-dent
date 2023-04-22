import { Content, Header } from "antd/lib/layout/layout";
import React from "react";
import { Button, Layout as AntLayout } from "antd";
import { Sidebar } from "../Sidebar/Sidebar";
import styled from "styled-components";
import { useAppDispatch } from "../../app/hooks";
import { logOut } from "../../state/user/user.action";
import { history } from "../../helpers/history";
import { RouterItemData } from "../../App";
import { userActions } from "../../state/user/user.reducer";

const StyledLayout = styled(AntLayout)`
    height: 100vh;

    .ant-layout {
        background-color: white;
    }
`;

const StyledContextLayout = styled(Content)`
    position: relative;
    overflow: auto;
`;

const StyledHeader = styled(Header)`
    display: flex;
    align-items: center;
    padding-left: 20px;
    background: #eee;
`;

const Logo = styled.div`
    flex: 1;
    height: 50px;
    background-image: url(${process.env.PUBLIC_URL + "/logo.png"});
    background-repeat: no-repeat;
    background-size: contain;
`;

type LayoutProps = {
    routes: RouterItemData[];
    isAdmin: boolean;
};

const LogOutButton: React.FC = () => {
    const dispatch = useAppDispatch();

    const onClick = () => {
        dispatch(userActions.logout());

        logOut();
    };

    return (
        <Button type="default" onClick={onClick}>
            Log out
        </Button>
    );
};

const CreateOrderButton: React.FC = () => {
    const onClick = () => history.push("/user/new-order");

    return (
        <Button type="default" onClick={onClick} style={{ marginRight: 12 }}>
            Create order
        </Button>
    );
};

export const Layout: React.FC<LayoutProps> = ({ isAdmin, routes, children }) => {
    return (
        <StyledLayout>
            <StyledHeader>
                <Logo />
                {!isAdmin && <CreateOrderButton />}
                <LogOutButton />
            </StyledHeader>
            <AntLayout hasSider={true}>
                <Sidebar routes={routes} />
                <StyledContextLayout>{children}</StyledContextLayout>
            </AntLayout>
        </StyledLayout>
    );
};
