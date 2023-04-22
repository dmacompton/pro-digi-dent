import React from "react";
import Loader from "react-loader-spinner";
import styled, { css } from "styled-components";

const Container = styled.div<{ $center?: boolean }>`
    display: inline-block;
    width: 80px;
    height: 80px;

    ${p =>
        p.$center &&
        css`
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto;
            left: 0;
            right: 0;
        `}
`;

export const Loading: React.VFC<{ className?: string; center?: boolean }> = ({ className, center }) => {
    return (
        <Container className={className} $center={center}>
            <Loader type="Oval" color="#00BFFF" height={80} width={80} />
        </Container>
    );
};
