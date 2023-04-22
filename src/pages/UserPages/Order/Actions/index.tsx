import { history } from "../../../../helpers/history";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ordersService } from "../../../../services/orders.service";
import { ActionButton } from "./ActionButton";
import { Button, Input, Tooltip } from "antd";
import { notificationSuccess } from "../../../../adapters/notification";
import styled from "styled-components";
import { chatService } from "../../../../services/chat.service";
import { RequestData } from "../../../../services/admin.service.type";
export { DeleteAction } from "./DeleteAction";
export { ConfirmByAction } from "./ConfirmBy";

export const BookMeetingAction: React.FC<{ orderNumber: string }> = ({ orderNumber }) => {
    return (
        <>
            <Tooltip placement="top" title="15 minutes">
                <ActionButton key="BookShortMeetingAction" type="primary">
                    <Link to={`/user/book-short-meeting/${orderNumber}`}>Book short meeting</Link>
                </ActionButton>
            </Tooltip>

            <Tooltip placement="top" title="30 minutes">
                <ActionButton key="BookExtendedMeetingAction" type="primary">
                    <Link to={`/user/book-extended-meeting/${orderNumber}`}>Book extended meeting</Link>
                </ActionButton>
            </Tooltip>
        </>
    );
};

const navigateToViewOrder = (number: string, isAdmin: boolean) => () => {
    const url = isAdmin ? `/admin/view-order/${number}` : `/user/view-order/${number}`;
    // @ts-ignore
    window.open(url, "_blank").focus();
};

export const FullOrderAction: React.FC<{ orderNumber: string; isAdmin: boolean }> = ({ orderNumber, isAdmin }) => {
    return (
        <ActionButton key="FullOrderAction" type="primary" onClick={navigateToViewOrder(orderNumber, isAdmin)}>
            Order form
        </ActionButton>
    );
};

const StyledGroup = styled(Input.Group)`
    width: auto;
    margin: 0 8px 8px 0;
`;

export const SendTrackingNumberAction: React.FC<{ id: number }> = ({ id }) => {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    return (
        <StyledGroup>
            <Input
                style={{ width: 200 }}
                value={trackingNumber}
                onInput={e => setTrackingNumber(e.currentTarget.value)}
                defaultValue={`${id}`}
                placeholder="Tracking number"
                disabled={isLoading}
            />
            <Button
                type="primary"
                loading={isLoading}
                disabled={trackingNumber.length === 0}
                onClick={async () => {
                    setIsLoading(true);
                    await chatService.sendChatMessage(
                        id,
                        `Open: https://www.tollgroup.com/toll-tracking\nand add a Tracking number: ${trackingNumber}`
                    );
                    notificationSuccess("You've sent a tracking number to the user");

                    setTrackingNumber("");
                    setIsLoading(false);
                }}
            >
                Send
            </Button>
        </StyledGroup>
    );
};

export const SendQuoteAction: React.FC<{ id: number; requests: RequestData[] }> = ({ id, requests }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <ActionButton
            key="SentQuote"
            type="ghost"
            loading={isLoading}
            onClick={async () => {
                const message = "MESSAGE SentQuote";
                setIsLoading(true);

                if (requests.length) {
                    const requestPromises: Promise<unknown>[] = [];
                    requests.forEach(request => requestPromises.push(ordersService.cleanOrderRequest(id, request.id)));

                    await Promise.all(requestPromises);
                }

                await chatService.sendChatMessage(id, message);
                notificationSuccess("You've sent a quote to the user");
                setIsLoading(false);
            }}
        >
            Sent Quote
        </ActionButton>
    );
};

export const PrintAction: React.FC<{ orderNumber: string; id: number }> = ({ orderNumber, id }) => {
    return (
        <Tooltip placement="top" title="Print or Export Order Form">
            <ActionButton
                key="PrintAction"
                type="primary"
                onClick={() => {
                    ordersService.printOrder(id, orderNumber);
                }}
            >
                Print Order Form
            </ActionButton>
        </Tooltip>
    );
};

const navigateToEditOrder = (number: string, id: number, isAdmin: boolean) => () => {
    return isAdmin
        ? history.push(`/admin/edit-order/${number}/${id}`)
        : history.push(`/user/edit-order/${number}/${id}`);
};

export const EditOrderAction: React.FC<{ orderNumber: string; id: number; isAdmin: boolean }> = ({
    orderNumber,
    id,
    isAdmin
}) => {
    return (
        <ActionButton key="EditOrderAction" type="ghost" onClick={navigateToEditOrder(orderNumber, id, isAdmin)}>
            Edit Order
        </ActionButton>
    );
};

export const RequestQuoteAction: React.FC<{ id: number }> = ({ id }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <ActionButton
            key="RequestQuoteAction"
            type="primary"
            loading={isLoading}
            onClick={async () => {
                setIsLoading(true);
                await ordersService.requestOrderQuote(id);

                notificationSuccess("You have requested a quote");
                setIsLoading(false);
            }}
        >
            Request a quote
        </ActionButton>
    );
};

export const RequestTrackingNumberAction: React.FC<{ id: number }> = ({ id }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <ActionButton
            key="RequestTrackingNumberAction"
            type="primary"
            loading={isLoading}
            onClick={async () => {
                setIsLoading(true);
                await ordersService.requestOrderTracking(id);

                notificationSuccess("You have requested a tracking number");
                setIsLoading(false);
            }}
        >
            Request tracking number
        </ActionButton>
    );
};
