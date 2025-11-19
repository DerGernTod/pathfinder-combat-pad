import { style, styleVariants } from "@vanilla-extract/css";
import type { StyleRule } from "@vanilla-extract/css";

const baseNumberSlot = {
    alignItems: "flex-start",
    backgroundColor: "#f3f3f3",
    border: "1px solid gray",
    borderRadius: "8px",
    display: "flex",
    overflow: "hidden",
    width: "2rem"
} satisfies Partial<StyleRule>;

const baseFlexCenter = {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
} satisfies Partial<StyleRule>;

export const numberSlot = styleVariants({
    collapsed: {
        ...baseNumberSlot,
        height: "100%"
    },
    expanded: {
        ...baseNumberSlot,
        justifyContent: "center",
        height: "5rem",
    }
});

export const slotList = style({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "fit-content"
});

export const item = style({
    ...baseFlexCenter,
    width: "100%",
    transition: "opacity 0.3s",
    color: "black",
    opacity: 0.25,
});

export const selected = style({
    opacity: 1,
});

export const valueView = style({
    ...baseFlexCenter,
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
