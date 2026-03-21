import { describe, it, expect } from "vitest";
import { migrateMagnetStore } from "./useMagnetStore";

describe("migrateMagnetStore", () => {
    it("returns null when persistedState is null", () => {
        expect(migrateMagnetStore(null)).toBeNull();
    });

    it("maps -1 sentinel values to null", () => {
        const persisted = { magnets: [], draggedMagnetId: -1, highlightedMagnetId: -1 };
        const migrated = migrateMagnetStore(persisted as any);
        expect(migrated.draggedMagnetId).toBeNull();
        expect(migrated.highlightedMagnetId).toBeNull();
    });

    it("preserves other values", () => {
        const persisted = { magnets: [], draggedMagnetId: 7, highlightedMagnetId: null };
        const migrated = migrateMagnetStore(persisted as any);
        expect(migrated.draggedMagnetId).toBe(7);
        expect(migrated.highlightedMagnetId).toBeNull();
    });
});
