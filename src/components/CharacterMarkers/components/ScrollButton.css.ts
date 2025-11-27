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
    visibility: "visible",
    transition: "opacity 0.3s ease, visibility 0.3s ease",
});

export const scrollAttached = style({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    pointerEvents: "none",
    zIndex: 10,
    visibility: "visible",
    transition: "opacity 0.3s ease, visibility 0.3s ease",
});

export const hidden = style({
    opacity: 0,
    visibility: "hidden",
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

export const scrollOverlayButtonAttached = style({
    height: "48px",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
});

export const scrollOverlayVariants = styleVariants({
    top: {
        alignItems: "flex-start",
    },
    bottom: {
        alignItems: "flex-end",
    },
});