import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { activateUserAsync, deactivateUserAsync, getUsersAsync } from "../../state/admin/admin.action";
import Table from "antd/lib/table";
import { UserData } from "../../services/admin.service";
import { sortNumber, sortString } from "../../helpers/utils";
import { Button, Space } from "antd";
import styled from "styled-components";
import { Columns, useAdvancedFeaturesTable } from "../../helpers/useTableHook";
import { unwrapResult } from "@reduxjs/toolkit";
import { UserOutlined } from "@ant-design/icons";
import { history } from "../../helpers/history";
import { showNotification } from "../../adapters/notification";

type User = {
    id: number;
    email: string;
    name: string;
    phone: string;
    practice_name: string;
    active: boolean;
};

const mapUserDataToUser = (data: UserData): User => ({
    id: data.id,
    email: data.email,
    name: data.name,
    phone: data.phone,
    practice_name: data.practice.name,
    active: Boolean(data.active) // todo remove Boolean
});

const Container = styled.div`
    margin: auto;
    padding: 24px;
    position: relative;
    height: 100%;

    .ant-table-content {
        border: 1px solid #f3f3f3;
        border-bottom: none;

        .ant-table-thead {
            user-select: none;
        }
    }
`;

const PER_PAGE_DEFAULT = 10;

const CreateOrderButton: React.FC<Pick<User, "id">> = ({ id }) => {
    const onClick = () => history.push(`/admin/new-order/${id}`);

    return (
        <Button type="default" onClick={onClick} style={{ marginRight: 12 }}>
            Create order
        </Button>
    );
};

const UsersPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const [paginationData, setPaginationData] = useState({
        currentPage: 1,
        perPage: PER_PAGE_DEFAULT
    });

    const userId = useAppSelector(state => state.user.data?.id);

    useEffect(() => {
        onPaginationChanged(paginationData.currentPage, paginationData.perPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onPaginationChanged = useCallback(
        (currentPage: number, perPage: number = PER_PAGE_DEFAULT) => {
            const data = { currentPage, perPage };
            setPaginationData(data);
            dispatch(getUsersAsync(data));
        },
        [dispatch]
    );

    const onActivateUserClick = (id: number) => {
        dispatch(activateUserAsync(id))
            .then(unwrapResult)
            .then(({ acknowledge }) => {
                if (acknowledge) {
                    onPaginationChanged(paginationData.currentPage, paginationData.perPage);

                    showNotification({
                        message: "User is activated successfully",
                        icon: <UserOutlined style={{ color: "lightgreen" }} />
                    });
                } else {
                    showNotification({
                        message: "User was not activated, try again",
                        icon: <UserOutlined style={{ color: "red" }} />
                    });
                }
            });
    };

    const onDeactivateUserClick = (id: number) => {
        dispatch(deactivateUserAsync(id))
            .then(unwrapResult)
            .then(({ acknowledge }) => {
                if (!acknowledge) {
                    return;
                }

                onPaginationChanged(paginationData.currentPage, paginationData.perPage);
            });
    };

    const columns: Columns<User> = getColumnSearchProps => [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            sorter: (a, b) => sortNumber(a.id, b.id)
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            sorter: (a, b) => sortString(a.email, b.email),
            ...getColumnSearchProps("email", "Email")
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => sortString(a.name, b.name),
            ...getColumnSearchProps("name", "Name")
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            sorter: (a, b) => sortString(a.phone, b.phone),
            ...getColumnSearchProps("phone", "Phone")
        },
        {
            title: "Practice name",
            dataIndex: "practice_name",
            key: "practice_name",
            sorter: (a, b) => sortString(a.practice_name, b.practice_name)
        },
        {
            title: "Action",
            key: "action",
            render: ({ id, active }: User) => {
                const isAdmin = id === userId;

                return (
                    <Space size="middle">
                        {!isAdmin && <CreateOrderButton id={id} />}

                        {active ? (
                            <Button
                                type="ghost"
                                danger={true}
                                disabled={isAdmin}
                                onClick={() => onDeactivateUserClick(id)}
                            >
                                Deactivate
                            </Button>
                        ) : (
                            <Button type="ghost" onClick={() => onActivateUserClick(id)} disabled={id === userId}>
                                Activate
                            </Button>
                        )}
                    </Space>
                );
            }
        }
    ];

    const columnsData = useAdvancedFeaturesTable(columns);

    const isLoading = useAppSelector(state => state.admin.isLoading);
    const users = useAppSelector(state => state.admin.users.map(mapUserDataToUser));
    const meta = useAppSelector(state => state.admin.meta);

    return (
        <Container>
            <Table
                columns={columnsData}
                pagination={{
                    position: ["bottomCenter"],
                    total: meta.total,
                    showSizeChanger: true,
                    onChange: onPaginationChanged
                }}
                dataSource={users}
                loading={isLoading}
                size="small"
            />
        </Container>
    );
};

export default UsersPage;
