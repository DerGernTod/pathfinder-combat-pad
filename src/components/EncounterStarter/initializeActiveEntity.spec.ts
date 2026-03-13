import { describe, it, expect, afterEach } from "vitest";
import { useEntityStore } from "../../store/useEntityStore";
import { initializeActiveEntity } from "./initializeActiveEntity";

describe("initializeActiveEntity helper", () => {
    afterEach(() => {
        // restore store state to a minimal shape
        useEntityStore.setState({ entities: [], activeEntityId: null });
    });

    it("resets activeEntityId to first entity when starting encounter (always reset)", () => {
        const finalEntities = [
            { id: 10, name: "A", kind: 0, level: 1, status: 0, damageTaken: 0 },
            { id: 11, name: "B", kind: 0, level: 1, status: 0, damageTaken: 0 },
        ];
        useEntityStore.setState({ entities: finalEntities, activeEntityId: null });
        initializeActiveEntity(finalEntities);
        const { activeEntityId } = useEntityStore.getState();
        expect(activeEntityId).toBe(10);
    });

    it("resets activeEntityId to first entity even if already set", () => {
        const finalEntities = [
            { id: 20, name: "X", kind: 0, level: 1, status: 0, damageTaken: 0 },
            { id: 21, name: "Y", kind: 0, level: 1, status: 0, damageTaken: 0 },
        ];
        useEntityStore.setState({ entities: finalEntities, activeEntityId: 21 });
        initializeActiveEntity(finalEntities);
        const { activeEntityId } = useEntityStore.getState();
        // expect reset to first entity (20)
        expect(activeEntityId).toBe(20);
    });
});
