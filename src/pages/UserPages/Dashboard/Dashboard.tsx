import React, { useEffect, useState } from "react";
import { Badge, Col, Descriptions, Row } from "antd";
import { adminService } from "../../../services/admin.service";
import { DashboardData } from "../../../services/admin.service.type";
import { Loading } from "../../../components/Loading";
import { StatusTag } from "../../../components/Status/Status";
import { createOrderUrl } from "../../../helpers/router";
import { Link } from "react-router-dom";
import { REQUEST_TYPE } from "../../../services/orders.service.type";
import { assertInvalidValue } from "../../../assert/assert-never";
import styled from "styled-components";

const getRequestLabel = (type: REQUEST_TYPE) => {
    switch (type) {
        case REQUEST_TYPE.QUOTE:
            return "quote";
        case REQUEST_TYPE.TRACKING_NUMBER:
            return "tracking number";
        default:
            return assertInvalidValue(type);
    }
};

const Container = styled.div`
    padding: 24px 0;
`;

const DashboardPage: React.FC = () => {
    const [data, setData] = useState<DashboardData>();
    const [totalRequest, setTotalRequest] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            const response = await adminService.getDashboard();
            setData(response);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data === undefined) return;

        setTotalRequest(data.orders.reduce((acc, { total }) => acc + total, 0));
    }, [data]);

    if (!data) {
        return <Loading center />;
    }

    return (
        <Container>
            <Row gutter={12}>
                <Col offset={1} span={5}>
                    <h1>Order statistic ({totalRequest})</h1>

                    <Descriptions bordered size="small" column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
                        {data.orders.map(order => (
                            <Descriptions.Item label={<StatusTag status={order.type} />} key={order.type}>
                                {order.total}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                </Col>
                {data.requests.length > 0 && (
                    <Col offset={1} span={7}>
                        <h1>Requests ({data.requests.length})</h1>
                        <Descriptions bordered size="small" column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
                            {data.requests.map(request => (
                                <Descriptions.Item
                                    label={
                                        <Link to={createOrderUrl(true, request.order.number)}>
                                            {request.order.doctor_name}/{request.order.patient_name}
                                        </Link>
                                    }
                                    key={request.id}
                                >
                                    {getRequestLabel(request.type)}
                                </Descriptions.Item>
                            ))}
                        </Descriptions>
                    </Col>
                )}
                {data.unread_messages.length > 0 && (
                    <Col offset={1} span={7}>
                        <h1>Unread chat messages ({data.unread_messages.length})</h1>
                        <Descriptions bordered size="small" column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
                            {data.unread_messages.map(data => (
                                <Descriptions.Item
                                    label={
                                        <Badge dot={true}>
                                            <Link to={createOrderUrl(true, data.order.number, "active=chat")}>
                                                {data.order.doctor_name}
                                            </Link>
                                        </Badge>
                                    }
                                    key={data.id}
                                >
                                    {data.order.patient_name}
                                </Descriptions.Item>
                            ))}
                        </Descriptions>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default DashboardPage;
