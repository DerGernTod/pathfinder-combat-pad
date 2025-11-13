import { style, styleVariants } from "@vanilla-extract/css";

export const numberSlot = style({
    alignItems: "flex-start",
    backgroundColor: "#f3f3f3",
    border: "1px solid gray",
    borderRadius: "8px",
    display: "flex",
    height: "100%",
    overflow: "hidden",
});

export const slotList = style({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
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
});
