import type { Entity } from "../constants";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { produce } from "immer";

interface EntityStore {
    entities: Entity[];
    addEntity(this: void, entity: Omit<Entity, "id">): void;
    removeEntity(this: void, id: number, skipLinkedDeletion?: boolean): void;
    swapEntities(this: void, id1: number, id2: number): void;

    draggedEntityId: number | null;
    setDraggedEntityId(this: void, id: number | null): void;

    setDamageTaken(this: void, id: number, damageTaken: number): void;
    setEntities(this: void, entities: Entity[]): void;
    setStatus(this: void, id: number, status: number): void;

    highlightedEntityId: number | null;
    setHighlightedEntityId(this: void, id: number | null): void;

    activeEntityId: number | null;
    cycleTurn(this: void): void;
}

export const useEntityStore = create<EntityStore>()(persist((set) => ({
    activeEntityId: null,
    cycleTurn(this: void) {
        set(produce(function updateState(recipe: EntityStore) {
            const { entities, activeEntityId } = recipe;
            if (entities.length === 0) {
                recipe.activeEntityId = null;
                return;
            }

            if (activeEntityId === null) {
                recipe.activeEntityId = entities[0].id;
                return;
            }

            const currentIndex = entities.findIndex(e => e.id === activeEntityId);
            if (currentIndex === -1) {
                // Current active entity not found (maybe deleted), start over
                recipe.activeEntityId = entities[0].id;
            } else {
                const nextIndex = (currentIndex + 1) % entities.length;
                recipe.activeEntityId = entities[nextIndex].id;
            }
        }));
    },
    highlightedEntityId: null,
    setHighlightedEntityId(this: void, id: number | null): void {
        set({ highlightedEntityId: id });
    },
    addEntity(this: void, entity: Omit<Entity, "id" | "priority">) {
        set(produce(function updateState(recipe: EntityStore): void {
            const newEntityId = findHighestId(recipe) + 1;
            recipe.entities.push({
                ...entity,
                id: newEntityId,
            });

            // If this is the first entity, set it as active
            if (recipe.activeEntityId === null) {
                recipe.activeEntityId = newEntityId;
            }
        }));
    },
    draggedEntityId: null,
    entities: [],
    removeEntity(this: void, id: number, skipLinkedDeletion = false): void {
        set(produce(function updateState(recipe: EntityStore): void {
            // Handle active entity deletion logic
            if (recipe.activeEntityId === id) {
                const currentIndex = recipe.entities.findIndex(e => e.id === id);
                if (recipe.entities.length <= 1) {
                    // Last entity being deleted
                    recipe.activeEntityId = null;
                } else {
                    // Move to next entity, or wrap to first if it was the last one
                    const nextIndex = (currentIndex + 1) % recipe.entities.length;
                    recipe.activeEntityId = recipe.entities[nextIndex].id;
                }
            }

            recipe.entities = recipe.entities.filter(entity => entity.id !== id);
        }));

        // Also delete the linked magnet if it exists
        if (!skipLinkedDeletion) {
            // Use dynamic import to avoid circular dependency
            void import("./useMagnetStore").then(({ useMagnetStore }) => {
                const magnetStore = useMagnetStore.getState();
                const linkedMagnet = magnetStore.magnets.find((m: { linkedEntityId?: number }) => m.linkedEntityId === id);
                if (linkedMagnet) {
                    magnetStore.deleteMagnet(linkedMagnet.id, true);
                }
            });
        }
    },
    setDamageTaken(this: void, id: number, damageTaken: number): void {
        set(produce(function updateState(recipe: EntityStore): void {
            const entity = recipe.entities.find(entity => entity.id === id);
            if (!entity) {
                throw new Error(`Tried to set damage taken for non-existing Entity ${id}`);
            }
            entity.damageTaken = damageTaken;
        }));
    },
    setDraggedEntityId(this: void, id: number | null): void {
        set({ draggedEntityId: id });
    },
    setEntities(this: void, entities: Entity[]): void {
        set({ entities });
    },
    setStatus(this: void, id: number, status: number): void {
        set(produce(function updateState(recipe: EntityStore): void {
            const entity = recipe.entities.find(entity => entity.id === id);
            if (!entity) {
                throw new Error(`Tried to increase status for non-existing Entity ${id}`);
            }
            entity.status = status;
        }));
    },
    swapEntities(this: void, id1: number, id2: number): void {
        set(produce(function updateState(recipe: EntityStore): void {
            const entityIndex1 = recipe.entities.findIndex(entity => entity.id === id1);
            const entityIndex2 = recipe.entities.findIndex(entity => entity.id === id2);
            if (entityIndex1 !== -1 && entityIndex2 !== -1) {
                [recipe.entities[entityIndex1], recipe.entities[entityIndex2]] = [recipe.entities[entityIndex2], recipe.entities[entityIndex1]];
            }
        }));
    },
}), { name: "entity-store" }));

function findHighestId(store: EntityStore): number {
    return store.entities.reduce((acc, entity) => Math.max(acc, entity.id), 0);
}
