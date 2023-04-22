import { BookMeeting } from "./BookMeeting";
import React from "react";
import { PageHeader } from "antd";
import { useAppSelector } from "../../../app/hooks";
import { useParams } from "react-router";
import { orderReturnHandler } from "../../../helpers/router";
import { CONFIG } from "../../../config/url";

const BookOrderShortMeeting = () => {
    const isAdmin = useAppSelector(state => state.user.data?.is_admin);
    const { id }: { id: string } = useParams();

    return (
        <div>
            <PageHeader onBack={orderReturnHandler(isAdmin, id)} title="Book short meeting" />
            <BookMeeting url={CONFIG.calendly.orderConsultationShort} />;
        </div>
    );
};

export default BookOrderShortMeeting;
