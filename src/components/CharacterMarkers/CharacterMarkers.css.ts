import { globalStyle, style } from "@vanilla-extract/css";

export const characterMarkers = style({
    flexBasis: "500px",
    flexGrow: 0,
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gridTemplateRows: "45px 1fr",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--grid-gap)",
    backgroundColor: "var(--parchment)",
    height: "100%",
    touchAction: "none",
    position: "relative",
});

export const characterMarkerHeaderBg = style({
    gridArea: "1 / 1 / 2 / 3",
    backgroundImage: "url('/img-noise-128x128 base.png'), linear-gradient(to top, var(--parchment), var(--crimson) 40%)",
    width: "100%",
    height: "100%",
});

export const initHeading = style({
    gridArea: "1 / 1 / 2 / 2",
    backgroundColor: "var(--crimson)",
});

export const initContent = style({
    gridArea: "2 / 1 / 3 / 3",
    height: "100%",
    overflow: "auto",
    scrollbarGutter: "stable horizontal",
    backgroundColor: "var(--parchment)",
    touchAction: "none",
    scrollbarWidth: "none",
    selectors: {
        "&::-webkit-scrollbar": {
            display: "none",
        },
    },
    position: "relative",
});

export const statusHeading = style({
    gridArea: "1 / 2 / 2 / 3",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridTemplateRows: "repeat(2, 1fr)",
    backgroundImage: "none",
    gap: "var(--grid-gap)",
});

export const delay = style({
    gridArea: "1 / 1 / 3 / 2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "var(--crimson)",
});

export const rotatedText = style({
    translate: "-1px -1px",
});

export const dying = style({
    gridArea: "1 / 2 / 2 / 5",
    backgroundColor: "var(--crimson)",
});

export const dyingCount = style({
    gridArea: "2 / 2 / 3 / 5",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "baseline",
    textAlign: "center",
    gap: "var(--grid-gap)",
});

export const dyingCountItem = style({
    backgroundColor: "var(--crimson)",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});

// Global styles for initContent children
globalStyle(`${initContent} > *:last-child`, {
    borderBottom: "var(--grid-gap) solid var(--parchment)",
});
