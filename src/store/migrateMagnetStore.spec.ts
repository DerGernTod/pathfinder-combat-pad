import { describe, it, expect } from "vitest";
import { migrateMagnetStore } from "./useMagnetStore";

describe("migrateMagnetStore", () => {
    it("returns undefined when persistedState is not a MagnetStore shape", () => {
        expect(migrateMagnetStore(null)).toBeUndefined();
    });

    it("maps -1 sentinel values to null", () => {
        const persisted: unknown = { magnets: [], draggedMagnetId: -1, highlightedMagnetId: -1 };
        const migrated = migrateMagnetStore(persisted);
        function isRecord(x: unknown): x is Record<string, unknown> {
            return typeof x === "object" && x !== null;
        }
        expect(isRecord(migrated)).toBe(true);
        if (isRecord(migrated)) {
            expect(migrated.draggedMagnetId).toBeNull();
            expect(migrated.highlightedMagnetId).toBeNull();
        }
    });

    it("preserves other values", () => {
        const persisted: unknown = { magnets: [], draggedMagnetId: 7, highlightedMagnetId: null };
        const migrated = migrateMagnetStore(persisted);
        function isRecord(x: unknown): x is Record<string, unknown> {
            return typeof x === "object" && x !== null;
        }
        expect(isRecord(migrated)).toBe(true);
        if (isRecord(migrated)) {
            expect(migrated.draggedMagnetId).toBe(7);
            expect(migrated.highlightedMagnetId).toBeNull();
        }
    });
});
