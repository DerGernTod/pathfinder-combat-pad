import { style, styleVariants } from "@vanilla-extract/css";

export const numberSlot = styleVariants({
    collapsed: {
        alignItems: "flex-start",
        backgroundColor: "#f3f3f3",
        border: "1px solid gray",
        borderRadius: "8px",
        display: "flex",
        height: "100%",
        overflow: "hidden",
        width: "2rem"
    },
    expanded: {
        alignItems: "flex-start",
        backgroundColor: "#f3f3f3",
        border: "1px solid gray",
        borderRadius: "8px",
        display: "flex",
        height: "5rem",
        overflow: "hidden",
        width: "2rem",
    }
});

export const slotList = style({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "fit-content"
});

export const item = style({
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    transition: "opacity 0.3s",
    color: "black",
    opacity: 0.25,
});

export const selected = style({
    opacity: 1,
});

export const valueView = style({
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    color: "black",
    cursor: "pointer",
    width: "100%",
    height: "100%",
    selectors: {
        "&:hover": {
            backgroundColor: "#e0e0e0",
        },
    },
});
