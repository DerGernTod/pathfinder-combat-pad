import { style, styleVariants } from "@vanilla-extract/css";

export const scrollOverlay = style({
    gridArea: "2 / 1 / 3 / 3",
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    pointerEvents: "none",
    zIndex: 10,
    transition: "opacity 0.3s ease",
});

export const hidden = style({
    opacity: 0,
});

export const scrollOverlayButton = style({
    pointerEvents: "auto",
    padding: "12px 16px",
    margin: 0,
    touchAction: "manipulation",
    userSelect: "none",
    width: "100%",
    border: 0,
    selectors: {
        [`${hidden} &`]: {
            pointerEvents: "none",
        },
    },
});

export const scrollOverlayButtonVariants = styleVariants({
    top: {
        borderBottom: "var(--btn-border)",
    },
    bottom: {
        borderTop: "var(--btn-border)",
    },
});

export const scrollOverlayVariants = styleVariants({
    top: {
        alignItems: "flex-start",
    },
    bottom: {
        alignItems: "flex-end",
    },
});