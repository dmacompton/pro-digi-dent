import React, { lazy, LazyExoticComponent, Suspense, useEffect, useMemo } from "react";
import { Redirect, Route, RouteComponentProps, RouteProps, Router, Switch } from "react-router-dom";
import { IndexPage } from "./pages/Index/IndexPage";
import NoMatchPage from "./pages/NoMatch/NoMatch";
import { Layout } from "./components/Layout/Layout";
import { history } from "./helpers/history";
import { SignInPage } from "./pages/SignIn/SignInPage";
import {
    AppstoreOutlined,
    CreditCardOutlined,
    FieldTimeOutlined,
    MailOutlined,
    ProfileOutlined,
    SettingOutlined,
    TeamOutlined
} from "@ant-design/icons";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./App.css";
import "antd/dist/antd.css";
import { SignUpPage } from "./pages/SignUp/SignUpPage";
import { Loading } from "./components/Loading";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import "./helpers/echo";
import { ForgotPasswordPage } from "./pages/PasswordPages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/PasswordPages/ResetPasswordPage";
import { isLoggedIn } from "./helpers/api-jwt";
import { loadingUserData } from "./helpers/login";

const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
    const render = ({ location }: RouteComponentProps) => {
        if (isLoggedIn()) {
            return children;
        }

        return <Redirect to={{ pathname: "/login", state: { from: location } }} />;
    };

    return <Route {...rest} render={render} />;
};

export type RouterItemData = {
    icon: React.ReactNode;
    route: string;
    title: string;
};

export const USER_ROUTES: RouterItemData[] = [
    { title: "Orders", icon: <MailOutlined />, route: "/user/orders" },
    { title: "Book online meeting", icon: <FieldTimeOutlined />, route: "/user/book" },
    { title: "Prices", icon: <CreditCardOutlined />, route: "/user/price" },
    { title: "Guidance", icon: <ProfileOutlined />, route: "/" },
    { title: "Settings", icon: <SettingOutlined />, route: "/user/settings" }
];

export const ADMIN_ROUTES: RouterItemData[] = [
    { title: "Dashboard", icon: <AppstoreOutlined />, route: "/admin" },
    { title: "Orders", icon: <MailOutlined />, route: "/admin/orders" },
    { title: "Users", icon: <TeamOutlined />, route: "/admin/users" }
];

type RouteType = { component: LazyExoticComponent<React.FC>; path: string; exact?: boolean };

const user_routes: RouteType[] = [
    { path: "/user/orders", component: lazy(() => import("./pages/UserPages/Orders/Orders")) },
    { path: "/user/settings", component: lazy(() => import("./pages/UserPages/AccountDetail/AccountDetail")) },
    { path: "/user/book", exact: true, component: lazy(() => import("./pages/UserPages/BookMeeting/BookMeetingPage")) },
    {
        path: "/user/book-short-meeting/:id",
        exact: true,
        component: lazy(() => import("./pages/UserPages/BookMeeting/BookOrderShortMeeting"))
    },
    {
        path: "/user/book-extended-meeting/:id",
        exact: true,
        component: lazy(() => import("./pages/UserPages/BookMeeting/BookOrderExtendedMeeting"))
    },
    { path: "/user/price", component: lazy(() => import("./pages/UserPages/Price/Price")) },
    { path: "/user/order/:id", component: lazy(() => import("./pages/UserPages/Order/Order")) },
    { path: "/user/new-order", component: lazy(() => import("./pages/UserPages/CreateOrder/CreateOrderPage")) },
    {
        path: "/user/view-order/:viewingOrderId",
        component: lazy(() => import("./pages/UserPages/CreateOrder/CreateOrderPage"))
    },
    {
        path: "/user/edit-order/:editingOrderNumber/:editingOrderId",
        component: lazy(() => import("./pages/UserPages/CreateOrder/CreateOrderPage"))
    }
];

const admin_routes: RouteType[] = [
    { path: "/admin", component: lazy(() => import("./pages/UserPages/Dashboard/Dashboard")), exact: true },
    { path: "/admin/orders", component: lazy(() => import("./pages/UserPages/Orders/Orders")) },
    { path: "/admin/order/:id", component: lazy(() => import("./pages/UserPages/Order/Order")) },
    {
        path: "/admin/view-order/:viewingOrderId",
        component: lazy(() => import("./pages/UserPages/CreateOrder/CreateOrderPage"))
    },
    { path: "/admin/users", component: lazy(() => import("./pages/Users/UsersPage")) },
    {
        path: "/admin/new-order/:managingUserId",
        component: lazy(() => import("./pages/UserPages/CreateOrder/CreateOrderPage"))
    },
    {
        path: "/admin/edit-order/:editingOrderNumber/:editingOrderId",
        component: lazy(() => import("./pages/UserPages/CreateOrder/CreateOrderPage"))
    }
];

const StyledLoading = styled(Loading)`
    z-index: 5;
`;

type ProtectedRoutesProps = {
    routes: RouteType[];
};

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ routes }) => (
    <Switch>
        <Suspense fallback={<StyledLoading center />}>
            {routes.map(({ component: Component, path, exact }) => (
                <Route path={path} key={path} exact={exact}>
                    <Component />
                </Route>
            ))}
        </Suspense>
    </Switch>
);

function App() {
    const isAdmin = useAppSelector(state => state.admin.isAdmin);
    const sidebarRoutes = useMemo(() => (isAdmin ? ADMIN_ROUTES : USER_ROUTES), [isAdmin]);
    const routes = useMemo(() => (isAdmin ? admin_routes : user_routes), [isAdmin]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        loadingUserData(dispatch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Router history={history}>
            <Switch>
                <Route path="/" exact component={() => <IndexPage />} />
                <Route path="/login" exact component={() => <SignInPage />} />
                <Route path="/signup" exact component={() => <SignUpPage />} />
                <Route path="/forgot-password" exact component={() => <ForgotPasswordPage />} />
                <Route path="/reset-password" exact component={() => <ResetPasswordPage />} />

                <Layout routes={sidebarRoutes} isAdmin={isAdmin}>
                    <Switch>
                        <PrivateRoute path="/">
                            <ProtectedRoutes routes={routes} />
                        </PrivateRoute>
                    </Switch>
                </Layout>
                <Route path="*">
                    <NoMatchPage />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
