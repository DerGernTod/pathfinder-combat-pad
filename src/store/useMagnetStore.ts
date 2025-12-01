import type { MagnetData } from "../components/MagnetStash/components/magnet-kind-types";
import { MagnetKind } from "../components/MagnetStash/components/magnet-kind-types";
import { create } from "zustand/react";
import { persist } from "zustand/middleware";
import { produce } from "immer";
import { EntityKind } from "../constants";

interface MagnetStore {
    magnets: MagnetData<MagnetKind>[];
    draggedMagnetId: number;
    highlightedMagnetId: number;
    createAndDragMagnet(this: void, magnetData: Omit<MagnetData<MagnetKind>, "id">): void;
    createMagnetsForEntities(this: void, entities: { id: number; color: string; kind: EntityKind }[]): void;
    deleteMagnet(this: void, magnetId: number, skipLinkedDeletion?: boolean): void;
    dragMagnet(this: void, magnetId: number): void;
    dropMagnet(this: void, magnetId: number): void;
    rotateMagnet(this: void, magnetId: number): void;
    setMagnetLocation(this: void, magnetId: number, location: MagnetData<MagnetKind>["location"]): void;
    setMagnetImage(this: void, magnetId: number, image: string): void;
    setHighlightedMagnet(this: void, magnetId: number): void;
}

export const useMagnetStore = create<MagnetStore>()(persist((set) => ({
    createAndDragMagnet(this: void, magnetData: Omit<MagnetData<MagnetKind>, "id">) {
        set(produce(function updateState(recipe: MagnetStore) {
            const newMagnetId = findHighestId(recipe) + 1;
            recipe.magnets.push({
                ...magnetData,
                id: newMagnetId
            });
        }));
    },
    createMagnetsForEntities(this: void, entities: { id: number; color: string; kind: EntityKind }[]) {
        set(produce(function updateState(recipe: MagnetStore) {
            const baseId = findHighestId(recipe) + 1;
            const gridSize = 60; // Size of each magnet
            const spacing = 10; // Space between magnets
            const startX = 100; // Starting X position
            const startY = 100; // Starting Y position
            const columns = 5; // Number of columns in the grid

            entities.forEach((entity, index) => {
                // Check if this entity already has a linked magnet
                const existingMagnet = recipe.magnets.find(m => m.linkedEntityId === entity.id);
                if (existingMagnet) {
                    return; // Skip if magnet already exists
                }

                const row = Math.floor(index / columns);
                const col = index % columns;
                const left = startX + col * (gridSize + spacing);
                const top = startY + row * (gridSize + spacing);

                recipe.magnets.push({
                    id: baseId + index,
                    location: { left, top },
                    rotation: 0,
                    kind: entityKindToMagnetKind(entity.kind),
                    isDragging: false,
                    details: entity.color,
                    linkedEntityId: entity.id,
                });
            });
        }));
    },
    deleteMagnet(this: void, magnetId: number, skipLinkedDeletion = false) {
        // Get the magnet before deleting to check for linked entity
        const magnet = useMagnetStore.getState().magnets.find(m => m.id === magnetId);

        set(produce(function updateState(recipe: MagnetStore) {
            const index = recipe.magnets.findIndex(magnet => magnet.id === magnetId);
            recipe.magnets.splice(index, 1);
        }));

        // Also delete the linked entity if it exists
        if (!skipLinkedDeletion && magnet?.linkedEntityId) {
            // Use dynamic import to avoid circular dependency
            void import("./useEntityStore").then(({ useEntityStore }) => {
                const entityStore = useEntityStore.getState();
                entityStore.removeEntity(magnet.linkedEntityId!, true);
            });
        }
    },
    dragMagnet(this: void, magnetId: number) {
        set(produce(function updateState(recipe: MagnetStore) {
            const magnet = recipe.magnets.find(magnet => magnet.id === magnetId);
            if (!magnet) {
                throw new Error(`Couldn't find magnet with id ${magnetId} while trying to start drag!`);
            }
            magnet.isDragging = true;
            recipe.draggedMagnetId = magnetId;
        }));
    },
    draggedMagnetId: -1,
    dropMagnet(this: void) {
        set(produce(function updateState(recipe: MagnetStore) {
            const magnet = recipe.magnets.find(magnet => magnet.isDragging);
            if (!magnet) {
                throw new Error("Couldn't find a dragged magnet to stop dragging!");
            }
            magnet.isDragging = false;
            recipe.draggedMagnetId = -1;
        }));
    },
    magnets: [],
    rotateMagnet(this: void, magnetId: number): void {
        set(produce(function updateState(recipe: MagnetStore) {
            const magnet = recipe.magnets.find(magnet => magnet.id === magnetId);
            if (!magnet) {
                throw new Error(`Couldn't find magnet with id ${magnetId} while trying to rotate!`);
            }
            magnet.rotation += 90;
        }))
    },
    setMagnetImage(this: void, magnetId: number, image: string): void {
        set(produce(function updateState(recipe: MagnetStore) {
            const magnet = recipe.magnets.find(magnet => magnet.id === magnetId);
            if (!magnet) {
                throw new Error(`Couldn't find magnet with id ${magnetId} while trying to update image!`);
            }
            magnet.details = image;
        }));
    },
    setMagnetLocation(this: void, magnetId: number, location: MagnetData<MagnetKind>["location"]): void {
        set(produce(function updateState(recipe: MagnetStore) {
            const magnet = recipe.magnets.find(magnet => magnet.id === magnetId);
            if (!magnet) {
                throw new Error(`Couldn't find magnet with id ${magnetId} while trying to update location!`);
            }
            magnet.location = location;
        }));
    },
    highlightedMagnetId: -1,
    setHighlightedMagnet(this: void, magnetId: number): void {
        set(produce(function updateState(recipe: MagnetStore) {
            recipe.highlightedMagnetId = magnetId;
        }));
    }
}), { name: "magnet-store" }));

function entityKindToMagnetKind(entityKind: EntityKind): MagnetKind {
    switch (entityKind) {
        case EntityKind.PlayerCharacter: {
            return MagnetKind.PlayerToken;
        }
        case EntityKind.NonPlayerCharacter: {
            return MagnetKind.NPCToken;
        }
        case EntityKind.Monster: {
            return MagnetKind.MonsterToken;
        }
        case EntityKind.Hazard: {
            return MagnetKind.HazardToken;
        }
    }
}

function findHighestId(store: MagnetStore): number {
    return store.magnets.reduce((acc, magnet) => Math.max(acc, magnet.id), 0);
}