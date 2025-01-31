import { create } from "zustand";
import { produce } from "immer";

export interface Entity {
    id: number;
    name: string;
    status: EntityStatus;
}

export const enum EntityStatus {
    PlayerCharacter,
    NonPlayerCharacter,
    Monster,
    Hazard
}

interface EntityStore {
    entities: Entity[];
    addEntity(entity: Omit<Entity, "id" | "priority">): void;
    removeEntity(id: number): void;
    swapEntityWithHigherPriority(id: number): void;
    swapEntityWithLowerPriority(id: number): void;
}

let curId = 0;

export const useEntityStore = create<EntityStore>()((set) => ({
    entities: [],
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
    swapEntityWithHigherPriority(id: number): void {
        set(produce(function updateState(recipe: EntityStore): void {
            const entityIndex = recipe.entities.findIndex(entity => entity.id === id);
            const curEntity = recipe.entities[entityIndex];
            const higherEntity = recipe.entities[entityIndex - 1];
            if (curEntity && higherEntity) {
                recipe.entities[entityIndex] = higherEntity;
                recipe.entities[entityIndex - 1] = curEntity;
            }
        }));
    },
    swapEntityWithLowerPriority(id: number): void {
        set(produce(function updateState(recipe: EntityStore): void {
            const entityIndex = recipe.entities.findIndex(entity => entity.id === id);
            const curEntity = recipe.entities[entityIndex];
            const lowerEntity = recipe.entities[entityIndex + 1];
            if (curEntity && lowerEntity) {
                recipe.entities[entityIndex] = lowerEntity;
                recipe.entities[entityIndex + 1] = curEntity;
            }
        }));
    }
}));
