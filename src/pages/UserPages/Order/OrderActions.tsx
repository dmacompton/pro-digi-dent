import { Row } from "antd";
import React from "react";
import { OrderState } from "../../../services/orders.service";
import { STATUS } from "../../../components/Status/Status";
import {
    BookMeetingAction,
    ConfirmByAction,
    DeleteAction,
    EditOrderAction,
    FullOrderAction,
    PrintAction,
    RequestQuoteAction,
    RequestTrackingNumberAction,
    SendQuoteAction,
    SendTrackingNumberAction
} from "./Actions";
import { SubmitAction } from "./Actions/SubmitAction";
import { AdminActions } from "./Actions/AdminActions";

type Props = { order: OrderState; isAdmin: boolean };

export const OrderActions: React.FC<Props> = ({ order, isAdmin }) => {
    const { id, number, status, type, requests } = order;

    const deleteButton = !isAdmin && <DeleteAction id={id} />;
    const bookMeeting = !isAdmin && <BookMeetingAction orderNumber={number} />;
    const fullDetail = <FullOrderAction orderNumber={number} isAdmin={isAdmin} />;
    const printButton = <PrintAction id={id} orderNumber={number} />;
    const requestQuote = <RequestQuoteAction id={id} />;
    const requestTrackingNumber = <RequestTrackingNumberAction id={id} />;
    const confirmBy = <ConfirmByAction id={id} />;
    const editOrder = <EditOrderAction orderNumber={number} id={id} isAdmin={isAdmin} />;

    let component = null;

    if (status === STATUS.Pending) {
        component = (
            <>
                <Row>
                    <SubmitAction id={id} />
                </Row>
                <Row>
                    {fullDetail}
                    {bookMeeting}
                    {printButton}
                    {requestQuote}
                    {deleteButton}
                </Row>
            </>
        );
    }

    if (status === STATUS.Verification) {
        component = (
            <Row>
                {fullDetail}
                {bookMeeting}
                {printButton}
                {requestQuote}
                {isAdmin ? null : editOrder}
                {deleteButton}
            </Row>
        );
    }

    if (status === STATUS.Verified) {
        component = (
            <Row>
                {fullDetail}
                {bookMeeting}
                {printButton}
                {requestQuote}
            </Row>
        );
    }

    if (status === STATUS.NotApproved) {
        component = (
            <>
                <Row>
                    <SubmitAction id={id} />
                </Row>
                <Row>
                    {fullDetail}
                    {bookMeeting}
                    {printButton}
                    {requestQuote}
                    {deleteButton}
                </Row>
            </>
        );
    }

    if (status === STATUS.Confirmation) {
        component = (
            <Row>
                {fullDetail}
                {bookMeeting}
                {printButton}
                {requestQuote}
                {confirmBy}
            </Row>
        );
    }

    if (status === STATUS.Manufacturing) {
        component = (
            <Row>
                {fullDetail}
                {bookMeeting}
                {printButton}
            </Row>
        );
    }

    if (status === STATUS.DesignCompleted) {
        component = (
            <Row>
                {fullDetail}
                {bookMeeting}
                {printButton}
            </Row>
        );
    }

    if (status === STATUS.Shipped) {
        component = (
            <Row>
                {fullDetail}
                {bookMeeting}
                {printButton}
                {requestTrackingNumber}
            </Row>
        );
    }

    return (
        <>
            {component}
            {isAdmin && (
                <>
                    <Row>
                        <AdminActions id={id} orderType={type} />
                        {editOrder}
                        <DeleteAction id={id} />
                    </Row>
                    <Row>
                        <SendTrackingNumberAction id={id} />
                        <SendQuoteAction id={id} requests={requests} />
                    </Row>
                </>
            )}
        </>
    );
};
