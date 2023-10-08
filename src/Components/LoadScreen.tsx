/** @jsxImportSource @emotion/react */
import React from "react";
import { css, keyframes } from "@emotion/react";

const style = {
    layout: css({
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "25px",
    }),
    loadContainer: css({
        width: "300px",
        textAlign: "center",
        borderRadius: "5px",
        top: "35%",
        padding: "20px",
        border: "1px solid",
        opacity: "0.5",
        position: "absolute",
        fontSize: "20px",
    }),
};

const rotateKeyframes = keyframes`
    from{
        transform: rotate(0deg);
    }
    to{
        transform: rotate(360deg);
    }
`;

const LoadScreen = () => {
    return (
        <div css={style.layout}>
            <div css={style.loadContainer}>
                <div>Hey, wait for a seconds okay?</div>
                <div>We were working something for you</div>
                <div css={{ animation: `${rotateKeyframes} infinite 1s linear` }}>&#8635;</div>
            </div>
        </div>
    );
};

export default LoadScreen;
