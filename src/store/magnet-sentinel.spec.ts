import { describe, it, expect, afterEach } from "vitest";
import { useMagnetStore } from "./useMagnetStore";

describe("magnet store sentinel behavior", () => {
    afterEach(() => {
        useMagnetStore.setState({ magnets: [], draggedMagnetId: null, highlightedMagnetId: null });
    });

    it("initial sentinel values are null", () => {
        const state = useMagnetStore.getState();
        expect(state.draggedMagnetId).toBeNull();
        expect(state.highlightedMagnetId).toBeNull();
    });

    it("setHighlightedMagnet sets and can be cleared to null", () => {
        useMagnetStore.setState({ highlightedMagnetId: 5 });
        expect(useMagnetStore.getState().highlightedMagnetId).toBe(5);
        // Clear sentinel to null
        useMagnetStore.setState({ highlightedMagnetId: null });
        expect(useMagnetStore.getState().highlightedMagnetId).toBeNull();
    });
});
