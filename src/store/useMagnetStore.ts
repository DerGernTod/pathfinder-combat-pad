import { MagnetData } from "../constants";
import { create } from "zustand/react";
import { produce } from "immer";

interface MagnetStore {
    magnets: MagnetData[];
    createAndDragMagnet(this: void, magnetData: Omit<MagnetData, "id">): void;
    deleteMagnet(this: void, magnetId: number): void;
    dragMagnet(this: void, magnetId: number): void;
    dropMagnet(this: void, magnetId: number): void;
    setMagnetLocation(this: void, magnetId: number, location: MagnetData["location"]): void;
}

let curId = 0;

export const useMagnetStore = create<MagnetStore>()((set) => ({
    createAndDragMagnet(this: void, magnetData: Omit<MagnetData, "id">) {
        set(produce(function updateState(recipe: MagnetStore) {
            const newMagnetId = curId++;
            recipe.magnets.push({
                ...magnetData,
                id: newMagnetId,
                isDragging: true
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
    setMagnetLocation(this: void, magnetId: number, location: MagnetData["location"]): void {
        set(produce(function updateState(recipe: MagnetStore) {
            const magnet = recipe.magnets.find(magnet => magnet.id === magnetId);
            if (!magnet) {
                throw new Error(`Couldn't find magnet with id ${magnetId} while trying to update location!`);
            }
            magnet.location = location;
        }));
    }
}));