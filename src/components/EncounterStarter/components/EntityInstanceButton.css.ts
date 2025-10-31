import { style } from "@vanilla-extract/css";

export const sortableItem = style({
    ":active": {
        cursor: "grabbing",
    },
    ":hover": {
        backgroundColor: "#f0f0f0",
    },
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "grab",
    display: "flex",
    marginBottom: "4px",
    padding: "8px",
    transition: "background-color 0.2s ease",
});

export const sortableHandle = style({
    ":active": {
        cursor: "grabbing",
    },
    color: "#666",
    cursor: "grab",
    fontSize: "16px",
    marginRight: "8px"
});
