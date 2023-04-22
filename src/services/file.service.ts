import { authHeader, getAuthorizationHeader } from "../helpers/auth";
import { AxiosRequestConfig } from "axios";
import JSZip from "jszip";
import { FileWithPath } from "react-dropzone";
import { FileData, OrderState } from "./orders.service";
import FileSaver from "file-saver";
import Resumable from "resumablejs";
import { mainAPI } from "../helpers/api";
import { CONFIG } from "../config/url";
import { CHUNK_SIZE } from "../pages/UserPages/Order/constant";

//https://medium.com/@fakiolinho/handle-blobs-requests-with-axios-the-right-way-bb905bdb1c04
// save file

const createResumbale = (target: string) =>
    new Resumable({
        target,
        headers: () => ({
            ...authHeader(true),
            ...getAuthorizationHeader()
        }),
        simultaneousUploads: 4,
        chunkSize: CHUNK_SIZE
    });

const zipFiles = async (
    id: number,
    files: FileWithPath[],
    onUploadProgress: (progress: number) => void,
    setUploadingStatus: () => void
): Promise<File> => {
    const zip = new JSZip();
    setUploadingStatus();

    files.forEach(file => {
        if (file.path === undefined) {
            return;
        }

        zip.file(file.path, file);
    });

    const archiveBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 9 }
    });

    return new File([archiveBlob], `files-${id}.zip`, { type: archiveBlob.type });
};

const uploadFile = (id: string | number, file: File): Promise<FileData> => {
    const data = new FormData();
    data.append("file", file, file.name);

    return mainAPI
        .post(`/api/orders/${id}/files/upload`, data, {
            headers: {
                ...authHeader(),
                // @ts-ignore
                "Content-Type": `multipart/form-data; boundary=${data?._boundary}`
            },
            timeout: 30000
        })
        .then(({ data }) => data.data);
};

const uploadLargeFile = (
    id: string | number,
    file: File,
    onUploadProgress: (progress: number) => void,
    onComplete: () => void
) => {
    const data = new FormData();
    data.append("file", file, file.name);

    const resumable = createResumbale(`${CONFIG.baseURL}/api/orders/${id}/files/upload/partial`);

    resumable.on("fileAdded", () => {
        resumable.upload();
    });

    resumable.on("progress", () => {
        onUploadProgress(Number((resumable.progress() * 100).toFixed()));
    });

    resumable.on("complete", () => {
        onComplete();
    });

    resumable.addFile(file);
};

const uploadFolderFile = (
    id: string | number,
    file: File,
    path: string,
    uploadId: string,
    isLast: boolean
): Promise<void> => {
    const data = new FormData();
    data.append("file", file, file.name);

    return new Promise((resolve, reject) => {
        const resumable = createResumbale(
            `${CONFIG.baseURL}/api/orders/${id}/files/upload/zip?path=${path}&id=${uploadId}&isLast=${isLast}`
        );

        resumable.on("fileAdded", () => {
            resumable.upload();
        });

        resumable.on("complete", () => {
            resolve();
        });

        resumable.on("error", () => {
            reject();
        });

        resumable.addFile(file);
    });
};

const downloadFile = async ({
    url,
    name,
    isDirectLink,
    orderId,
    id
}: { isDirectLink?: boolean; orderId: number } & Pick<FileData, "url" | "name" | "id">) => {
    if (isDirectLink) {
        FileSaver.saveAs(url, name);
        return;
    }

    const config: AxiosRequestConfig = {
        responseType: "blob",
        timeout: 30000
    };

    try {
        await mainAPI.get(url, config).then(response => FileSaver.saveAs(response.data, name));
    } catch (err) {
        const resp = await mainAPI.get(`/api/orders/${orderId}/files/${id}/`);

        await mainAPI.get(resp.data.data.url, config).then(response => FileSaver.saveAs(response.data, name));
    }
};

const deleteFile = async (id: number, fileId: number): Promise<{ data: OrderState }> => {
    return await mainAPI.delete(`/api/orders/${id}/files/${fileId}/remove`).then(resp => resp.data);
};

export const fileService = {
    deleteFile,
    downloadFile,
    uploadFile,
    uploadLargeFile,
    uploadFolderFile,
    zipFiles
};
