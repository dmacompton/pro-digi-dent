import React, { useCallback, useEffect, useState } from "react";
import { fileService } from "../../../services/file.service";
import styled from "styled-components";
import { FileWithPath } from "react-dropzone";
import { UploadOutlined } from "@ant-design/icons";
import { FileData } from "../../../services/orders.service";
import { showNotification } from "../../../adapters/notification";
import { MAX_FILE_SIZE_TO_UPLOAD_AS_FILE, UPLOADING_STATUS } from "./constant";

type Props = {
    files: File[];
    id: number;
    countRejFiles: number;
    setUploadingStatus: (status: UPLOADING_STATUS) => void;
    onComplete: () => void;
    onCompleteFileUpload: (data: FileData) => void;
};

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    height: 22px;

    .acceptedFiles {
        color: green;
    }
    .rejectedFiles {
        color: red;
    }
`;

const isFolder = (file: FileWithPath): boolean => {
    if (file.path === undefined) {
        return false;
    }

    return file.path.includes("/");
};

const DEBUG_MODE = false;

type SortedFiles = {
    folder: FileWithPath[];
    file: FileWithPath[];
};

const uploadFiles = async (
    id: number,
    file: File,
    setProgressPercentage: (percentage: number) => void,
    onComplete: () => void,
    onCompleteFileUpload: (data: FileData) => void
): Promise<void> => {
    if (file.size > MAX_FILE_SIZE_TO_UPLOAD_AS_FILE) {
        await fileService.uploadLargeFile(id, file, setProgressPercentage, onComplete);
    } else {
        const fileData = await fileService.uploadFile(id, file);
        onCompleteFileUpload(fileData);
    }
};

export const MultipartFileUpload: React.FC<Props> = ({
    id,
    files,
    setUploadingStatus,
    countRejFiles,
    onComplete,
    onCompleteFileUpload
}) => {
    const [progress, setProgress] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [amountOfFilesUploaded, setAmountOfFilesUploaded] = useState(0);
    const [amountOfFiles, setAmountOfFiles] = useState<number | undefined>(undefined);

    const setProgressPercentage = useCallback(
        (percentage: number) => {
            setProgress(percentage);
            setUploadingStatus(percentage === 100 ? UPLOADING_STATUS.NOT_PROGRESS : UPLOADING_STATUS.IN_PROGRESS);
        },
        [setProgress, setUploadingStatus]
    );

    useEffect(() => {
        if (progress === 0 || progress === 100) {
            setProcessing(false);
        } else {
            setProcessing(true);
        }
    }, [progress]);

    const uploadFile = useCallback(
        async (files: File[]) => {
            setProcessing(true);

            const sortedFiles: SortedFiles = files.reduce<SortedFiles>(
                (acc, file) => {
                    if (isFolder(file)) {
                        return { ...acc, folder: [...acc.folder, file] };
                    }

                    return { ...acc, file: [...acc.file, file] };
                },
                { folder: [], file: [] }
            );

            const onCompleteUploadingLargeFile = () => {
                showNotification({
                    message: "Files successfully uploaded",
                    icon: <UploadOutlined style={{ color: "green" }} />
                });

                setTimeout(() => onComplete(), 100);
            };

            try {
                if (sortedFiles.folder.length) {
                    const filesArray: FileWithPath[] = [...sortedFiles.folder];

                    if (filesArray.length === 0) {
                        return;
                    }

                    setUploadingStatus(UPLOADING_STATUS.IN_PROGRESS);

                    const folderName = filesArray[0].path?.split("/").filter(Boolean)[0] || "folder";

                    const uploadId = `${folderName}-${+new Date()}`;

                    setAmountOfFiles(filesArray.length);

                    for (const file of filesArray) {
                        const index = filesArray.indexOf(file);

                        await fileService.uploadFolderFile(
                            id,
                            file as File,
                            folderName,
                            uploadId,
                            index === filesArray.length - 1
                        );

                        setAmountOfFilesUploaded(index + 1);
                    }

                    setAmountOfFiles(undefined);
                    setAmountOfFilesUploaded(0);

                    onComplete();
                }

                if (sortedFiles.file.length) {
                    const filesArray: FileWithPath[] = [...sortedFiles.file];

                    if (filesArray.length === 0) {
                        return;
                    }

                    setAmountOfFiles(filesArray.length);

                    setUploadingStatus(UPLOADING_STATUS.IN_PROGRESS);

                    for (const file of filesArray) {
                        const index = filesArray.indexOf(file);

                        await uploadFiles(
                            id,
                            file as File,
                            setProgressPercentage,
                            onCompleteUploadingLargeFile,
                            onCompleteFileUpload
                        );

                        setAmountOfFilesUploaded(index + 1);
                    }

                    setAmountOfFiles(undefined);
                    setAmountOfFilesUploaded(0);
                }
            } catch (e) {
                showNotification({
                    message: "Something went wrong",
                    icon: <UploadOutlined style={{ color: "red" }} />
                });
            }

            setProgressPercentage(100);
            setProcessing(false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id, setUploadingStatus, setProgressPercentage]
    );

    useEffect(() => {
        if (files.length === 0) {
            return;
        }

        uploadFile(files);
    }, [uploadFile, files]);

    if (!processing) {
        return null;
    }

    if (DEBUG_MODE) {
        return (
            <Container>
                {files.length !== 0 && (
                    <span className="acceptedFiles">
                        Uploadable files: <b>{files.length}</b>
                    </span>
                )}
                {countRejFiles !== 0 && (
                    <span className="rejectedFiles">
                        Rejected files: <b>{countRejFiles}</b>
                    </span>
                )}
                Progress {progress}
            </Container>
        );
    }

    if (amountOfFiles !== undefined) {
        return (
            <div>
                {amountOfFilesUploaded}/{amountOfFiles}
            </div>
        );
    }

    if (progress === 0) {
        return null;
    }

    return <div>{progress}%</div>;
};
