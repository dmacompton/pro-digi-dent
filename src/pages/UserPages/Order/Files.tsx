import React, { useMemo, useState } from "react";
import Viewer from "react-viewer";
import { File } from "../../../components/File/File";
import { FileData } from "../../../services/orders.service";

type Props = {
    files: FileData[];
    orderId: number;
};

export const FileImages: React.FC<Props> = ({ files, orderId }) => {
    const [activeImageIndex, setImage] = useState<undefined | number>(undefined);
    const onClick = (index: number | undefined) => () => setImage(index);

    const images = useMemo(() => files.map(file => ({ src: file.url, alt: file.name })), [files]);

    const isVisible = activeImageIndex !== undefined;

    return (
        <>
            {files.map((file, index) => (
                <File {...file} key={file.id} isImage={true} orderId={orderId} onClick={onClick(index)} />
            ))}

            <Viewer
                scalable={false}
                zoomSpeed={0.2}
                visible={isVisible}
                activeIndex={activeImageIndex}
                images={images}
                onClose={onClick(undefined)}
            />
        </>
    );
};

export const Files: React.FC<Props> = ({ files, orderId }) => {
    return (
        <>
            {files.map(file => (
                <File {...file} key={file.id} isImage={false} orderId={orderId} />
            ))}
        </>
    );
};
