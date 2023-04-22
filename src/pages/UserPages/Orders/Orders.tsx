import { Badge, Button, Space, Table, Tooltip } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { STATUS, StatusTag } from "../../../components/Status/Status";
import { formattedDate } from "./utils";
import styled from "styled-components";
import { sortString } from "../../../helpers/utils";
import { Columns, useAdvancedFeaturesTable } from "../../../helpers/useTableHook";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { OrderState } from "../../../services/orders.service";
import { ORDER_TYPE, OrderLabel } from "../../../components/OrderLabel/OrderLabel";
import { getOrdersAsync, getOrderOptionsAsync } from "../../../state/orders/orders.action";
import { DeleteOrder } from "../Order/DeleteOrder";
import { createOrderUrl } from "../../../helpers/router";

type OrdersPageProps = {};

const Container = styled.div`
    position: relative;
    margin: auto;
    padding: 24px;

    .ant-table-content {
        border: 1px solid #f3f3f3;
        border-bottom: none;

        .ant-table-thead {
            user-select: none;
        }
    }

    .loading-container {
        position: absolute;
        z-index: 2;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        background-color: rgba(255, 255, 255, 0.8);
    }
`;

const PER_PAGE_DEFAULT = 10;

const OrdersPage: React.FC<OrdersPageProps> = () => {
    const dispatch = useAppDispatch();
    const isAdmin = useAppSelector(state => state.admin.isAdmin);
    const isLoading = useAppSelector(state => state.orders.isLoading);
    const meta = useAppSelector(state => state.orders.meta);

    const orders = useAppSelector(state => state.orders.orders);
    const [paginationData, setPaginationData] = useState({
        currentPage: 1,
        perPage: PER_PAGE_DEFAULT
    });

    const onPaginationChanged = useCallback(
        async (currentPage: number, perPage: number = PER_PAGE_DEFAULT) => {
            const data = { currentPage, perPage };
            setPaginationData(data);
            await dispatch(getOrdersAsync(data));
        },
        [dispatch]
    );

    useEffect(() => {
        dispatch(getOrderOptionsAsync());
        onPaginationChanged(paginationData.currentPage, paginationData.perPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // todo add backend search
    const columns: Columns<OrderState> = getColumnSearchProps => [
        {
            title: "Order №",
            dataIndex: "number",
            key: "number",
            render: (id: string) => (
                <Space key={`number-${id}`} size="middle">
                    <Link to={createOrderUrl(isAdmin, id)} key={id}>
                        {id}
                    </Link>
                </Space>
            )
        },
        {
            title: "Order Type",
            key: "type",
            dataIndex: "type",
            render: (type: ORDER_TYPE) => <OrderLabel type={type} />
        },
        {
            title: "Doctor Name",
            dataIndex: "doctor_name",
            key: "doctor_name",
            sorter: (a, b) => sortString(a.doctor_name, b.doctor_name),
            ...getColumnSearchProps("doctor_name", "Doctor Name"),
            render: (name, { contact_email }) => (
                <Tooltip placement="top" title={contact_email}>
                    name
                </Tooltip>
            )
        },
        {
            title: "Patient Name",
            dataIndex: "patient_name",
            key: "patient_name",
            sorter: (a, b) => sortString(a.patient_name, b.patient_name),
            ...getColumnSearchProps("patient_name", "Patient Name")
        },
        {
            title: "Required Date",
            dataIndex: "required_date",
            key: "required_date",
            render: (date: string) => {
                if (!date) {
                    return "N/A";
                }

                return <span key={`required_date-${date}`}>{formattedDate(new Date(date))}</span>;
            },
            sorter: (a, b) => {
                if (!a.required_date || !b.required_date) {
                    return 0;
                }

                return new Date(a.required_date).getTime() - new Date(b.required_date).getTime();
            }
        },
        {
            title: "Surgery date",
            dataIndex: "surgery_date",
            key: "surgery_date",
            render: (date: string) => {
                if (!date) {
                    return "N/A";
                }

                return <span key={`surgery_date-${date}`}>{formattedDate(new Date(date))}</span>;
            },
            sorter: (a, b) => {
                if (!a.surgery_date || !b.surgery_date) {
                    return 0;
                }

                return new Date(a.surgery_date).getTime() - new Date(b.surgery_date).getTime();
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: STATUS) => <StatusTag key={`status-${status}`} status={status} />
        },
        {
            title: "Action",
            key: "action",
            render: ({ status, number, chat, id }: OrderState) => {
                const disabled = !isAdmin && ![STATUS.NotApproved, STATUS.Verification].includes(status);
                return (
                    <Space key={`action-${number}`} size="middle">
                        <Badge dot={Boolean(chat.participants[0].unseen)}>
                            <Button type="ghost">
                                <Link to={createOrderUrl(isAdmin, number)} key={number}>
                                    Open
                                </Link>
                            </Button>
                        </Badge>

                        {!isAdmin && (
                            <Button type="ghost">
                                <Link to={`/user/book-short-meeting/${number}`} key={number}>
                                    Book a meeting
                                </Link>
                            </Button>
                        )}

                        <DeleteOrder
                            id={id}
                            disabled={disabled}
                            onDeleted={() => {
                                return onPaginationChanged(paginationData.currentPage, paginationData.perPage);
                            }}
                        >
                            <Button type="ghost" disabled={disabled}>
                                Delete
                            </Button>
                        </DeleteOrder>
                    </Space>
                );
            }
        }
    ];

    const columnsData = useAdvancedFeaturesTable(columns);

    return (
        <Container>
            <Table
                onChange={(_pagination, search) => {
                    console.log({ search }); // todo add backend search
                }}
                columns={columnsData}
                pagination={{
                    position: ["bottomCenter"],
                    total: meta.total,
                    showSizeChanger: true,
                    onChange: onPaginationChanged
                }}
                dataSource={orders}
                rowKey="id"
                size="small"
                loading={isLoading}
            />
        </Container>
    );
};

export default OrdersPage;
