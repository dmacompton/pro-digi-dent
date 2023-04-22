import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import styled from "styled-components";
import { MultipartFileUpload } from "./MultipleFileUpload";
import { UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { getOrderFileAsync } from "../../../state/orders/orders.action";
import { useAppDispatch } from "../../../app/hooks";
import { FileData } from "../../../services/orders.service";
import { ordersActions } from "../../../state/orders/orders.reducer";
import { MAX_FILE_SIZE, UPLOADING_STATUS } from "./constant";
import { UploadingLoader } from "./UploadingLoader";

type SectionProps = {
    $isDragAccept: boolean;
    $isDragReject: boolean;
    $isDragActive: boolean;
    $isDisabled: boolean;
};

const getColor = (props: SectionProps, isBorder: boolean) => {
    if (props.$isDragAccept) {
        return isBorder ? "#00e676" : "rgba(0,230,118,0.25)";
    }
    if (props.$isDragReject) {
        return isBorder ? "#ff1744" : "rgba(255,23,68,0.25)";
    }
    if (props.$isDragActive) {
        return isBorder ? "#2196f3" : "rgba(33,150,243,0.25)";
    }
    return isBorder ? "#c5c5c5" : "#fafafa";
};

const StyledSection = styled.section<SectionProps>`
    position: relative;
    background-color: beige;

    .dropzone {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        border-width: 2px;
        border-radius: 2px;
        border-color: ${props => getColor(props, true)};
        background: ${props => getColor(props, false)};
        border-style: dashed;
        color: #bdbdbd;
        outline: none;
        transition: border 0.24s ease-in-out;

        &:hover {
            cursor: ${p => p.$isDisabled && "not-allowed"};
            border-color: ${props => getColor(props, true)};
            background: ${props => getColor(props, false)};
        }
    }

    .ant-upload-container {
        text-align: center;
    }
    .ant-upload-drag-icon {
        margin-bottom: 20px;

        .anticon-inbox {
            color: #40a9ff;
            font-size: 48px;
        }
    }
    .ant-upload-text {
        margin: 0 0 4px;
        color: rgba(0, 0, 0, 0.85);
        font-size: 16px;
    }
    .ant-upload-hint {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
    }
`;

const StyledButton = styled(Button)`
    margin-left: 16px;
    margin-bottom: 16px;
`;

const ButtonContainer = styled.div`
    display: flex;
    place-content: end;
`;

const Container = styled.div``;

const Progress = styled.aside`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;

    display: flex;
    justify-content: center;
    align-items: center;

    color: #05bfff;
    font-weight: 500;
    font-size: 16px;

    user-select: none;
`;

type Props = { id: number; orderNumber: string };

export const FileUploader: React.FC<Props> = ({ id, orderNumber }) => {
    const dispatch = useAppDispatch();

    const [uploadingStatus, setUploadingStatus] = useState<UPLOADING_STATUS>(UPLOADING_STATUS.NOT_PROGRESS);

    const onComplete = useCallback(() => {
        dispatch(getOrderFileAsync(orderNumber));
        setUploadingStatus(UPLOADING_STATUS.NOT_PROGRESS);
    }, [dispatch, orderNumber]);

    const updateOrderFiles = (file: FileData) => {
        dispatch(ordersActions.addFile(file));
    };

    const [nativeFiles, setNativeFiles] = useState<File[]>([]);
    const [countRejFiles, setCountRejFiles] = useState<number>(0);

    const onDrop = useCallback(
        (accFiles: File[], rejFiles: FileRejection[]) => {
            setNativeFiles(accFiles);
            setCountRejFiles(rejFiles.length);
        },
        [setNativeFiles, setCountRejFiles]
    );

    const disableUploadFiles =
        uploadingStatus === UPLOADING_STATUS.IN_PROGRESS || uploadingStatus === UPLOADING_STATUS.PREPARING_ARCHIVE;

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = useDropzone({
        onDrop,
        disabled: disableUploadFiles,
        maxSize: MAX_FILE_SIZE
    });

    const { getInputProps: getInputPropsMultiple, open: openMultiple } = useDropzone({
        onDrop,
        disabled: disableUploadFiles,
        maxSize: MAX_FILE_SIZE
    });

    const props = {
        webkitdirectory: "",
        directory: "",
        multiple: true
    };

    return (
        <Container>
            <ButtonContainer>
                <StyledButton onClick={open} icon={<UploadOutlined />}>
                    Click to upload
                </StyledButton>
                <StyledButton onClick={openMultiple} icon={<UploadOutlined />}>
                    Click to upload folder
                </StyledButton>
            </ButtonContainer>

            <input {...getInputPropsMultiple()} {...props} />

            <StyledSection
                className="container"
                $isDragActive={isDragActive}
                $isDragAccept={isDragAccept}
                $isDragReject={isDragReject}
                $isDisabled={disableUploadFiles}
            >
                <div {...getRootProps({ isDragActive, isDragAccept, isDragReject, className: "dropzone" })}>
                    <input {...getInputProps()} />
                    <UploadingLoader status={uploadingStatus} />

                    <Progress>
                        <MultipartFileUpload
                            id={id}
                            files={nativeFiles}
                            setUploadingStatus={setUploadingStatus}
                            countRejFiles={countRejFiles}
                            onComplete={onComplete}
                            onCompleteFileUpload={updateOrderFiles}
                        />
                    </Progress>
                </div>
            </StyledSection>
        </Container>
    );
};
