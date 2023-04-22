import { Alert, Badge, Col, Collapse, Layout, PageHeader, Row } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Chat } from "../../../components/Chat/Chat";
import { Loading } from "../../../components/Loading";
import { STATUS } from "../../../components/Status/Status";
import { TimelineView } from "../../../components/TimelineView/Timeline";
import { getOrderAsync, getOrderFileAsync, getOrderOptionsAsync } from "../../../state/orders/orders.action";
import { ordersActions } from "../../../state/orders/orders.reducer";
import { FileUploader } from "./FileUploader";
import { OrderActions } from "./OrderActions";
import { OrderDescription } from "./OrderDescription";
import { FileImages, Files } from "./Files";
import { FileData } from "../../../services/orders.service";
import { isImage } from "./utils";
import { history } from "../../../helpers/history";
import { echoHelper } from "../../../helpers/echo";
import { chatActions, Message as MessageData } from "../../../state/chat/chat.reducer";
import { notificationSuccess } from "../../../adapters/notification";

const Container = styled.div`
    padding: 24px;
`;

const StyledCollapse = styled(Collapse)`
    .ant-collapse-content-box {
        padding: 0;
    }
`;

const StyledBadge = styled(Badge)`
    line-height: 22px;
`;

const StyledCollapsePanel = styled(Collapse.Panel)`
    .ant-collapse-content-box {
        padding: 5px;
    }
`;

const StyledPageHeader = styled(PageHeader)`
    padding-top: 0;
    padding-left: 0;
`;

const OrderPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const order = useAppSelector(state => state.orders.activeOrder);
    const options = useAppSelector(state => state.orders.options);
    const hasError = useAppSelector(state => state.orders.error);
    const isAdmin = useAppSelector(state => Boolean(state.user.data?.is_admin));
    const userId = useAppSelector(state => state.user.data?.id);

    const [isChatOpened, setChatOpened] = useState(false);
    const { id: orderNumber } = useParams<{ id: string; active: string | undefined }>();
    const [activeTab, setActiveTab] = useState<string>();

    useEffect(() => {
        if (order === undefined) {
            return;
        }

        echoHelper.listenChatOrder(order.chat.id, (message: MessageData) => {
            dispatch(chatActions.addMessage(message));
        });

        echoHelper.listenOrderFileCreated(order.id, () => {
            dispatch(getOrderFileAsync(orderNumber));
            notificationSuccess("Your files have been uploaded and archived");
        });

        return () => {
            echoHelper.stopListeningChatOrder(order.chat.id);
            echoHelper.stopListeningOrderFileCreated(order.id);
        };
    }, [order]);

    useEffect(() => {
        const getParams = new URLSearchParams(window.location.search);
        const tab = getParams.get("active");

        if (tab) {
            setActiveTab(tab);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(getOrderOptionsAsync());
        dispatch(getOrderAsync(orderNumber));

        return () => {
            dispatch(ordersActions.cleanActiveOrder());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderNumber]);

    const hasUnreadMessages = useMemo(() => {
        if (isChatOpened) {
            return false;
        }

        if (order === undefined) {
            return false;
        }

        return order.chat.participants.filter(({ user }) => user.id === userId).some(({ unseen }) => unseen);
    }, [order, userId, isChatOpened]);

    const sortedFiles = useMemo(() => {
        if (!order?.files || (order.files && order.files.length === 0)) {
            return { images: [], files: [] };
        }

        return order.files.reduce<{ images: FileData[]; files: FileData[] }>(
            (acc, file) => {
                if (isImage(file)) {
                    return { images: [...acc.images, file], files: acc.files };
                }

                return { images: acc.images, files: [...acc.files, file] };
            },
            { images: [], files: [] }
        );
    }, [order?.files]);

    if (hasError) {
        return <span>Such order does not exist</span>;
    }

    if (!order) {
        return <Loading center />;
    }

    return (
        <Container className="Order">
            <Layout>
                <StyledPageHeader
                    className="site-page-header"
                    onBack={() => history.push(isAdmin ? "/admin/orders" : "/user/orders")}
                    title={`Order #${orderNumber.toUpperCase()}`}
                    subTitle={order.patient_name}
                />
                <Row>
                    <Col span={24} style={{ marginBottom: 24 }}>
                        <Row>
                            <Col span={6} style={{ marginBottom: 24 }}>
                                <OrderDescription
                                    options={options}
                                    order={order}
                                    keys={["type", "status", "doctor_name", "patient_name"]}
                                />
                            </Col>
                            <Col span={16} offset={2} style={{ marginBottom: 24 }}>
                                {order.status === STATUS.Confirmation && (
                                    <Alert
                                        message="Warning"
                                        description="Please upload files"
                                        type="warning"
                                        style={{ marginBottom: 24 }}
                                        showIcon
                                    />
                                )}
                                {order.status === STATUS.Pending && order.activities.length === 1 && (
                                    <Alert
                                        message="Warning"
                                        description="Apply terms and condition"
                                        type="warning"
                                        style={{ marginBottom: 24 }}
                                        showIcon
                                    />
                                )}
                            </Col>
                        </Row>
                    </Col>

                    <Col span={12}>
                        <Collapse>
                            <Collapse.Panel header="Order details" key="1">
                                <OrderDescription
                                    options={options}
                                    order={order}
                                    keys={["payor", "surgery_date", "required_date"]}
                                />
                            </Collapse.Panel>
                        </Collapse>
                        <TimelineView activities={order.activities} />

                        <OrderActions order={order} isAdmin={isAdmin} />

                        <Collapse>
                            <Collapse.Panel header="Upload files" key="1">
                                <FileUploader orderNumber={orderNumber} id={order.id} />
                            </Collapse.Panel>
                        </Collapse>
                    </Col>
                    <Col span={12}>
                        <StyledCollapse defaultActiveKey={activeTab}>
                            <Collapse.Panel header={<StyledBadge dot={hasUnreadMessages}>Chat</StyledBadge>} key="chat">
                                {order.id !== undefined && (
                                    <Chat isAdmin={isAdmin} id={order.id} onOpen={() => setChatOpened(true)} />
                                )}
                            </Collapse.Panel>

                            {Boolean(sortedFiles.images.length) && (
                                <StyledCollapsePanel
                                    header="Screenshots"
                                    extra={<Badge count={sortedFiles.images.length} />}
                                    key="screenshots"
                                >
                                    <FileImages files={sortedFiles.images} orderId={order.id} key="files-image" />
                                </StyledCollapsePanel>
                            )}
                            {Boolean(sortedFiles.files.length) && (
                                <StyledCollapsePanel
                                    header="Files"
                                    extra={<Badge count={sortedFiles.files.length} />}
                                    key="files"
                                >
                                    <Files files={sortedFiles.files} orderId={order.id} key="files" />
                                </StyledCollapsePanel>
                            )}
                        </StyledCollapse>
                    </Col>
                </Row>
            </Layout>
        </Container>
    );
};

export default OrderPage;
