import { create } from "zustand";
import { produce } from "immer";

export interface Entity {
    id: number;
    name: string;
    kind: EntityKind;
    level: number;
}

export const enum EntityKind {
    PlayerCharacter = 0,
    NonPlayerCharacter = 1,
    Monster = 2,
    Hazard = 3
}

interface EntityStore {
    entities: Entity[];
    addEntity(entity: Omit<Entity, "id">): void;
    removeEntity(id: number): void;
    swapEntities(id1: number, id2: number): void;

    draggedEntityId: number | null;
    setDraggedEntityId(id: number | null): void;
}

let curId = 0;

export const useEntityStore = create<EntityStore>()((set) => ({
    entities: [],
    draggedEntityId: null,
    addEntity(entity: Omit<Entity, "id" | "priority">) {
        set(produce(function updateState(recipe: EntityStore): void {
            recipe.entities.push({
                ...entity,
                id: curId++,
            });
        }));
    },
    removeEntity(id: number): void {
        set(produce(function updateState(recipe: EntityStore): void {
            recipe.entities = recipe.entities.filter(entity => entity.id !== id);
        }));
    },
    swapEntities(id1: number, id2: number): void {
        set(produce(function updateState(recipe: EntityStore): void {
            const entityIndex1 = recipe.entities.findIndex(entity => entity.id === id1);
            const entityIndex2 = recipe.entities.findIndex(entity => entity.id === id2);
            if (entityIndex1 !== -1 && entityIndex2 !== -1) {
                const temp = recipe.entities[entityIndex1];
                recipe.entities[entityIndex1] = recipe.entities[entityIndex2];
                recipe.entities[entityIndex2] = temp;
            }
        }));
    },
    setDraggedEntityId(id: number | null): void {
        set({ draggedEntityId: id });
    }
}));
