import { style, styleVariants } from "@vanilla-extract/css";
import { EntityKind } from "../../../constants";

export const encounterCreaturesListStyle = style({
    display: "flex",
    flexDirection: "column",
    height: "100%",
});

export const encounterCreateSlotStyle = style({
    height: "4rem",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "1rem",
    padding: "5px",
    fontSize: "1rem",
    textShadow: "none"
});

export const encounterEntityInstanceStyle = style({
    position: "relative",
    width: "auto",
    minWidth: "0",
    flex: "0 0 auto",
    margin: 0,
    padding: "5px",
    left: 0,
});

export const encounterCountInputStyle = style({
    flex: "0 0 auto",
    height: "70%",
});

export const encounterAddButtonStyle = style({
    flex: "1 1 auto",
    height: "100%",
});

export const encounterAddButtonInnerStyle = style({
    width: "100%",
    height: "100%",
});

export const encounterCanvasStyle = style({
    borderRadius: "var(--label-border-radius) 0 0 var(--label-border-radius)",
});

const baseListItemStyle = style({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px",
    borderBottom: "1px solid #ccc",
    width: "100%",
    backgroundColor: "white",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "8px",
    cursor: "pointer",
    textAlign: "left",
    transition: "background-color 0.2s, filter 0.2s",
    selectors: {
        "&:hover": {
            backgroundColor: "white",
            filter: "saturate(1.1) brightness(0.75)",
        },
    },
});

export const creatureListItemStyle = styleVariants({
    [EntityKind.PlayerCharacter]: [baseListItemStyle, {
        borderLeft: "8px solid var(--pc-d)",
        background: "color-mix(in srgb, var(--pc), transparent 85%)"
    }],
    [EntityKind.NonPlayerCharacter]: [baseListItemStyle, {
        borderLeft: "8px solid var(--npc-d)",
        background: "color-mix(in srgb, var(--npc), transparent 85%)"
    }],
    [EntityKind.Monster]: [baseListItemStyle, {
        borderLeft: "8px solid var(--mon-d)",
        background: "color-mix(in srgb, var(--mon), transparent 85%)"
    }],
    [EntityKind.Hazard]: [baseListItemStyle, {
        borderLeft: "8px solid var(--haz-d)",
        background: "color-mix(in srgb, var(--haz), transparent 85%)"
    }],
});

export const creatureImageStyle = style({
    height: "30px",
    maxWidth: "150px",
    objectFit: "contain",
});

export const creatureInfoStyle = style({
    marginLeft: "auto",
    fontSize: "0.8em",
    color: "#666",
});

export const scrollableContent = style({
    padding: "10px",
    overflowY: "auto",
    flexGrow: 1,
    position: "relative",
    scrollbarWidth: "none",
    selectors: {
        "&::-webkit-scrollbar": {
            display: "none",
        },
    },
});

export const creatureContainerStyle = style({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
    overflow: "hidden",
});
