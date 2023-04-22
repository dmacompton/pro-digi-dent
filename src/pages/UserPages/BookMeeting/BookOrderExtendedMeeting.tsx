import { BookMeeting } from "./BookMeeting";
import React from "react";
import { useParams } from "react-router";
import { PageHeader } from "antd";
import { useAppSelector } from "../../../app/hooks";
import { orderReturnHandler } from "../../../helpers/router";
import { CONFIG } from "../../../config/url";

const BookOrderExtendedMeeting = () => {
    const isAdmin = useAppSelector(state => state.user.data?.is_admin);
    const { id }: { id: string } = useParams();

    return (
        <div>
            <PageHeader onBack={orderReturnHandler(isAdmin, id)} title="Book extended meeting" />
            <BookMeeting url={CONFIG.calendly.orderConsultationExtended} />;
        </div>
    );
};

export default BookOrderExtendedMeeting;
