/** @jsxImportSource @emotion/react */
import React, { SyntheticEvent } from "react";
import { css } from "@emotion/react";

interface Props {
    e: () => void;
}

const style = {
    container: css({
        position: "relative",
    }),
    addButton: css({
        backgroundColor: "darkblue",
        position: "fixed",
        bottom: "40px",
        right: "25px",
        zIndex: 20,
        borderRadius: "50%",
        border: "2px solid #fff",
        height: "50px",
        width: "50px",
        color: "#fff",
        cursor: "pointer",
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        fontSize: "20px",
    }),
};

const AddButton: React.FC<Props> = (props) => {
    return (
        <div css={style.container}>
            <span css={style.addButton} onClick={props.e}>
                +
            </span>
        </div>
    );
};

export default AddButton;
