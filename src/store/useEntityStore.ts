import { Entity } from "../constants";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { produce } from "immer";

interface EntityStore {
    entities: Entity[];
    addEntity(this: void, entity: Omit<Entity, "id">): void;
    removeEntity(this: void, id: number): void;
    swapEntities(this: void, id1: number, id2: number): void;

    draggedEntityId: number | null;
    setDraggedEntityId(this: void, id: number | null): void;

    setStatus(this: void, id: number, status: number): void;
}

export const useEntityStore = create<EntityStore>()(persist((set) => ({
    addEntity(this: void, entity: Omit<Entity, "id" | "priority">) {
        set(produce(function updateState(recipe: EntityStore): void {
            const newEntityId = findHighestId(recipe) + 1;
            recipe.entities.push({
                ...entity,
                id: newEntityId,
            });
        }));
    },
    draggedEntityId: null,
    entities: [],
    removeEntity(this: void, id: number): void {
        set(produce(function updateState(recipe: EntityStore): void {
            recipe.entities = recipe.entities.filter(entity => entity.id !== id);
        }));
    },
    setDraggedEntityId(this: void, id: number | null): void {
        set({ draggedEntityId: id });
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
                const temp = recipe.entities[entityIndex1];
                recipe.entities[entityIndex1] = recipe.entities[entityIndex2];
                recipe.entities[entityIndex2] = temp;
            }
        }));
    }
}), { name: "entity-store" }));

function findHighestId(store: EntityStore): number {
    return store.entities.reduce((acc, entity) => Math.max(acc, entity.id), 0);
}