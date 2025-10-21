
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { produce } from "immer";

type CanvasContents = Record<string, string>;

export interface CanvasStore {
    canvases: CanvasContents;
    updateCanvas(this: void, id: string, data: string): void;
}

export const useCanvasStore = create<CanvasStore>()(persist((set) => ({
    canvases: {},
    updateCanvas(this: void, id: string, data: string): void {
        set(produce(function updateState(recipe: CanvasStore) {
            recipe.canvases[id] = data;
        }));
    },
}), { name: "canvas-store" }));
