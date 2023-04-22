import { Button, Input } from "antd";
import React, { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import styled from "styled-components";

const ComposeMessageWrapper = styled.div`
    background: #fafafa;
    flex-shrink: 0;
    border-top: 1px solid #e9e9e9;
    border-bottom: 0;
    display: flex;
    align-items: center;
    padding-right: 24px;
`;

const StyledTextArea = styled(Input.TextArea)`
    padding: 20px;
    border: 0;
    background-color: transparent;
    resize: none;

    &:focus {
        box-shadow: none;
    }
`;

type Props = {
    onSendMessage: (message: string) => void;
};

export const ComposeMessage: React.FC<Props> = props => {
    const [value, setValue] = useState("");

    const onChange: ChangeEventHandler<HTMLTextAreaElement> = event => {
        setValue(event.target.value);
    };

    const onSendMessage = () => {
        if (value?.length > 0) {
            props.onSendMessage(value);
            setValue("");
        } else {
            console.error("error", "Please type something");
        }
    };

    const onKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = event => {
        if (event.key === "Enter") {
            event.preventDefault();
            onSendMessage();
        }
    };

    return (
        <ComposeMessageWrapper>
            <StyledTextArea
                autoFocus={true}
                autoSize={true}
                value={value}
                onChange={onChange}
                onKeyPress={onKeyPress}
                placeholder="Type your message"
            />
            <div className="sendMessageButton">
                <Button disabled={!value.length} type="primary" onClick={onSendMessage}>
                    Send Message
                </Button>
            </div>
        </ComposeMessageWrapper>
    );
};
