import classnames from "classnames";
import styled from "styled-components";

export type MessageProps = {
    id: number;
    text: string;
    isMine: boolean;
    isAdmin: boolean;
};

const MessageSingle = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 15px 0;
    align-items: flex-start;
    flex-shrink: 0;
    flex-direction: row;

    @media only screen and (max-width: 767px) {
        margin: 10px 0;
    }

    &.userMessage {
        justify-content: flex-end;
    }

    .messageContent {
        display: flex;
        flex-direction: column;
        max-width: calc(100% - 110px);
        flex-shrink: 0;

        .messageContentText {
            position: relative;
            font-size: 14px;
            vertical-align: top;
            display: inline-block;
            padding: 10px 15px;
            word-break: break-word;
            border-radius: 3px;

            p {
                margin: 0;
            }
        }

        .messageTime {
            font-size: 12px;
            color: #5b5b5b;
            margin-top: 5px;
        }

        &.isMine {
            align-items: flex-end;

            .messageContentText {
                background: #3a78f5;
                color: #ffffff;

                &:after {
                    content: "";
                    position: absolute;
                    border-style: solid;
                    display: block;
                    width: 0;
                    inset: 0 -9px auto auto;
                    border-width: 0 0 10px 10px;
                    border-color: transparent rgb(58, 120, 245);
                    margin-top: 0;
                }
            }

            .messageTime {
                margin-left: auto;
            }
        }

        &.isAdmin {
            align-items: flex-start;

            .messageContentText {
                background: #f3f3f3;
                color: #323332;

                &:after {
                    content: "";
                    position: absolute;
                    border-style: solid;
                    display: block;
                    width: 0;
                    top: 0;
                    bottom: auto;
                    left: -9px;
                    border-width: 0 10px 10px 0;
                    border-color: transparent rgb(243, 243, 243);
                    margin-top: 0;
                }
            }

            .messageTime {
                margin-right: auto;
            }
        }
    }
`;

const MessageGravatar = styled.div`
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    margin: 0 20px;
    user-select: none;

    span,
    img {
        box-shadow: 0 1px 5px darkgrey;
        border-radius: 50%;
        width: 100%;
        height: 100%;
        object-fit: fill;
    }

    span {
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }
`;

const StyledTextAvatar = styled.span<{ isMine: boolean }>`
    background-color: ${p => (p.isMine ? "#3a78f5" : "#8a8a8a")};
`;

export const Message: React.FC<MessageProps> = ({ id, text, isAdmin, isMine }) => {
    const AdminAvatar = <img alt="#" src={`${process.env.PUBLIC_URL}/logo192.png`} />;
    const UserAvatar = <StyledTextAvatar isMine={isMine}>{!isMine && !isAdmin ? "User" : "YOU"}</StyledTextAvatar>;
    const avatar = isAdmin ? AdminAvatar : UserAvatar;

    return (
        <MessageSingle className={classnames({ userMessage: isMine })} key={id}>
            {!isMine && <MessageGravatar>{avatar}</MessageGravatar>}

            <div className={classnames("messageContent", { isMine, isAdmin: !isMine })}>
                <div className="messageContentText">
                    <p>{text}</p>
                </div>
            </div>

            {isMine && <MessageGravatar>{avatar}</MessageGravatar>}
        </MessageSingle>
    );
};
