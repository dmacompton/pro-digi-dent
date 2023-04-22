import styled from "styled-components";
import { Message } from "./MessageProps";
import { useEffect } from "react";
import { ComposeMessage } from "./ComposeMessage/ComposeMessage";
import { chatService } from "../../services/chat.service";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getChatMessagesAsync, readChatMessagesAsync } from "../../state/chat/chat.action";
import { chatActions } from "../../state/chat/chat.reducer";
import { Loading } from "../Loading";

const MessageChatWrapper = styled.div`
    display: flex;
    width: 100%;
    height: 500px;
    flex-direction: column;
    overflow: hidden;
    overflow-y: auto;

    ::-webkit-scrollbar {
        display: none;
    }
`;

const ChatWindow = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
`;

const ChatBox = styled.div`
    display: flex;
    flex-direction: column;
`;

type Props = {
    id: number;
    isAdmin: boolean;
    onOpen: () => void;
};

export const Chat: React.FC<Props> = ({ id, onOpen }) => {
    const dispatch = useAppDispatch();
    const messages = useAppSelector(state => state.chat.messages);
    const userId = useAppSelector(state => state.user.data?.id);
    const isLoading = useAppSelector(state => state.chat.isLoading);

    const scrollToBottom = () => {
        const messageChat = document.getElementById("messageChat");
        if (!messageChat) return;

        messageChat.scrollTop = messageChat.scrollHeight;
    };

    useEffect(() => {
        onOpen();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(getChatMessagesAsync(id));
        dispatch(readChatMessagesAsync(id));

        return () => {
            dispatch(chatActions.clearChat());
        };
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const onSendMessage = (message: string) => chatService.sendChatMessage(id, message);

    return (
        <ChatWindow>
            {isLoading && (
                <div className="loading-container">
                    <Loading center />
                </div>
            )}
            <ChatBox>
                <MessageChatWrapper id="messageChat">
                    {messages.map(message => (
                        <Message
                            id={message.id}
                            text={message.text}
                            isAdmin={message.isAdmin}
                            isMine={message.userId === userId}
                            key={message.id}
                        />
                    ))}
                </MessageChatWrapper>
                <ComposeMessage onSendMessage={onSendMessage} />
            </ChatBox>
        </ChatWindow>
    );
};
