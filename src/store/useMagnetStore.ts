import type { MagnetData } from "../components/MagnetStash/components/magnet-kind-types";
import { MagnetKind } from "../components/MagnetStash/components/magnet-kind-types";
import { create } from "zustand/react";
import { persist } from "zustand/middleware";
import { produce } from "immer";
import { EntityKind } from "../constants";

interface MagnetStore {
    magnets: MagnetData<MagnetKind>[];
    draggedMagnetId: number | null;
    highlightedMagnetId: number | null;
    createAndDragMagnet(this: void, magnetData: Omit<MagnetData<MagnetKind>, "id">): void;
    createMagnetsForEntities(
        this: void,
        entities: { id: number; color: string; kind: EntityKind }[],
    ): void;
    deleteMagnet(this: void, magnetId: number, skipLinkedDeletion?: boolean): void;
    dragMagnet(this: void, magnetId: number): void;
    dropMagnet(this: void, magnetId: number): void;
    rotateMagnet(this: void, magnetId: number): void;
    setMagnetLocation(
        this: void,
        magnetId: number,
        location: MagnetData<MagnetKind>["location"],
    ): void;
    setMagnetImage(this: void, magnetId: number, image: string): void;
    setHighlightedMagnet(this: void, magnetId: number | null): void;
}

export const useMagnetStore = create<MagnetStore>()(
    persist(
        (set) => ({
            createAndDragMagnet(this: void, magnetData: Omit<MagnetData<MagnetKind>, "id">) {
                set(
                    produce(function updateState(recipe: MagnetStore) {
                        const newMagnetId = findHighestId(recipe) + 1;
                        recipe.magnets.push({
                            ...magnetData,
                            id: newMagnetId,
                        });
                    }),
                );
            },

            createMagnetsForEntities(
                this: void,
                entities: { id: number; color: string; kind: EntityKind }[],
            ) {
                set(
                    produce(function updateState(recipe: MagnetStore) {
                        const baseId = findHighestId(recipe) + 1;
                        const gridSize = 60; // Size of each magnet
                        const spacing = 10; // Space between magnets
                        const columns = 5; // Number of columns in the grid

                        const sidebarOffset = 575;
                        const availableWidth = window.innerWidth - sidebarOffset;
                        const availableHeight = window.innerHeight - 100;

                        const totalMagnets = entities.length;
                        const rows = Math.ceil(totalMagnets / columns);
                        const gridWidth =
                            Math.min(totalMagnets, columns) * (gridSize + spacing) - spacing;
                        const gridHeight = rows * (gridSize + spacing) - spacing;

                        const startX =
                            sidebarOffset + Math.max(0, (availableWidth - gridWidth) / 2);
                        const startY = Math.max(100, (availableHeight - gridHeight) / 2);

                        const entityIds = new Set(entities.map((e) => e.id));
                        const magnetsToRemove: number[] = [];

                        recipe.magnets.forEach((magnet) => {
                            if (
                                magnet.linkedEntityId !== undefined &&
                                !entityIds.has(magnet.linkedEntityId)
                            ) {
                                magnetsToRemove.push(magnet.id);
                            }
                        });

                        if (magnetsToRemove.length > 0) {
                            recipe.magnets = recipe.magnets.filter(
                                (m) => !magnetsToRemove.includes(m.id),
                            );
                        }

                        entities.forEach((entity, index) => {
                            const existingMagnet = recipe.magnets.find(
                                (m) => m.linkedEntityId === entity.id,
                            );
                            if (existingMagnet) {
                                return;
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
                    }),
                );
            },

            deleteMagnet(this: void, magnetId: number, skipLinkedDeletion = false) {
                const magnet = useMagnetStore.getState().magnets.find((m) => m.id === magnetId);

                set(
                    produce(function updateState(recipe: MagnetStore) {
                        const index = recipe.magnets.findIndex((magnet) => magnet.id === magnetId);
                        recipe.magnets.splice(index, 1);
                    }),
                );

                if (!skipLinkedDeletion && magnet?.linkedEntityId) {
                    void import("./useEntityStore").then(({ useEntityStore }) => {
                        const entityStore = useEntityStore.getState();
                        entityStore.removeEntity(magnet.linkedEntityId!, true);
                    });
                }
            },

            dragMagnet(this: void, magnetId: number) {
                set(
                    produce(function updateState(recipe: MagnetStore) {
                        const magnet = recipe.magnets.find((magnet) => magnet.id === magnetId);
                        if (!magnet) {
                            throw new Error(
                                `Couldn't find magnet with id ${magnetId} while trying to start drag!`,
                            );
                        }
                        magnet.isDragging = true;
                        recipe.draggedMagnetId = magnetId;
                    }),
                );
            },

            draggedMagnetId: null,

            dropMagnet(this: void) {
                set(
                    produce(function updateState(recipe: MagnetStore) {
                        const magnet = recipe.magnets.find((magnet) => magnet.isDragging);
                        if (!magnet) {
                            throw new Error("Couldn't find a dragged magnet to stop dragging!");
                        }
                        magnet.isDragging = false;
                        recipe.draggedMagnetId = null;
                    }),
                );
            },

            magnets: [],

            rotateMagnet(this: void, magnetId: number): void {
                set(
                    produce(function updateState(recipe: MagnetStore) {
                        const magnet = recipe.magnets.find((magnet) => magnet.id === magnetId);
                        if (!magnet) {
                            throw new Error(
                                `Couldn't find magnet with id ${magnetId} while trying to rotate!`,
                            );
                        }
                        magnet.rotation += 90;
                    }),
                );
            },

            setMagnetImage(this: void, magnetId: number, image: string): void {
                set(
                    produce(function updateState(recipe: MagnetStore) {
                        const magnet = recipe.magnets.find((magnet) => magnet.id === magnetId);
                        if (!magnet) {
                            throw new Error(
                                `Couldn't find magnet with id ${magnetId} while trying to update image!`,
                            );
                        }
                        magnet.details = image;
                    }),
                );
            },

            setMagnetLocation(
                this: void,
                magnetId: number,
                location: MagnetData<MagnetKind>["location"],
            ): void {
                set(
                    produce(function updateState(recipe: MagnetStore) {
                        const magnet = recipe.magnets.find((magnet) => magnet.id === magnetId);
                        if (!magnet) {
                            throw new Error(
                                `Couldn't find magnet with id ${magnetId} while trying to update location!`,
                            );
                        }
                        magnet.location = location;
                    }),
                );
            },

            highlightedMagnetId: null,

            setHighlightedMagnet(this: void, magnetId: number | null): void {
                set(
                    produce(function updateState(recipe: MagnetStore) {
                        recipe.highlightedMagnetId = magnetId;
                    }),
                );
            },
        }),
        {
            name: "magnet-store",
            // Migrate old persisted sentinel values (-1) to null on hydrate

            migrate: migrateMagnetStore,
        },
    ),
);

function isMagnetStore(store: unknown): store is MagnetStore {
    return (
        typeof store === "object" &&
        store !== null &&
        "magnets" in store &&
        "draggedMagnetId" in store &&
        "highlightedMagnetId" in store
    );
}

// Exported so it can be unit tested
export function migrateMagnetStore(persistedState: unknown): MagnetStore | undefined {
    if (!isMagnetStore(persistedState)) {
        return void 0;
    }
    return {
        ...persistedState,
        draggedMagnetId:
            persistedState.draggedMagnetId === -1 ? null : persistedState.draggedMagnetId,
        highlightedMagnetId:
            persistedState.highlightedMagnetId === -1 ? null : persistedState.highlightedMagnetId,
    };
}

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
