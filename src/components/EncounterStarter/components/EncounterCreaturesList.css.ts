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
    backgroundColor: "var(--crimson)",
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

/**
 * Styles for a base list item component, providing a flexible layout with hover effects.
 *
 * This style defines a flex container for list items, including padding, borders, background, and a subtle hover transition.
 * The hover effect uses a brightness filter to slightly dim the item on interaction.
 *
 * Other color-related filter options available in CSS include:
 * - `contrast()`: Adjusts the contrast of the element (e.g., `contrast(1.2)` for increased contrast).
 * - `saturate()`: Changes the saturation level (e.g., `saturate(1.5)` for more vivid colors).
 * - `hue-rotate()`: Rotates the hue of colors (e.g., `hue-rotate(90deg)` to shift colors).
 * - `sepia()`: Applies a sepia tone (e.g., `sepia(0.5)` for a partial sepia effect).
 * - `grayscale()`: Converts to grayscale (e.g., `grayscale(1)` for full grayscale).
 * - `invert()`: Inverts colors (e.g., `invert(1)` for complete inversion).
 * - `opacity()`: Adjusts transparency (e.g., `opacity(0.8)` for 80% opacity).
 * - `blur()`: Applies a blur effect (e.g., `blur(2px)` for a 2-pixel blur).
 * - `drop-shadow()`: Adds a drop shadow (e.g., `drop-shadow(2px 2px 4px rgba(0,0,0,0.5))`).
 *
 * These can be combined in the `filter` property for more complex effects.
 */
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
