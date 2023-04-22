import { Button, PageHeader } from "antd";
import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import { BookMeeting } from "./BookMeeting";
import { CONFIG } from "../../../config/url";

const StyledButton = styled(Button)`
    height: max-content;
    margin: 5px 0;
`;

const Container = styled.div``;

const ButtonContainer = styled.div`
    width: 600px;
    margin: 60px auto 0;
`;

enum EVENT_TYPE {
    CONSULTATION_SHORT,
    CONSULTATION_EXTENDED,
    TRAINING_SESSION,
    TRAINING_ADVANCED
}

const EventTypes = [
    EVENT_TYPE.CONSULTATION_SHORT,
    EVENT_TYPE.CONSULTATION_EXTENDED,
    EVENT_TYPE.TRAINING_SESSION,
    EVENT_TYPE.TRAINING_ADVANCED
];

const EventContent: Record<EVENT_TYPE, ReactNode> = {
    [EVENT_TYPE.CONSULTATION_SHORT]: (
        <>
            <b>Consultation</b>
            <br />
            30 min, $60
        </>
    ),
    [EVENT_TYPE.CONSULTATION_EXTENDED]: (
        <>
            <b>Extended consultation</b>
            <br />
            60 min, $100
        </>
    ),
    [EVENT_TYPE.TRAINING_SESSION]: (
        <>
            <b>Implastation basic training session</b> <br />
            2,5 hours, $350
        </>
    ),
    [EVENT_TYPE.TRAINING_ADVANCED]: (
        <>
            <b>Implastation advanced training</b> <br />
            5-6 online hours training and individual support for the next 60 days
            <br />
            $1200, please contact us to arrange a time and day.
        </>
    )
};

const URLS: Record<EVENT_TYPE, string> = {
    [EVENT_TYPE.CONSULTATION_SHORT]: CONFIG.calendly.consultationShort,
    [EVENT_TYPE.CONSULTATION_EXTENDED]: CONFIG.calendly.consultationExtended,
    [EVENT_TYPE.TRAINING_SESSION]: CONFIG.calendly.trainingSession,
    [EVENT_TYPE.TRAINING_ADVANCED]: CONFIG.calendly.trainingAdvanced
};

type SelectButtonProps = {
    onClick: () => void;
};

const SelectButton: React.FC<SelectButtonProps> = ({ children, onClick }) => (
    <StyledButton type="default" size="large" block={true} onClick={onClick}>
        {children}
    </StyledButton>
);

const BookMeetingPage: React.FC = () => {
    const [selectedType, setType] = useState<EVENT_TYPE>();

    return (
        <Container>
            <PageHeader
                className="site-page-header"
                onBack={selectedType !== undefined ? () => setType(undefined) : undefined}
                title="Book a meeting"
            />
            {selectedType !== undefined ? (
                <BookMeeting url={URLS[selectedType]} />
            ) : (
                <ButtonContainer>
                    {EventTypes.map(type => (
                        <SelectButton key={type} onClick={() => setType(type)}>
                            {EventContent[type]}
                        </SelectButton>
                    ))}
                </ButtonContainer>
            )}
        </Container>
    );
};

export default BookMeetingPage;
