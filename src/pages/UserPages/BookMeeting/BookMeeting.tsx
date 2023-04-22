import React from "react";
import { useAppSelector } from "../../../app/hooks";
import { InlineWidget } from "react-calendly";

type Props = {
    url: string;
};

export const BookMeeting: React.FC<Props> = props => {
    const user = useAppSelector(state => state.user.data);

    return (
        <InlineWidget
            prefill={{ name: user?.name, email: user?.email }}
            pageSettings={{
                hideGdprBanner: true,
                hideEventTypeDetails: false,
                hideLandingPageDetails: false
            }}
            iframeTitle="ProDigiDent"
            url={props.url}
        />
    );
};
