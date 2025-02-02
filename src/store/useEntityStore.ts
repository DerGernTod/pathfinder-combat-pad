import { create } from "zustand";
import { produce } from "immer";

export interface Entity {
    id: number;
    name: string;
    kind: EntityKind;
    level: number;
    status: number;
}

export const enum EntityKind {
    PlayerCharacter = 0,
    NonPlayerCharacter = 1,
    Monster = 2,
    Hazard = 3
}

interface EntityStore {
    entities: Entity[];
    addEntity(this: void, entity: Omit<Entity, "id">): void;
    removeEntity(this: void, id: number): void;
    swapEntities(this: void, id1: number, id2: number): void;

    draggedEntityId: number | null;
    setDraggedEntityId(this: void, id: number | null): void;

    setStatus(this: void, id: number, status: number): void;
}

let curId = 0;

export const useEntityStore = create<EntityStore>()((set) => ({
    addEntity(this: void, entity: Omit<Entity, "id" | "priority">) {
        set(produce(function updateState(recipe: EntityStore): void {
            recipe.entities.push({
                ...entity,
                id: curId++,
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
        console.warn("setting dragged entity to", id);
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
            console.warn("swapping entities", id1, id2, "got indices", entityIndex1, entityIndex2);
            if (entityIndex1 !== -1 && entityIndex2 !== -1) {
                const temp = recipe.entities[entityIndex1];
                recipe.entities[entityIndex1] = recipe.entities[entityIndex2];
                recipe.entities[entityIndex2] = temp;
            }
        }));
    }
}));
