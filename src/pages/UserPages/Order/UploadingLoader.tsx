import { UPLOADING_STATUS } from "./constant";
import { Loading } from "../../../components/Loading";
import { assertInvalidValue } from "../../../assert/assert-never";
import { InboxOutlined } from "@ant-design/icons";
import styled from "styled-components";

const PreparingArchive = styled.div`
    display: flex;
    align-items: center;
    font-size: 24px;

    height: 80px;
    animation: pulse 3s infinite;

    @keyframes pulse {
        0% {
            opacity: 0.2;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.2;
        }
    }
`;

type Props = { status: UPLOADING_STATUS };

export const UploadingLoader: React.FC<Props> = ({ status }) => {
    switch (status) {
        case UPLOADING_STATUS.IN_PROGRESS:
            return <Loading />;
        case UPLOADING_STATUS.PREPARING_ARCHIVE:
            return <PreparingArchive>Preparing archive for uploading!</PreparingArchive>;
        case UPLOADING_STATUS.NOT_PROGRESS:
            return (
                <div className="ant-upload-container">
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                </div>
            );
        default:
            return assertInvalidValue(status);
    }
};
