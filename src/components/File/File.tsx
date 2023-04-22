import { Popconfirm, Popover, Tooltip } from "antd";
import styled from "styled-components";
import MoreIcon from "./MoreIcon.svg";
import { FileData } from "../../services/orders.service";
import { fileService } from "../../services/file.service";
import { useState } from "react";
import ReactImageFallback from "react-image-fallback";
import { FileImageOutlined, FileZipOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../app/hooks";
import { removeFileAsync } from "../../state/orders/orders.action";
import { getFormattedDate } from "../../helpers/date";

const Container = styled.div`
    position: relative;
    display: inline-block;
    user-select: none;
    width: 128px;
    height: 128px;
    border-radius: 6px;
    background: #e6eaf8;
    margin: 8px;

    i {
        width: 16px;
        height: 16px;
        line-height: 16px;
        font-size: 16px;
    }

    .user-image {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        max-width: 120px;
        max-height: 90px;
        cursor: pointer;
    }

    a {
        font-size: 13px;
        color: red;
    }

    .ant-badge-count {
        z-index: 1;
        background: green;
        box-shadow: 0 0 0 1px #fff;
    }
    .ant-badge-status-text {
        margin-left: inherit;
        margin-right: 8px;
    }
`;

const IconSvg = styled.img`
    width: 30px;
    height: 30px;
    background-color: transparent;
    cursor: pointer;
    border-radius: 5px;
    margin-left: 10px;
    vertical-align: middle;
`;

const MoreActionsWrapper = styled.div`
    cursor: pointer;

    p {
        font-size: 16px;
        color: #788195;
        text-transform: capitalize;
        font-weight: 500;
        padding: 5px;
        margin: 0;
    }
`;

const StyledPopover = styled(Popover)`
    position: absolute;
    right: 0;
    top: 0;
    transition: box-shadow 0.2s;
    &:hover {
        box-shadow: 0 1px 6px #a5a5a5;
    }
`;

const StyledFileData = styled.span`
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto;
`;

const FileName = styled.span`
    position: absolute;
    bottom: 6px;
    left: 4px;
    font-size: 12px;

    text-overflow: ellipsis;
    overflow: hidden;
    width: calc(100% - 8px);
    height: 1.2em;
    white-space: nowrap;
`;

type Props = {
    isImage: boolean;
    orderId: number;
    onClick?: () => void;
} & FileData;

const StyledFallbackImage = styled(FileImageOutlined)`
    font-size: 72px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    max-height: 90px;
    color: gray;
`;

const StyledArchiveImage = styled(FileZipOutlined)`
    font-size: 72px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    max-height: 90px;
    color: gray;
`;

export const File: React.FC<Props> = ({ name, url, isImage, id, orderId, created_at, onClick }) => {
    const dispatch = useAppDispatch();
    const [isPopupVisible, setPopupVisible] = useState(false);
    const hidePopup = () => setPopupVisible(false);

    const onDownload = () => {
        hidePopup();
        fileService.downloadFile({ name, url, id, orderId, isDirectLink: isImage });
    };

    const onDeleteFile = () => {
        hidePopup();
        dispatch(removeFileAsync({ orderId, fileId: id }));
    };

    const onImageView = () => {
        hidePopup();
        onClick?.();
    };

    const MoreActions = (
        <MoreActionsWrapper>
            {isImage && <p onClick={onImageView}>Preview</p>}
            <p onClick={onDownload}>Download</p>
            <p style={{ color: "#cf1322" }}>
                <Popconfirm
                    title="Are you sure delete this file?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={onDeleteFile}
                    onCancel={hidePopup}
                >
                    Delete
                </Popconfirm>
            </p>
        </MoreActionsWrapper>
    );

    return (
        <Tooltip placement="top" title={getFormattedDate(created_at)}>
            <Container>
                <StyledFileData>
                    <FileName title={name}>{name}</FileName>
                </StyledFileData>
                {isImage ? (
                    <ReactImageFallback
                        className="user-image"
                        src={url}
                        fallbackImage={<StyledFallbackImage />}
                        alt={name}
                        draggable={false}
                        onClick={onClick}
                    />
                ) : (
                    <StyledArchiveImage />
                )}
                <StyledPopover
                    placement="bottom"
                    content={MoreActions}
                    trigger="click"
                    visible={isPopupVisible}
                    onVisibleChange={setPopupVisible}
                >
                    <IconSvg src={MoreIcon} />
                </StyledPopover>
            </Container>
        </Tooltip>
    );
};
