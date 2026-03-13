import { useEntityStore } from "../../store/useEntityStore";

/**
 * Initialize the active entity in the global store.
 * Behavior: if there is no active entity (null) and the provided list has entities,
 * set activeEntityId to the first entity's id. If an activeEntityId already exists,
 * preserve it. This mirrors the intended store behavior and avoids unexpectedly
 * resetting the turn when starting a new encounter.
 */
export function initializeActiveEntity(finalEntities: { id: number }[]): void {
    // Old behavior (reset active entity unconditionally when starting an encounter):
    useEntityStore.setState({
        activeEntityId: finalEntities.length ? finalEntities[0].id : null,
    });
}
