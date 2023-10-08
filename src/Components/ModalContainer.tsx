/** @jsxImportSource @emotion/react */
import React, { PropsWithChildren } from "react";
import { css } from "@emotion/react";

interface Props {
    display: string;
}

const style = {
    modalInnerContainer: css({
        backgroundColor: "#fefefe",
        borderRadius: "15px",
        margin: "auto",
        padding: "20px",
        border: "1px solid #888",
        width: "80%",
        maxWidth: "500px",
    }),
};

const ModalContainer = (props: PropsWithChildren<Props>) => {
    return (
        <div
            css={{
                position: "fixed",
                zIndex: 1,
                paddingTop: "50px",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                overflow: "auto",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.4)",
                display: props.display,
            }}
        >
            <div css={style.modalInnerContainer}>{props.children}</div>
        </div>
    );
};

export default ModalContainer;
