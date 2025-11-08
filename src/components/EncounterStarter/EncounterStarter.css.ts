import { style, styleVariants } from "@vanilla-extract/css";

export const modalHeight = "80vh";

const easeTime = 0.2;

const sharedModalContainer = {
    alignItems: "center",
    bottom: `calc(-1 * ${modalHeight} + 50px)`,
    display: "flex",
    flexDirection: "column",
    height: modalHeight,
    justifyContent: "flex-start",
    overflow: "hidden",
    position: "fixed",
    transition: `all ${easeTime}s ease-in-out`,
    width: "70vw",
    zIndex: 1000,
} as const;

export const modalContainer = styleVariants({
    active: {
        ...sharedModalContainer,
        transform: `translateY(calc(-1 * ${modalHeight} + 50px))`,
    },
    default: sharedModalContainer,
});

const sharedEncounterButton = {
    alignItems: "center",
    backgroundColor: "#5d3535",
    border: 0,
    color: "white",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    transition: `all ${easeTime}s ease-in-out`,
    zIndex: 100,
} as const;

export const encounterButton = styleVariants({
    active: {
        ...sharedEncounterButton,
        borderRadius: "10px 10px 0 0",
        height: "5rem",
        margin: 0,
        selectors: {
            "&:active": {
                borderLeft: "1px solid #411212ff",
                borderRight: "1px solid #411212ff",
                borderTop: "1px solid #411212ff",
            },
            "&:hover": {
                backgroundColor: "#6d4646",
            },
        },
        width: "100%",
    },
    default: {
        ...sharedEncounterButton,
        borderRadius: 0,
        height: "50px",
        lineHeight: "50px",
        margin: "0 auto",
        selectors: {
            "&:active": {
                borderLeft: "1px solid #411212ff",
                borderRight: "1px solid #411212ff",
                borderTop: "1px solid #411212ff",
            },
            "&:hover": {
                backgroundColor: "#6d4646",
            },
        },
        width: "24rem",
    },
});

const sharedText = {
    position: "absolute",
} as const;

export const headerText = styleVariants({
    active: {
        ...sharedText,
        fontSize: "2.5rem",
        scale: 1,
        transition: `scale ${easeTime}s ease-in`,
    },
    default: {
        ...sharedText,
        fontSize: "2.5rem",
        scale: 0,
        transition: `scale ${easeTime}s ease-out`,
    },
});

export const buttonText = styleVariants({
    active: {
        ...sharedText,
        opacity: 0,
    },
    default: {
        ...sharedText,
        opacity: 1,
    },
});

const sharedModalBody = {
    alignItems: "center",
    backgroundColor: "#efe8de",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    justifyContent: "center",
    transformOrigin: "top",
    transition: `all ${easeTime}s ease-in-out`,
    zIndex: 99,
    overflow: "hidden",
} as const;

export const modalBody = styleVariants({
    active: {
        ...sharedModalBody,
        height: "calc(100vh - 60px)",
        width: "100%",
    },
    default: {
        ...sharedModalBody,
        height: 0,
        width: "24rem",
    },
});

export const encounterSelectionBody = style({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    height: "100%",
    minHeight: 0,
});

export const encounterSelectionBodyChild = style({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    margin: "0 1rem",
    /* allow children to shrink below their content size so overflow works */
    minHeight: 0,
    selectors: {
        "&:first-child": {
            marginRight: ".5rem",
        },
        "&:last-child": {
            marginLeft: ".5rem",
        },
    },
});

export const bodySeparator = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flexBasis: "3rem",
    flexShrink: 1,
    flexGrow: 0,
    margin: 0
});

export const horizontalBarStyle = style({
    height: "2px",
    margin: "1rem 1rem",
    backgroundColor: "var(--parchment)",
});

export const verticalBarStyle = style({
    width: "2px",
    margin: "1rem 0",
    height: "100%",
    backgroundColor: "var(--parchment)",
});

export const encounterHeaderStyle = style({
    textAlign: "center",
    marginBottom: "0",
});

const startEncounterButton = {
    padding: "0.5rem 1rem",
    margin: "1rem"
} as const;

export const startEncounterButtonStyle = styleVariants({
    active: {
        ...startEncounterButton,
        opacity: 1,
        transition: `opacity ${easeTime / 2}s ${easeTime / 2}s ease-in`,
    },
    default: {
        ...startEncounterButton,
        opacity: 0,
        transition: `opacity ${easeTime * 0.75}s ease-out`,
    },
});

export const startEncounterButtonSectionStyle = style({
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: "fit-content",
});
export const scrollableListStyle = style({
    overflowY: "auto",
    flex: "1 1 auto",
    minHeight: 0,
});
