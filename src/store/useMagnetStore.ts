import type { MagnetData, MagnetKind } from "../components/MagnetStash/components/magnet-kind-types";
import { create } from "zustand/react";
import { persist } from "zustand/middleware";
import { produce } from "immer";

interface MagnetStore {
    magnets: MagnetData<MagnetKind>[];
    createAndDragMagnet(this: void, magnetData: Omit<MagnetData<MagnetKind>, "id">): void;
    deleteMagnet(this: void, magnetId: number): void;
    dragMagnet(this: void, magnetId: number): void;
    dropMagnet(this: void, magnetId: number): void;
    rotateMagnet(this: void, magnetId: number): void;
    setMagnetLocation(this: void, magnetId: number, location: MagnetData<MagnetKind>["location"]): void;
    setMagnetImage(this: void, magnetId: number, image: string): void;
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
    deleteMagnet(this: void, magnetId: number) {
        set(produce(function updateState(recipe: MagnetStore) {
            const index = recipe.magnets.findIndex(magnet => magnet.id === magnetId);
            recipe.magnets.splice(index, 1);
        }));
    },
    dragMagnet(this: void, magnetId: number) {
        set(produce(function updateState(recipe: MagnetStore) {
            const magnet = recipe.magnets.find(magnet => magnet.id === magnetId);
            if (!magnet) {
                throw new Error(`Couldn't find magnet with id ${magnetId} while trying to start drag!`);
            }
            magnet.isDragging = true;
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
    }
}), { name: "magnet-store" }));

function findHighestId(store: MagnetStore): number {
    return store.magnets.reduce((acc, magnet) => Math.max(acc, magnet.id), 0);
}