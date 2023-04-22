import { fileService } from "../../../services/file.service";

// @ts-ignore
export const uploadFile = async (id: string | number, file: File) => {
    try {
        console.log({
            type: "UPLOAD_FILE_REQUEST"
        });

        await fileService.uploadFile(id, file);

        console.log({
            type: "UPLOAD_FILE_SUCCESS"
        });
    } catch (error) {
        console.log({
            type: "UPLOAD_FILE_ERROR"
        });

        console.log("Something went wrong while uploading this file", error);
    }
};
